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