// app/api/generate-design/route.ts
import { NextResponse } from 'next/server'
import { replicate } from '@/libs/replicate'
import { put } from '@vercel/blob'


export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const prompt = formData.get('prompt') as string

    if (!file || !prompt) {
      return NextResponse.json(
        { success: false, error: 'Missing file or prompt' },
        { status: 400 }
      )
    }

    // Upload the image to a temporary location
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const blob = await put(file.name, buffer, { access: 'public' })

    // Generate designs
    const outputs = await replicate.run(
      'stability-ai/stable-diffusion-xl-base-1.0:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
      {
        input: {
          prompt: `Interior design rendering of a room with: ${prompt}. Professional, photorealistic, high quality.`,
          image: blob.url,
          num_outputs: 3,
        },
      }
    )

    return NextResponse.json({ outputs })
  } catch (error) {
    console.error('Error generating design:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate design' },
      { status: 500 }
    )
  }
}