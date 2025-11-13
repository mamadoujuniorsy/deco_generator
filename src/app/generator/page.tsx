'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [prompt, setPrompt] = useState('');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [originalAnalysis, setOriginalAnalysis] = useState<string>('');
  const [editInstructions, setEditInstructions] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

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
      link.download = `decoration-proposition-${index + 1}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      alert('Erreur lors du téléchargement de l\'image');
    }
  };

  const generateDecoration = async () => {
    if (!selectedImage || !prompt) return;

    setIsLoading(true);
    setStatusMessage('Préparation de l\'image...');
    
    try {
      // Convertir le fichier en base64
      const base64Image = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(selectedImage);
      });

      setStatusMessage('Envoi à Home Designs AI...');
      console.log('📤 Génération avec Home Designs AI...');

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image,
          prompt: prompt,
          designStyle: 'Modern',
          roomType: 'Living Room',
          aiIntervention: 'Extreme', // ✅ Extreme pour mieux respecter les prompts
          noDesign: 1, // ✅ 1 image pour plus rapide
          keepStructuralElement: false // ✅ false pour plus de liberté créative
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erreur lors de la génération');
      }

      console.log('✅ Génération réussie!', data);
      setGeneratedImages(data.images || []);
      setOriginalAnalysis(data.note || '');
      setEditInstructions(`Design généré avec succès!\nStyle: Modern\nPièce: Living Room\nNiveau d'intervention: Moyen\nNombre de designs: ${data.images?.length || 0}`);
      setStatusMessage('');
    } catch (error: any) {
      console.error('❌ Erreur lors de la génération:', error);
      setStatusMessage('');
      alert(`Erreur avec Home Designs AI:\n${error.message}\n\nVérifiez que HOME_DESIGN_API_TOKEN est configuré dans .env.local`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            🏠 Déco Generator AI
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Transformez votre intérieur avec l&apos;intelligence artificielle
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
            1. Téléchargez votre photo
          </h2>
          
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center">
            {imagePreview ? (
              <div className="space-y-4">
                <Image
                  src={imagePreview}
                  alt="Aperçu de votre pièce"
                  width={300}
                  height={200}
                  className="mx-auto rounded-lg object-cover"
                />
                <button
                  onClick={() => {
                    setImagePreview('');
                    setSelectedImage(null);
                  }}
                  className="text-red-500 hover:text-red-700 text-sm"
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
                <div className="space-y-4">
                  <div className="text-6xl">📸</div>
                  <p className="text-lg text-gray-600 dark:text-gray-300">
                    Cliquez pour télécharger une photo de votre pièce
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Formats acceptés: JPG, PNG, WebP
                  </p>
                </div>
              </label>
            )}
          </div>
        </div>

        {/* Prompt Section */}
        {selectedImage && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
              2. Décrivez les modifications souhaitées
            </h2>
            
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex: Changer les murs en bleu pastel, ajouter des plantes vertes sur la gauche, remplacer le canapé par un modèle en cuir marron..."
              className="w-full h-32 p-4 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
            
            <button
              onClick={generateDecoration}
              disabled={!prompt.trim() || isLoading}
              className="mt-4 w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{statusMessage || 'Modification en cours...'}</span>
                </div>
              ) : (
                '🎨 Générer avec Home Designs AI'
              )}
            </button>
            
            {isLoading && statusMessage && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                <p className="text-blue-700 dark:text-blue-300 text-sm text-center">
                  ⏳ {statusMessage}
                </p>
                <p className="text-blue-600 dark:text-blue-400 text-xs text-center mt-2">
                  Cela peut prendre 30-60 secondes...
                </p>
              </div>
            )}
          </div>
        )}

        {/* Results Section */}
        {generatedImages.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
              3. Votre image modifiée
            </h2>
            
            {/* Analyse de l'image originale */}
            {originalAnalysis && (
              <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-700 rounded-xl">
                <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3 flex items-center">
                  🔍 Analyse de votre image originale
                </h4>
                <p className="text-blue-700 dark:text-blue-300 leading-relaxed text-sm">
                  {originalAnalysis}
                </p>
              </div>
            )}

            {/* Instructions d'édition */}
            {editInstructions && (
              <div className="mb-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700 rounded-xl">
                <h4 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-3 flex items-center">
                  ✏️ Instructions de modification
                </h4>
                <div className="text-green-700 dark:text-green-300 leading-relaxed text-sm whitespace-pre-wrap">
                  {editInstructions}
                </div>
              </div>
            )}
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-300">
                  Image originale
                </h3>
                <Image
                  src={imagePreview}
                  alt="Image originale"
                  width={400}
                  height={300}
                  className="w-full rounded-lg object-cover border-2 border-gray-200 dark:border-gray-600"
                />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-300">
                  Image modifiée selon votre demande
                </h3>
                {generatedImages.map((imgUrl, index) => (
                  <div key={index} className="space-y-2">
                    <Image
                      src={imgUrl}
                      alt={`Proposition ${index + 1}`}
                      width={400}
                      height={300}
                      className="w-full rounded-lg object-cover border-2 border-green-200 dark:border-green-600"
                    />
                    <button 
                      onClick={() => downloadImage(imgUrl, index)}
                      className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                      💾 Télécharger cette proposition
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
