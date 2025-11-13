import { NextResponse } from 'next/server'
import prisma from '@/libs/db'
import { homeDesignClient, translateToEnglish } from '@/libs/homedesign'

export async function POST(request: Request) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID not found' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { roomId, projectId, prompt, style } = body

    if (!roomId || !prompt) {
      return NextResponse.json(
        { success: false, error: 'Missing roomId or prompt' },
        { status: 400 }
      )
    }

    console.log('🎨 Starting design generation...', { roomId, prompt })

    // Get room with image
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { project: true }
    })

    if (!room) {
      return NextResponse.json(
        { success: false, error: 'Room not found' },
        { status: 404 }
      )
    }

    // Verify user owns this room
    if (room.project.userId !== userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }

    if (!room.originalImageUrl) {
      return NextResponse.json(
        { success: false, error: 'No image found for this room' },
        { status: 400 }
      )
    }

    // Create design record
    const design = await prisma.design.create({
      data: {
        roomId,
        prompt,
        aiProvider: 'homedesign',
        status: 'PROCESSING',
        imageUrl: '',
        allImageUrls: [],
        metadata: { style }
      }
    })

    console.log('✅ Design record created:', design.id)

    // Generate design using Home Design AI
    try {
      // Translate prompt to English
      const translatedPrompt = await translateToEnglish(prompt)
      
      // Map room type to Home Design AI format
      const roomTypeMap: Record<string, string> = {
        'LIVING_ROOM': 'Living Room',
        'BEDROOM': 'Bedroom',
        'KITCHEN': 'Kitchen',
        'BATHROOM': 'Bathroom',
        'DINING_ROOM': 'Dining Room'
      }
      
      const homeDesignRoomType = roomTypeMap[room.type] || 'Bedroom'
      
      console.log('🚀 Calling Home Design AI...')
      console.log('📝 Room type:', room.type, '→', homeDesignRoomType)
      console.log('📝 Prompt:', translatedPrompt)
      
      const result = await homeDesignClient.generateDesign({
        image: room.originalImageUrl,
        design_type: 'Interior',
        design_style: style || 'Contemporary',
        room_type: homeDesignRoomType as any,
        ai_intervention: 'Extreme', // Plus de créativité pour respecter le prompt
        no_design: 2,
        custom_instruction: translatedPrompt,
        keep_structural_element: false // Permettre plus de changements
      })

      if (!result.success || !result.output_images || result.output_images.length === 0) {
        throw new Error(result.error || 'No images generated')
      }

      console.log('✅ Design generated successfully:', result.output_images.length, 'images')

      // Update design with results
      const updatedDesign = await prisma.design.update({
        where: { id: design.id },
        data: {
          status: 'COMPLETED',
          imageUrl: result.output_images[0] || '',
          allImageUrls: result.output_images
        }
      })

      return NextResponse.json({
        success: true,
        data: {
          designId: updatedDesign.id,
          output: result.output_images,
          status: 'COMPLETED'
        }
      })
    } catch (error: any) {
      console.error('❌ Design generation failed:', error)

      // Truncate error message if too long (max 250 chars)
      const errorMessage = error.message || 'Design generation failed'
      const truncatedError = errorMessage.length > 250 
        ? errorMessage.substring(0, 250) + '...' 
        : errorMessage

      // Update design with error
      await prisma.design.update({
        where: { id: design.id },
        data: {
          status: 'FAILED',
          error: truncatedError
        }
      })

      return NextResponse.json({
        success: false,
        error: 'Erreur lors de la génération du design. Veuillez réessayer.'
      }, { status: 500 })
    }
  } catch (error: any) {
    console.error('❌ Error in design generation:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
