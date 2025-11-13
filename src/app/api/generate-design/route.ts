// app/api/generate-design/route.ts
import { NextResponse } from 'next/server'
import { homeDesignClient, translateToEnglish, fileToBase64, type InteriorStyle, type RoomType } from '@/libs/homedesign'
import { put } from '@vercel/blob'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const prompt = formData.get('prompt') as string
    const designStyle = (formData.get('designStyle') as string) || 'Modern'
    const roomType = (formData.get('roomType') as string) || 'Living Room'
    const aiIntervention = (formData.get('aiIntervention') as string) || 'Mid'
    const noDesign = parseInt((formData.get('noDesign') as string) || '2')

    if (!file || !prompt) {
      return NextResponse.json(
        { success: false, error: 'Missing file or prompt' },
        { status: 400 }
      )
    }

    console.log('🎨 Generating design with Home Designs AI...')
    console.log(`📝 Style: ${designStyle}, Room: ${roomType}`)

    // Upload the image to a temporary location for reference
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const blob = await put(`temp-${Date.now()}-${file.name}`, buffer, { access: 'public' })

    // Convert file to base64 for Home Designs AI
    const base64Image = await fileToBase64(file)

    // Translate prompt
    const translatedPrompt = await translateToEnglish(prompt)

    // Generate designs with Home Designs AI
    const result = await homeDesignClient.generateDesign({
      image: base64Image,
      design_type: 'Interior',
      design_style: designStyle as InteriorStyle,
      room_type: roomType as RoomType,
      ai_intervention: aiIntervention as any,
      no_design: Math.min(Math.max(noDesign, 1), 2) as 1 | 2, // Clamp between 1 and 2
      custom_instruction: translatedPrompt,
      keep_structural_element: true,
    })

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to generate design' },
        { status: 500 }
      )
    }

    // Upload generated images to Vercel Blob for persistent storage
    const uploadedUrls: string[] = []
    if (result.output_images) {
      for (let i = 0; i < result.output_images.length; i++) {
        try {
          const imageUrl = result.output_images[i]
          const response = await fetch(imageUrl)
          const imageBlob = await response.blob()
          const uploaded = await put(`design-${Date.now()}-${i + 1}.png`, imageBlob, { 
            access: 'public' 
          })
          uploadedUrls.push(uploaded.url)
        } catch (error) {
          console.error(`Error uploading image ${i + 1}:`, error)
          // Fallback to Home Designs AI URL
          uploadedUrls.push(result.output_images[i])
        }
      }
    }

    return NextResponse.json({ 
      success: true,
      outputs: uploadedUrls,
      inputImage: result.input_image,
      originalUpload: blob.url,
      attempts: result.attempts,
      metadata: {
        designStyle,
        roomType,
        aiIntervention,
        prompt: translatedPrompt
      }
    })
  } catch (error) {
    console.error('Error generating design:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to generate design' },
      { status: 500 }
    )
  }
}