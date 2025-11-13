import { NextRequest, NextResponse } from 'next/server';
import { homeDesignClient, translateToEnglish, type InteriorStyle, type RoomType, type AIIntervention } from '@/libs/homedesign';

export const maxDuration = 60; // Vercel function timeout

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      image, 
      prompt, 
      designStyle = 'Modern',
      roomType = 'Living Room',
      aiIntervention = 'Extreme', // ✅ Changé de 'Mid' à 'Extreme' pour mieux respecter le prompt
      noDesign = 1,
      keepStructuralElement = false // ✅ Changé à false pour plus de liberté
    } = body;

    // Validation des paramètres requis
    if (!image || !prompt) {
      return NextResponse.json(
        { error: 'Image et prompt requis' },
        { status: 400 }
      );
    }

    // 🔍 Extraction et validation du base64
    let base64Content = image;
    if (typeof base64Content === 'string' && base64Content.startsWith('data:')) {
      base64Content = base64Content.split(',')[1];
    }
    
    // Validation du format base64
    if (typeof base64Content === 'string') {
      // Nettoyer les espaces blancs
      base64Content = base64Content.replace(/\s/g, '');
      
      // Vérifier la taille minimale
      if (base64Content.length < 1000) {
        return NextResponse.json(
          { error: 'Image trop petite ou invalide' },
          { status: 400 }
        );
      }

      // Vérifier le format base64 valide
      const isValidBase64 = /^[A-Za-z0-9+/]+=*$/.test(base64Content);
      if (!isValidBase64) {
        return NextResponse.json(
          { error: 'Format d\'image base64 invalide' },
          { status: 400 }
        );
      }
      
      console.log('✅ Image validation:', {
        base64Length: base64Content.length,
        estimatedSizeKB: Math.round(base64Content.length * 0.75 / 1024)
      });
    }

    console.log('🎨 Génération avec Home Designs AI...');
    console.log(`📝 Style: ${designStyle}, Room: ${roomType}, Intervention: ${aiIntervention}`);

    // Traduire le prompt en anglais
    const translatedPrompt = await translateToEnglish(prompt);
    
    // 🎯 Enrichir le prompt avec le contexte pour mieux guider l'IA
    const enrichedPrompt = `${translatedPrompt}. Design style: ${designStyle}. Room type: ${roomType}. Ensure the changes match the ${designStyle.toLowerCase()} style for a ${roomType.toLowerCase()}.`;
    
    console.log(`🌐 Prompt traduit: "${prompt}" → "${translatedPrompt}"`);
    console.log(`✨ Prompt enrichi: "${enrichedPrompt}"`);

    // Générer le design avec Home Designs AI
    // Note: On passe directement le base64, l'API le gère bien
    const result = await homeDesignClient.generateDesign({
      image: `data:image/jpeg;base64,${base64Content}`, // Format data URL complet
      design_type: 'Interior',
      design_style: designStyle as InteriorStyle,
      room_type: roomType as RoomType,
      ai_intervention: aiIntervention as AIIntervention,
      no_design: noDesign as 1 | 2,
      custom_instruction: enrichedPrompt, // ✅ Utiliser le prompt enrichi
      keep_structural_element: keepStructuralElement,
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        images: result.output_images,
        inputImage: result.input_image,
        attempts: result.attempts,
        translatedPrompt,
        note: `✨ Design créé avec succès: "${prompt}"`
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error,
        images: [],
        note: "Échec de la génération"
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('❌ Erreur génération image:', error);
    
    // Identifier le type d'erreur pour un meilleur feedback
    let errorMessage = error.message || "Erreur lors de la modification d'image";
    let statusCode = 500;

    if (error.message?.includes('API Error 401')) {
      errorMessage = "Token API invalide ou expiré";
      statusCode = 401;
    } else if (error.message?.includes('API Error 429')) {
      errorMessage = "Limite de requêtes atteinte, réessayez plus tard";
      statusCode = 429;
    } else if (error.message?.includes('Timeout')) {
      errorMessage = "La génération a pris trop de temps";
      statusCode = 408;
    }
    
    return NextResponse.json({
      success: false,
      error: errorMessage,
      images: [],
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: statusCode });
  }
}