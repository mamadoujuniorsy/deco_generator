import { NextRequest, NextResponse } from 'next/server';

// Fonction pour traduire le prompt en anglais
async function translateToEnglish(text: string): Promise<string> {
  try {
    // Utiliser l'API MyMemory (gratuite, pas besoin de clé)
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=fr|en`
    );
    const data = await response.json();
    
    if (data.responseStatus === 200 && data.responseData.translatedText) {
      console.log(`Traduction: "${text}" -> "${data.responseData.translatedText}"`);
      return data.responseData.translatedText;
    }
  } catch (error) {
    console.error('Erreur de traduction:', error);
  }
  
  // Si la traduction échoue, retourner le texte original
  return text;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image, prompt } = body;

    if (!image || !prompt) {
      return NextResponse.json(
        { error: 'Image et prompt requis' },
        { status: 400 }
      );
    }

    console.log('Génération d\'image modifiée...');
    
    // Traduire le prompt en anglais
    const translatedPrompt = await translateToEnglish(prompt);

    // Vérifier si on a un token Replicate
    const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
    
    if (!REPLICATE_API_TOKEN || REPLICATE_API_TOKEN === 'your-replicate-api-token-here') {
      console.log('Token Replicate manquant');
      return NextResponse.json({
        success: false,
        error: "Token Replicate non configuré",
        images: [],
        note: "Configurez REPLICATE_API_TOKEN dans .env.local"
      });
    }

    console.log('Token Replicate trouvé, tentative avec Replicate...');

    // Option 1: Essayer avec Replicate (Stable Diffusion img2img)
    try {
      console.log('Appel API Replicate...');
      const replicateResponse = await fetch("https://api.replicate.com/v1/predictions", {
        method: "POST",
        headers: {
          "Authorization": `Token ${REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          version: "be04660a5b93ef2aff61e3668dedb4cbeb14941e62a3fd5998364a32d613e35e", // Stable Diffusion img2img
          input: {
            image: image,
            prompt: `${translatedPrompt}, interior design, professional photography, realistic, 8k`,
            negative_prompt: "living room, sofa, couch, armchair, residential, home, apartment, blurry, low quality",
            num_inference_steps: 35,
            guidance_scale: 10,
            strength: 0.9, // Modifie 90% de l'image pour une transformation plus forte
          }
        })
      });

      console.log('Réponse Replicate statut:', replicateResponse.status);
      
      if (!replicateResponse.ok) {
        const errorText = await replicateResponse.text();
        console.error('Erreur Replicate:', errorText);
        throw new Error(`Replicate API error: ${replicateResponse.status} - ${errorText}`);
      }

      const replicateData = await replicateResponse.json();
      console.log('Prédiction créée:', replicateData.id);
      
      // Attendre que l'image soit générée
      let prediction = replicateData;
      let attempts = 0;
      const maxAttempts = 60; // 60 secondes max
      
      while (prediction.status !== "succeeded" && prediction.status !== "failed" && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
          headers: {
            "Authorization": `Token ${REPLICATE_API_TOKEN}`,
          }
        });
        
        if (statusResponse.ok) {
          prediction = await statusResponse.json();
          console.log(`Tentative ${attempts + 1}: ${prediction.status}`);
        }
        attempts++;
      }

      console.log('Statut final:', prediction.status);

      if (prediction.status === "succeeded" && prediction.output) {
        console.log('Image générée avec succès!');
        return NextResponse.json({
          success: true,
          images: Array.isArray(prediction.output) ? prediction.output : [prediction.output],
          note: `✨ Image modifiée avec Stable Diffusion : "${prompt}"`
        });
      } else if (prediction.status === "failed") {
        console.error('Erreur génération:', prediction.error);
        throw new Error(`Génération échouée: ${prediction.error}`);
      } else {
        throw new Error('Timeout - génération trop longue');
      }
      
    } catch (replicateError: any) {
      console.error('Erreur Replicate complète:', replicateError.message);
    }

    // Option 2: Essayer avec OpenAI DALL-E si on a des crédits
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (OPENAI_API_KEY && OPENAI_API_KEY !== 'your-openai-api-key-here') {
      try {
        const openaiResponse = await fetch("https://api.openai.com/v1/images/edits", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${OPENAI_API_KEY}`,
          },
          body: (() => {
            const formData = new FormData();
            
            // Convertir base64 en blob
            const base64Data = image.split(',')[1];
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'image/png' });
            
            formData.append('image', blob, 'room.png');
            formData.append('prompt', `Modify this interior room: ${prompt}. Keep the same room structure but apply the requested changes realistically.`);
            formData.append('n', '1');
            formData.append('size', '512x512');
            
            return formData;
          })()
        });

        if (openaiResponse.ok) {
          const openaiData = await openaiResponse.json();
          const editedImageUrl = openaiData.data?.[0]?.url;
          
          if (editedImageUrl) {
            return NextResponse.json({
              success: true,
              images: [editedImageUrl],
              note: `🎨 Image modifiée avec OpenAI DALL-E : "${prompt}"`
            });
          }
        }
      } catch (openaiError) {
        console.log('OpenAI non disponible:', openaiError);
      }
    }

    // Option 3: Fallback avec message explicatif
    return NextResponse.json({
      success: false,
      error: "Pour la vraie modification d'image, configurez une API de génération d'image (Replicate ou OpenAI avec crédits)",
      images: [],
      note: "Modification d'image nécessite Replicate API ou OpenAI avec crédits"
    });

  } catch (error: any) {
    console.error('Erreur génération image:', error);
    
    return NextResponse.json({
      success: false,
      error: "Erreur lors de la modification d'image",
      images: []
    });
  }
}