'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import PageNavbar from '@/components/WelcomePage/PageNavbar';
import { toast } from 'react-hot-toast';
import { useCreateDesign } from '@/lib/hooks/api';

function GenerateDesignContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [prompt, setPrompt] = useState('');
  const [designStyle, setDesignStyle] = useState('Modern');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  // Get project and room IDs from URL
  const projectId = searchParams.get('projectId');
  const roomId = searchParams.get('roomId');

  const createDesignMutation = useCreateDesign();

  // Load room image from API if roomId is provided
  useEffect(() => {
    const loadRoomImage = async () => {
      if (roomId) {
        try {
          const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('auth_token='))
            ?.split('=')[1];

          const response = await fetch(`/api/rooms/${roomId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            const roomData = data.data;
            if (roomData?.originalImageUrl) {
              setImagePreview(roomData.originalImageUrl);
              if (roomData.freePrompt) {
                setPrompt(roomData.freePrompt);
              }
              console.log('✅ Loaded room image from API');
            }
          } else {
            console.error('❌ Failed to load room:', response.status);
            toast.error('Impossible de charger la room');
          }
        } catch (error) {
          console.error('❌ Error loading room:', error);
          toast.error('Erreur lors du chargement');
        }
      }
    };

    loadRoomImage();
  }, [roomId]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadImage = async (imageUrl: string, index: number) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `design-${designStyle}-${index + 1}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Image téléchargée !');
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      toast.error('Erreur lors du téléchargement');
    }
  };

  const saveDesignToDatabase = async (imageUrls: string[]) => {
    if (!roomId) {
      toast.error('Pas de pièce associée');
      return;
    }

    try {
      await createDesignMutation.mutateAsync({
        roomId,
        designData: {
          prompt,
          style: designStyle,
          images: imageUrls
        }
      });
      
      toast.success('Design sauvegardé !');
    } catch (error: any) {
      console.error('Erreur sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const generateDesign = async () => {
    if (!imagePreview || !prompt) {
      toast.error('Image et description requis');
      return;
    }

    setIsLoading(true);
    setStatusMessage('Préparation de l\'image...');
    
    try {
      // Convert image to base64 if needed
      let base64Image = imagePreview;
      
      if (selectedImage) {
        base64Image = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(selectedImage);
        });
      }

      setStatusMessage('Génération avec Home Designs AI...');

      // Build the prompt with style
      const fullPrompt = `${designStyle} style: ${prompt}`;

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image,
          prompt: fullPrompt,
          designStyle: designStyle,
          roomType: 'Living Room',
          aiIntervention: 'Extreme',
          noDesign: 1,
          keepStructuralElement: false
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erreur lors de la génération');
      }

      console.log('✅ Génération réussie!', data);
      setGeneratedImages(data.images || []);
      setStatusMessage('');
      
      toast.success('Design généré avec succès !');
      
      // Save to database if we have a room
      if (roomId && data.images?.length > 0) {
        await saveDesignToDatabase(data.images);
      }
      
    } catch (error: any) {
      console.error('❌ Erreur génération:', error);
      setStatusMessage('');
      toast.error(error.message || 'Erreur lors de la génération');
    } finally {
      setIsLoading(false);
    }
  };

  const styles = [
    'Modern', 'Minimalist', 'Contemporary', 'Scandinavian', 
    'Industrial', 'Bohemian', 'Rustic', 'Coastal', 'Art Deco', 'Vintage'
  ];

  return (
    <>
      <PageNavbar />
      <div className="min-h-screen bg-[#242426] pt-28 px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4 fustat">
              Générer votre design
            </h1>
            <p className="text-lg text-gray-400">
              Décrivez les modifications souhaitées pour votre pièce
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Left: Image Upload & Preview */}
            <div className="space-y-4">
              <div className="bg-[#2F2F2F] rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4 fustat">
                  Photo de votre pièce
                </h2>
                
                {imagePreview ? (
                  <div className="space-y-4">
                    <div className="relative w-full h-96 bg-black rounded-lg overflow-hidden">
                      <Image
                        src={imagePreview}
                        alt="Aperçu"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <button
                      onClick={() => {
                        setImagePreview('');
                        setSelectedImage(null);
                      }}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Changer la photo
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <div className="border-2 border-dashed border-[#00EEFF] rounded-lg p-8 text-center hover:border-[#00CCDD] transition-colors">
                      <div className="text-6xl mb-4">📸</div>
                      <p className="text-gray-300">
                        Cliquez pour télécharger une photo
                      </p>
                    </div>
                  </label>
                )}
              </div>

              {/* Generated Images */}
              {generatedImages.length > 0 && (
                <div className="bg-[#2F2F2F] rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-white mb-4 fustat">
                    Design généré
                  </h2>
                  <div className="space-y-4">
                    {generatedImages.map((imgUrl, index) => (
                      <div key={index} className="space-y-2">
                        <div className="relative w-full h-96 bg-black rounded-lg overflow-hidden">
                          <Image
                            src={imgUrl}
                            alt={`Design ${index + 1}`}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <button 
                          onClick={() => downloadImage(imgUrl, index)}
                          className="w-full bg-[#00EEFF] hover:bg-[#00CCDD] text-black font-semibold py-2 px-4 rounded-lg transition-colors"
                        >
                          💾 Télécharger
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Simplified Options */}
            <div className="space-y-4">
              {/* Prompt - Plus grand et prioritaire */}
              <div className="bg-[#2F2F2F] rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4 fustat">
                  Décrivez les modifications souhaitées
                </h2>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ex: Ajouter un canapé moderne gris, des plantes vertes près de la fenêtre, une table basse en bois, et des coussins colorés..."
                  className="w-full h-40 p-4 bg-[#1a1a1a] border border-gray-600 rounded-lg text-white resize-none focus:ring-2 focus:ring-[#00EEFF] focus:border-transparent"
                />
                <p className="text-gray-400 text-sm mt-2">
                  💡 Soyez précis : décrivez les meubles, couleurs, matériaux, et l&apos;ambiance souhaitée
                </p>
              </div>

              {/* Style - Simplifié */}
              <div className="bg-[#2F2F2F] rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4 fustat">
                  Style de design
                </h2>
                <select
                  value={designStyle}
                  onChange={(e) => setDesignStyle(e.target.value)}
                  className="w-full p-3 bg-[#1a1a1a] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-[#00EEFF]"
                >
                  {styles.map(style => (
                    <option key={style} value={style}>{style}</option>
                  ))}
                </select>
              </div>

              {/* Generate Button */}
              <button
                onClick={generateDesign}
                disabled={!imagePreview || !prompt.trim() || isLoading}
                className="w-full bg-gradient-to-r from-[#00EEFF] to-[#00CCDD] hover:from-[#00CCDD] hover:to-[#00AACC] disabled:from-gray-600 disabled:to-gray-700 text-black font-bold py-4 px-6 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    <span>{statusMessage || 'Génération...'}</span>
                  </div>
                ) : (
                  '🎨 Générer le design avec Home Designs AI'
                )}
              </button>

              {isLoading && statusMessage && (
                <div className="p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
                  <p className="text-blue-300 text-sm text-center">
                    ⏳ {statusMessage}
                  </p>
                  <p className="text-blue-400 text-xs text-center mt-2">
                    Cela peut prendre 30-60 secondes...
                  </p>
                </div>
              )}

              {/* Back button */}
              {projectId && (
                <button
                  onClick={() => router.push(`/projects/${projectId}`)}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  ← Retour au projet
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function GenerateDesignPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#242426] flex items-center justify-center">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    }>
      <GenerateDesignContent />
    </Suspense>
  );
}
