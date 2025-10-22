import { NextResponse } from 'next/server'
import { createDesign, getDesignsByRoomId, updateDesignStatus, updateDesign } from '@/libs/models/Design'
import { getRoomById } from '@/libs/models/Room'
import { GenerateDesignDto, DesignQuery, DesignStatus } from '@/types/api'
import { replicate } from '@/libs/replicate'
import { put } from '@vercel/blob'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const roomId = searchParams.get('roomId')

    if (!roomId) {
      return NextResponse.json(
        { success: false, error: 'Room ID is required' },
        { status: 400 }
      )
    }

    const query: DesignQuery = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
      status: searchParams.get('status') as DesignStatus,
      aiProvider: searchParams.get('aiProvider') as "openai" | "replicate"
    }

    const result = await getDesignsByRoomId(roomId, query)

    return NextResponse.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('Get designs error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get designs' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body: GenerateDesignDto = await request.json()
    const { roomId, customPrompt, aiProvider } = body

    // Get room to access the original image
    const room = await getRoomById(roomId)
    if (!room || !room.originalImageUrl) {
      return NextResponse.json(
        { success: false, error: 'Room not found or no image available' },
        { status: 400 }
      )
    }

    // Create design record
    const design = await createDesign({
      roomId,
      imageUrl: '', // Will be updated after generation
      prompt: customPrompt || 'Generate interior design',
      aiProvider: aiProvider || 'replicate',
      status: DesignStatus.PROCESSING,
      allImageUrls: []
    })

    // Generate designs using Replicate
    try {
      const outputs = await replicate.run(
        'stability-ai/stable-diffusion-xl-base-1.0:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
        {
          input: {
            prompt: `Interior design rendering of a room with: ${customPrompt || 'modern furniture, professional lighting, high quality'}. Professional, photorealistic, high quality.`,
            image: room.originalImageUrl,
            num_outputs: 3,
          },
        }
      )

      // Upload generated images to Vercel Blob
      const uploadedUrls: string[] = []
      for (const output of outputs as string[]) {
        try {
          // Fetch the image from Replicate URL
          const response = await fetch(output)
          const blob = await response.blob()
          const uploaded = await put(`design-${design.id}-${uploadedUrls.length}.png`, blob, { access: 'public' })
          uploadedUrls.push(uploaded.url)
        } catch (uploadError) {
          console.error('Error uploading generated image:', uploadError)
        }
      }

      // Update design with results
      const updatedDesign = await updateDesign(design.id, {
        imageUrl: uploadedUrls[0] || '',
        allImageUrls: uploadedUrls,
        status: DesignStatus.COMPLETED,
        processingTime: Date.now() - new Date(design.createdAt).getTime()
      })

      return NextResponse.json({
        success: true,
        data: updatedDesign
      }, { status: 201 })

    } catch (genError) {
      console.error('Generation error:', genError)
      await updateDesignStatus(design.id, DesignStatus.FAILED, genError instanceof Error ? genError.message : 'Generation failed')
      return NextResponse.json(
        { success: false, error: 'Failed to generate design' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Create design error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create design' },
      { status: 500 }
    )
  }
}
