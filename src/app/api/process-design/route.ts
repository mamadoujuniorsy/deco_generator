import { NextResponse } from 'next/server'
import { homeDesignClient, translateToEnglish, type InteriorStyle, type RoomType } from '@/libs/homedesign'
import { put } from '@vercel/blob'
import { createDesign, updateDesignStatus } from '@/libs/models/Design'
import { DesignStatus } from '@/types/api'
import prisma from '@/libs/db'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const { roomId, imageUrl, prompt, designStyle = 'Modern', roomType = 'Living Room', aiIntervention = 'Mid' } = await request.json()

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
      aiProvider: 'homedesign',
      status: DesignStatus.PENDING,
      allImageUrls: []
    })

    // Start background processing
    processDesignInBackground(design.id, imageUrl, prompt, designStyle, roomType, aiIntervention)

    return NextResponse.json({
      designId: design.id,
      status: 'processing',
      message: 'Design generation started with Home Designs AI'
    })
  } catch (error) {
    console.error('Error processing design:', error)
    return NextResponse.json(
      { error: 'Failed to start processing' },
      { status: 500 }
    )
  }
}

async function processDesignInBackground(
  designId: string, 
  imageUrl: string, 
  prompt: string,
  designStyle: string = 'Modern',
  roomType: string = 'Living Room',
  aiIntervention: string = 'Mid'
) {
  const startTime = Date.now()
  
  try {
    // Update design to processing
    await updateDesignStatus(designId, DesignStatus.PROCESSING)

    console.log(`🎨 Processing design ${designId} with Home Designs AI...`)

    // Translate prompt
    const translatedPrompt = await translateToEnglish(prompt)

    // Generate designs using Home Designs AI (generate 2 variations)
    const result = await homeDesignClient.generateDesign({
      image: imageUrl,
      design_type: 'Interior',
      design_style: designStyle as InteriorStyle,
      room_type: roomType as RoomType,
      ai_intervention: aiIntervention as any,
      no_design: 2, // Generate 2 variations for more options
      custom_instruction: translatedPrompt,
      keep_structural_element: true,
    })

    if (!result.success || !result.output_images || result.output_images.length === 0) {
      throw new Error(result.error || 'No images generated')
    }

    console.log(`✅ Generated ${result.output_images.length} images`)

    // Upload generated images to Vercel Blob for persistent storage
    const uploadedUrls: string[] = []
    for (let i = 0; i < result.output_images.length; i++) {
      try {
        const imageUrl = result.output_images[i]
        const response = await fetch(imageUrl)
        const blob = await response.blob()
        const uploaded = await put(`design-${designId}-${i + 1}-${Date.now()}.png`, blob, { 
          access: 'public',
          addRandomSuffix: false
        })
        uploadedUrls.push(uploaded.url)
        console.log(`📤 Uploaded image ${i + 1}/${result.output_images.length}`)
      } catch (error) {
        console.error(`Error uploading image ${i + 1}:`, error)
        // If upload fails, keep the original Home Designs AI URL
        uploadedUrls.push(result.output_images[i])
      }
    }

    const processingTime = Date.now() - startTime

    // Update design with results
    await prisma.design.update({
      where: { id: designId },
      data: {
        status: DesignStatus.COMPLETED,
        allImageUrls: uploadedUrls,
        imageUrl: uploadedUrls[0], // Use first generated image as main
        processingTime,
        metadata: {
          designStyle,
          roomType,
          aiIntervention,
          attempts: result.attempts,
          generatedCount: uploadedUrls.length
        }
      }
    })

    console.log(`🎉 Design ${designId} completed in ${processingTime}ms`)

  } catch (error) {
    console.error('Background processing error:', error)
    await updateDesignStatus(designId, DesignStatus.FAILED, error instanceof Error ? error.message : 'Generation failed')
  }
}
