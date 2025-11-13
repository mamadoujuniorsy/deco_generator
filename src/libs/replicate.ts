import Replicate from 'replicate'

export const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

export async function generateRoomDesign(
  imageUrl: string,
  prompt: string
) {
  const output = await replicate.run(
    'stability-ai/stable-diffusion-xl-base-1.0:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
    {
      input: {
        prompt,
        image: imageUrl,
        num_outputs: 3,
      },
    }
  )

  return output
}

export async function generateDesignWithReplicate(
  imageBase64: string,
  prompt: string
) {
  console.log('🚀 Calling Replicate API...')
  
  const output = await replicate.run(
    'jagilley/controlnet-interior-design:6415187f4bbbd1194b3b49cf7b0c0e6c6b8c0b9c5e2c7e8f3f3f3f3f3f3f3f3f',
    {
      input: {
        image: imageBase64,
        prompt: `A beautiful interior design: ${prompt}`,
        num_outputs: 2,
        a_prompt: 'best quality, extremely detailed',
        n_prompt: 'longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality',
        ddim_steps: 20,
        scale: 9,
      },
    }
  ) as any

  return {
    output: Array.isArray(output) ? output : [output],
    metrics: { predict_time: 0 }
  }
}