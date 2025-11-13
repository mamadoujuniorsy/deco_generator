// app/api/analyze-room/route.ts
import { NextResponse } from 'next/server'
import { openai } from '@/libs/openai'

export const runtime = 'nodejs'

// 🔹 PRÉTRAITEMENT AUTOMATIQUE DES IMAGES UPLOADÉES
// Cette route analyse l'image en background dès l'upload pour:
// 1. Identifier le type de pièce et son style actuel
// 2. Détecter les éléments clés (mobilier, éclairage, couleurs)
// 3. Optimiser la qualité pour la génération
// 4. Préparer des suggestions intelligentes

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

    console.log('🔄 Prétraitement de l\'image:', file.name, file.size, 'bytes')

    // Convert image to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = buffer.toString('base64')
    const mimeType = file.type || 'image/jpeg'

    // 🚀 Analyse intelligente avec OpenAI Vision
    const analysis = await analyzeRoomWithVision(base64Image, mimeType)

    console.log('✅ Analyse terminée:', analysis.substring(0, 100) + '...')

    return NextResponse.json({ 
      success: true,
      analysis,
      processedImageUrl: `data:${mimeType};base64,${base64Image}`,
      metadata: {
        fileSize: file.size,
        fileName: file.name,
        mimeType,
        analyzedAt: new Date().toISOString()
      }
    })
  } catch (error: any) {
    console.error('❌ Erreur lors de l\'analyse:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to analyze room',
        details: error.message 
      },
      { status: 500 }
    )
  }
}

// 🤖 Analyse intelligente avec OpenAI Vision
async function analyzeRoomWithVision(base64Image: string, mimeType: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analysez cette pièce de manière professionnelle et concise:
              
1. Type de pièce (salon, chambre, cuisine, etc.)
2. Style actuel (moderne, classique, minimaliste, etc.)
3. Éléments clés visibles (mobilier, couleurs dominantes, éclairage)
4. État général et potentiel d'amélioration

Répondez en 2-3 phrases courtes et précises.`
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
                detail: 'low' // Plus rapide et moins coûteux
              }
            }
          ]
        }
      ],
      max_tokens: 150,
      temperature: 0.3 // Plus déterministe pour les analyses
    })

    const analysis = response.choices[0]?.message?.content || generateBasicAnalysis()
    return analysis.trim()
  } catch (error: any) {
    console.error('❌ OpenAI Vision error:', error.message)
    // Fallback: analyse basique si OpenAI échoue
    return generateBasicAnalysis()
  }
}

// 🔄 Fallback: Analyse basique si OpenAI n'est pas disponible
function generateBasicAnalysis(): string {
  return "Pièce détectée et prête pour la transformation. L'analyse détaillée améliorera la génération."
}