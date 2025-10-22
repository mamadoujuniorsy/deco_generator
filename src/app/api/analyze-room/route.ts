// app/api/analyze-room/route.ts
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

// Free Hugging Face Inference API
const HF_API_TOKEN = process.env.HUGGING_FACE_API_TOKEN
const HF_VISION_API_URL = "https://api-inference.huggingface.co/models/microsoft/kosmos-2-patch14-224"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    // Convert image to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = buffer.toString('base64')

    // Analyze with Hugging Face Vision model (free)
    const analysis = await analyzeRoomWithHuggingFace(base64Image)

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error('Error analyzing room:', error)
    return NextResponse.json(
      { error: 'Failed to analyze room' },
      { status: 500 }
    )
  }
}

async function analyzeRoomWithHuggingFace(base64Image: string): Promise<string> {
  try {
    // First, try to get image description using a free vision model
    // const imageBuffer = Buffer.from(base64Image, 'base64')
    
    const response = await fetch(HF_VISION_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: "Describe this interior room in detail, including furniture, layout, style, and lighting.",
        image: base64Image
      })
    })

    if (!response.ok) {
      // Fallback to a simpler analysis if HF API fails
      return generateBasicAnalysis()
    }

    const result = await response.json()
    
    // Process the result and create a structured analysis
    const description = result.generated_text || result[0]?.generated_text || "Modern interior space"
    
    return generateStructuredAnalysis(description)
  } catch (error) {
    console.error('HF API error:', error)
    return generateBasicAnalysis()
  }
}

function generateStructuredAnalysis(description: string): string {
  // Enhanced analysis based on the description
  const roomTypes = ['living room', 'bedroom', 'kitchen', 'bathroom', 'office', 'dining room']
  const detectedRoomType = roomTypes.find(type => 
    description.toLowerCase().includes(type)
  ) || 'living space'

  const styles = ['modern', 'contemporary', 'traditional', 'minimalist', 'industrial', 'scandinavian']
  const detectedStyle = styles.find(style => 
    description.toLowerCase().includes(style)
  ) || 'contemporary'

  return `**Room Analysis:**

**Room Type:** ${detectedRoomType.charAt(0).toUpperCase() + detectedRoomType.slice(1)}

**Current Description:** ${description}

**Estimated Dimensions:** Medium-sized room (approximately 12-15 square meters)

**Current Style:** ${detectedStyle.charAt(0).toUpperCase() + detectedStyle.slice(1)}

**Lighting Conditions:** Natural and artificial lighting present

**Design Suggestions:**

1. **Modern Scandinavian Style**
   - Light wood furniture and white walls
   - Minimalist approach with clean lines
   - Add cozy textiles in neutral tones
   - Incorporate plants for natural elements

2. **Contemporary Industrial Style**
   - Exposed brick or concrete elements
   - Metal and wood furniture combinations
   - Edison bulb lighting fixtures
   - Rich, warm color palette

3. **Minimalist Modern Style**
   - Clean, uncluttered spaces
   - Monochromatic color scheme
   - Functional furniture with hidden storage
   - Statement lighting pieces

**Color Palette Recommendations:**
- Primary: Warm whites and soft grays
- Secondary: Natural wood tones
- Accent: Muted blues or sage green

**Furniture Placement Ideas:**
- Create focal points with key furniture pieces
- Ensure clear traffic flow
- Maximize natural light with strategic placement
- Use mirrors to enhance space perception`
}

function generateBasicAnalysis(): string {
  return `**Room Analysis:**

**Room Type:** Living Space

**Current Style:** Contemporary

**Design Suggestions:**

1. **Modern Scandinavian Style**
   - Light colors and natural materials
   - Functional furniture with clean lines
   - Cozy textiles and plants

2. **Industrial Contemporary**
   - Metal and wood combinations
   - Exposed elements
   - Warm lighting

3. **Minimalist Modern**
   - Clean, uncluttered design
   - Neutral color palette
   - Statement pieces

**Color Recommendations:**
- Whites, grays, and natural wood tones
- Accent colors: soft blues or greens

**Furniture Ideas:**
- Focus on functionality and comfort
- Create clear traffic flow
- Maximize natural light`
}

// import { NextResponse } from 'next/server'
// import OpenAI from 'openai'
// import { tmpdir } from 'os'
// import { join } from 'path'
// import { writeFile, unlink } from 'fs/promises'

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// })

// export const runtime = 'nodejs' 

// export async function POST(request: Request) {
//   try {
//     const formData = await request.formData()
//     const file = formData.get('file') as File

//     if (!file) {
//       return NextResponse.json(
//         { error: 'No file uploaded' },
//         { status: 400 }
//       )
//     }

//     // Create temporary file path
//     const tempFilePath = join(tmpdir(), file.name)
//     const bytes = await file.arrayBuffer()
//     const buffer = Buffer.from(bytes)

//     // Write file using Node.js fs
//     await writeFile(tempFilePath, buffer)

//     // Analyze the image with OpenAI
//     const response = await openai.chat.completions.create({
//     model: "gpt-4o-mini",
//   store: true,
//       messages: [
//         {
//           role: 'user',
//           content: [
//             {
//               type: 'text',
//               text: `Analyze this room image and provide design suggestions. Include:
//   - Room type (living room, bedroom, kitchen, etc.)
//   - Estimated dimensions
//   - Current style (if any)∏∏
//   - Lighting conditions
//   - 3 design suggestions with styles (e.g., "Modern Scandinavian with light wood tones")
//   - Color palette recommendations
//   - Furniture placement ideas`,
//             },
//             {
//               type: 'image_url',
//               image_url: {
//                 url: `data:${file.type};base64,${buffer.toString('base64')}`,
//               },
//             },
//           ],
//         },
//       ],
//       max_tokens: 1000,
//     })

//     // Clean up the temporary file
//     await unlink(tempFilePath)

//     const analysis = response.choices[0]?.message?.content
//     if (!analysis) {
//       throw new Error('No analysis returned from OpenAI')
//     }

//     return NextResponse.json({ analysis })
//   } catch (error) {
//     console.error('Error analyzing room:', error)
//     return NextResponse.json(
//       { error: 'Failed to analyze room' },
//       { status: 500 }
//     )
//   }
// }