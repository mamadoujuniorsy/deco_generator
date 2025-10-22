import { NextResponse } from 'next/server'
import { replicate } from '@/libs/replicate'
import { put } from '@vercel/blob'
import { createDesign, updateDesignStatus } from '@/libs/models/Design'
import { DesignStatus } from '@/types/api'
import prisma from '@/libs/db'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const { roomId, imageUrl, prompt } = await request.json()

    if (!roomId || !imageUrl || !prompt) {
      return NextResponse.json(
        { error: 'Missing required fields: roomId, imageUrl, prompt' },
        { status: 400 }
      )
    }

    // Check if room exists
    const room = await prisma.room.findUnique({ where: { id: roomId } })
    if (!room) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      )
    }

    // Create initial design record
    const design = await createDesign({
      roomId,
      imageUrl,
      prompt,
      aiProvider: 'replicate',
      status: DesignStatus.PENDING,
      allImageUrls: []
    })

    // Start background processing
    processDesignInBackground(design.id, imageUrl, prompt)

    return NextResponse.json({
      designId: design.id,
      status: 'processing',
      message: 'Design generation started'
    })
  } catch (error) {
    console.error('Error processing design:', error)
    return NextResponse.json(
      { error: 'Failed to start processing' },
      { status: 500 }
    )
  }
}

async function processDesignInBackground(designId: string, imageUrl: string, prompt: string) {
  try {
    // Update design to processing
    await updateDesignStatus(designId, DesignStatus.PROCESSING)

    // Generate designs using Replicate
    const outputs = await replicate.run(
      'stability-ai/stable-diffusion-xl-base-1.0:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
      {
        input: {
          prompt: `Interior design rendering of a room with: ${prompt}. Professional, photorealistic, high quality.`,
          image: imageUrl,
          num_outputs: 3,
        },
      }
    )

    // Upload generated images to Vercel Blob
    const uploadedUrls: string[] = []
    for (const output of outputs as string[]) {
      try {
        const response = await fetch(output)
        const blob = await response.blob()
        const uploaded = await put(`design-${Date.now()}.png`, blob, { access: 'public' })
        uploadedUrls.push(uploaded.url)
      } catch (error) {
        console.error('Error uploading image:', error)
      }
    }

    // Update design with results
    await prisma.design.update({
      where: { id: designId },
      data: {
        status: DesignStatus.COMPLETED,
        allImageUrls: uploadedUrls,
        imageUrl: uploadedUrls[0] || imageUrl, // Use first generated image as main
        processingTime: Date.now() - new Date().getTime() // Approximate
      }
    })

  } catch (error) {
    console.error('Background processing error:', error)
    await updateDesignStatus(designId, DesignStatus.FAILED, error instanceof Error ? error.message : 'Generation failed')
  }
}
