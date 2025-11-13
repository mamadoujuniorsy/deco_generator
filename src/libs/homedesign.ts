/**
 * Home Designs AI Service - Creative Redesign
 * 
 * Utilise l'endpoint 'creative_redesign' pour des transformations créatives et radicales.
 * Les modifications sont plus importantes et respectent mieux les prompts personnalisés.
 */

// Types
export type DesignType = 'Interior' | 'Exterior' | 'Garden';
export type AIIntervention = 'Very Low' | 'Low' | 'Mid' | 'Extreme';
export type InteriorStyle = 'Modern' | 'Minimalist' | 'Contemporary' | 'Scandinavian' | 'Industrial' | 'Bohemian';
export type RoomType = 'Living Room' | 'Bedroom' | 'Kitchen' | 'Bathroom' | 'Dining Room';

export interface HomeDesignRequest {
  image: string | File;
  design_type: DesignType;
  ai_intervention: AIIntervention;
  no_design: 1 | 2;
  design_style: string;
  room_type?: RoomType;
  custom_instruction?: string;
  keep_structural_element?: boolean;
}

export interface FillSpacesRequest {
  image: string; // Image générée à affiner
  masked_image: string; // Masque noir/blanc
  design_type: DesignType;
  no_design: 1 | 2 | 3 | 4;
  design_style: string;
  room_type?: RoomType;
  house_angle?: string;
  garden_type?: string;
  prompt?: string;
  strength?: number; // 1-10
}

export interface GenerationResult {
  success: boolean;
  input_image?: string;
  output_images?: string[];
  error?: string;
  attempts?: number;
}

/**
 * Home Designs AI Client
 */
export class HomeDesignClient {
  private apiToken: string;
  private baseUrl = 'https://homedesigns.ai/api/v2';
  private maxPollingAttempts = 60;
  private pollingInterval = 1000;

  constructor(apiToken?: string) {
    this.apiToken = apiToken || process.env.HOME_DESIGN_API_TOKEN || '';
    
    if (!this.apiToken || this.apiToken === 'your-home-design-api-token-here') {
      console.warn('⚠️ HOME_DESIGN_API_TOKEN not configured');
    }
  }

  /**
   * Créer FormData avec conversion base64 → Blob
   */
  private async createFormData(params: HomeDesignRequest): Promise<FormData> {
    const formData = new FormData();

    let imageContent = params.image as string;
    
    console.log('🔍 Type d\'image reçu:', typeof imageContent);
    
    if (typeof imageContent === 'string') {
      // Extraire le base64 pur
      if (imageContent.startsWith('data:')) {
        imageContent = imageContent.split(',')[1];
      }
      
      // Nettoyer les espaces blancs (limite aux 10000 premiers caractères pour éviter stack overflow)
      const maxLength = 10000000; // 10MB max en base64
      if (imageContent.length > maxLength) {
        throw new Error(`Image trop grande (${(imageContent.length / 1024 / 1024).toFixed(2)}MB). Maximum 10MB.`);
      }
      
      imageContent = imageContent.replace(/\s/g, '');
      
      console.log('✅ Base64 nettoyé:', {
        length: imageContent.length,
        sizeApproxMB: (imageContent.length * 0.75 / 1024 / 1024).toFixed(2),
        firstChars: imageContent.substring(0, 50)
      });

      try {
        // Convertir base64 → Buffer → Blob
        const binaryString = atob(imageContent);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        const blob = new Blob([bytes], { type: 'image/jpeg' });
        
        console.log('📦 Blob créé:', {
          size: blob.size,
          type: blob.type,
          sizeKB: (blob.size / 1024).toFixed(2) + ' KB'
        });

        formData.append('image', blob, 'image.jpg');
        
      } catch (err) {
        console.error('❌ Erreur conversion base64 → Blob:', err);
        throw new Error('Image invalide : impossible de décoder le base64');
      }
    } else {
      formData.append('image', imageContent);
    }

    // Ajouter les autres paramètres
    formData.append('design_type', params.design_type);
    formData.append('ai_intervention', params.ai_intervention);
    formData.append('no_design', params.no_design.toString());
    formData.append('design_style', params.design_style);
    formData.append('keep_structural_element', (params.keep_structural_element ?? true).toString());

    if (params.room_type) {
      formData.append('room_type', params.room_type);
    }

    // Creative Redesign utilise 'prompt' au lieu de 'custom_instruction'
    if (params.custom_instruction) {
      formData.append('prompt', params.custom_instruction);
    }

    console.log('📋 FormData créé avec tous les paramètres (Creative Redesign)');
    return formData;
  }

  /**
   * Créer un job de génération
   */
  async createJob(params: HomeDesignRequest): Promise<any> {
    const formData = await this.createFormData(params);

    console.log('🚀 Envoi de la requête à Home Designs AI (Creative Redesign)...');
    console.log('🔑 Token:', this.apiToken.substring(0, 10) + '...');
    
    const response = await fetch(`${this.baseUrl}/creative_redesign`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
      },
      body: formData,
    });

    console.log('📨 Réponse:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erreur API:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText.substring(0, 500)
      });
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Réponse complète de l\'API:', JSON.stringify(data, null, 2));
    
    // Creative Redesign retourne les images directement dans: { success: { original_image, generated_image: [...] } }
    if (data.success && data.success.generated_image) {
      console.log('✅ Images reçues directement (Creative Redesign - mode synchrone)');
      return {
        isSync: true,
        input_image: data.success.original_image,
        output_images: data.success.generated_image
      };
    }
    
    // Sinon format standard avec queue_id
    return {
      isSync: false,
      ...data
    };
  }

  /**
   * Vérifier le statut d'un job
   */
  async checkStatus(queueId: string): Promise<any> {
    console.log(`🔍 Vérification du statut pour: ${queueId}`);
    
    const response = await fetch(`${this.baseUrl}/perfect_redesign/status_check/${queueId}`, {
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
      },
    });

    console.log(`📡 Statut HTTP: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Erreur status check:`, errorText);
      throw new Error(`Status check failed ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log(`📦 Données reçues:`, JSON.stringify(data, null, 2));
    
    return data;
  }

  /**
   * Attendre la fin du traitement
   */
  async pollForCompletion(queueId: string): Promise<GenerationResult> {
    let attempts = 0;

    while (attempts < this.maxPollingAttempts) {
      await new Promise(resolve => setTimeout(resolve, this.pollingInterval));

      try {
        const statusResponse = await this.checkStatus(queueId);
        
        console.log(`📊 Tentative ${attempts + 1}/${this.maxPollingAttempts}:`, JSON.stringify(statusResponse, null, 2));

        const currentStatus = statusResponse.status || statusResponse.state || 'unknown';
        const outputImages = statusResponse.output_images || statusResponse.output || statusResponse.result?.output_images;
        
        console.log(`🔍 Status actuel: ${currentStatus}, Images: ${outputImages ? 'présentes' : 'absentes'}`);

        // Success: Si output_images existe et contient des URLs
        if (outputImages && Array.isArray(outputImages) && outputImages.length > 0) {
          console.log(`✅ Images trouvées! Génération terminée avec succès.`);
          return {
            success: true,
            input_image: statusResponse.input_image || statusResponse.input,
            output_images: outputImages,
            attempts: attempts + 1,
          };
        }

        if ((currentStatus === 'SUCCEEDED' || currentStatus === 'succeeded' || currentStatus === 'completed') && outputImages) {
          return {
            success: true,
            input_image: statusResponse.input_image || statusResponse.input,
            output_images: outputImages,
            attempts: attempts + 1,
          };
        }

        // Failure conditions
        if (currentStatus === 'FAILED' || currentStatus === 'failed' || currentStatus === 'error') {
          return {
            success: false,
            error: statusResponse.error || statusResponse.message || 'Generation failed',
            attempts: attempts + 1,
          };
        }

        // Still processing
        if (currentStatus === 'IN_QUEUE' || currentStatus === 'PROCESSING' || currentStatus === 'processing' || currentStatus === 'starting') {
          console.log(`⏳ En attente... (${currentStatus})`);
        }

        attempts++;
      } catch (error: any) {
        console.error('❌ Polling error:', error.message);
        attempts++;
      }
    }

    return {
      success: false,
      error: `Timeout after ${this.maxPollingAttempts} attempts`,
      attempts,
    };
  }

  /**
   * Générer un design (méthode principale)
   */
  async generateDesign(params: HomeDesignRequest): Promise<GenerationResult> {
    try {
      console.log('🎨 Démarrage génération Home Designs AI (Creative Redesign)...');
      console.log(`📝 Type: ${params.design_type}, Style: ${params.design_style}`);

      const job = await this.createJob(params);
      
      // Creative Redesign retourne les images directement (mode synchrone)
      if (job.isSync && job.output_images) {
        console.log('🎉 Images reçues immédiatement (mode synchrone)!');
        return {
          success: true,
          input_image: job.input_image,
          output_images: job.output_images,
          attempts: 1,
        };
      }
      
      // Mode asynchrone avec queue_id (fallback)
      const queueId = job.id || job.queue_id || job.queueId;
      
      if (!queueId) {
        console.error('❌ Aucun Queue ID trouvé dans la réponse!');
        throw new Error('API did not return a queue ID or images');
      }

      console.log(`⏳ Job en queue: ${queueId}, démarrage du polling...`);
      const result = await this.pollForCompletion(queueId);

      if (result.success) {
        console.log(`🎉 Génération réussie! ${result.output_images?.length} images`);
      } else {
        console.error(`❌ Échec: ${result.error}`);
      }

      return result;
    } catch (error) {
      console.error('❌ Erreur génération:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Convertir base64 vers Blob
   */
  private base64ToBlob(base64Data: string, contentType: string = 'image/jpeg'): Blob {
    const base64 = base64Data.replace(/^data:image\/\w+;base64,/, '');
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    return new Blob([bytes], { type: contentType });
  }

  /**
   * Fill Spaces - Modifier des zones spécifiques d'une image
   * Utilisé pour affiner une image générée par Creative Redesign
   */
  async fillSpaces(params: FillSpacesRequest): Promise<GenerationResult> {
    try {
      console.log('🎨 Démarrage Fill Spaces...');
      console.log(`📝 Zone masquée à modifier avec: "${params.prompt || 'aucune instruction'}"`);

      const formData = new FormData();

      // Image principale (celle générée par Creative Redesign)
      const imageBlob = this.base64ToBlob(params.image, 'image/jpeg');
      formData.append('image', imageBlob, 'image.jpg');
      console.log('✅ Image principale ajoutée:', imageBlob.size, 'bytes');

      // Masque (dessiné par l'utilisateur)
      const maskBlob = this.base64ToBlob(params.masked_image, 'image/png');
      formData.append('masked_image', maskBlob, 'mask.png');
      console.log('✅ Masque ajouté:', maskBlob.size, 'bytes');

      // Paramètres requis
      formData.append('design_type', params.design_type);
      formData.append('no_design', params.no_design.toString());
      formData.append('design_style', params.design_style);

      // Paramètres optionnels selon le type
      if (params.room_type) {
        formData.append('room_type', params.room_type);
      }
      if (params.house_angle) {
        formData.append('house_angle', params.house_angle);
      }
      if (params.garden_type) {
        formData.append('garden_type', params.garden_type);
      }
      if (params.prompt) {
        formData.append('prompt', params.prompt);
      }
      if (params.strength) {
        formData.append('strength', params.strength.toString());
      }

      console.log('🚀 Envoi vers Fill Spaces API...');
      
      const response = await fetch(`${this.baseUrl}/fill_spaces`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
        },
        body: formData,
      });

      console.log('📨 Réponse:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erreur API Fill Spaces:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText.substring(0, 500)
        });
        throw new Error(`Fill Spaces Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Réponse Fill Spaces:', data);

      // Fill Spaces retourne un queue_id (mode asynchrone)
      const queueId = data.id || data.queue_id || data.queueId;
      
      if (!queueId) {
        console.error('❌ Aucun Queue ID trouvé!');
        throw new Error('Fill Spaces did not return a queue ID');
      }

      console.log(`⏳ Fill Spaces en queue: ${queueId}, polling...`);
      const result = await this.pollForCompletion(queueId);

      if (result.success) {
        console.log(`🎉 Fill Spaces réussi! ${result.output_images?.length} images`);
      } else {
        console.error(`❌ Échec Fill Spaces: ${result.error}`);
      }

      return result;
    } catch (error) {
      console.error('❌ Erreur Fill Spaces:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

// Instance singleton
export const homeDesignClient = new HomeDesignClient();

/**
 * Traduire FR → EN avec meilleure qualité
 * Utilise plusieurs méthodes pour obtenir la meilleure traduction
 */
export async function translateToEnglish(text: string): Promise<string> {
  // Si déjà en anglais, retourner tel quel
  if (/^[a-zA-Z\s,.'"-]+$/.test(text)) {
    console.log(`✅ Texte déjà en anglais: "${text}"`);
    return text;
  }

  try {
    // Méthode 1: LibreTranslate (plus précis pour le design d'intérieur)
    try {
      const libreResponse = await fetch('https://libretranslate.com/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: text,
          source: 'fr',
          target: 'en',
          format: 'text'
        })
      });
      
      if (libreResponse.ok) {
        const libreData = await libreResponse.json();
        if (libreData.translatedText) {
          console.log(`🌐 LibreTranslate: "${text}" → "${libreData.translatedText}"`);
          return libreData.translatedText;
        }
      }
    } catch {
      console.warn('⚠️ LibreTranslate non disponible, fallback vers MyMemory');
    }

    // Méthode 2: MyMemory (fallback)
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=fr|en`
    );
    const data = await response.json();
    
    if (data.responseStatus === 200 && data.responseData.translatedText) {
      console.log(`🌐 MyMemory: "${text}" → "${data.responseData.translatedText}"`);
      return data.responseData.translatedText;
    }
  } catch (error) {
    console.error('❌ Erreur de traduction:', error);
  }
  
  // Fallback: retourner le texte original si traduction échoue
  console.warn('⚠️ Traduction échouée, utilisation du texte original');
  return text;
}
