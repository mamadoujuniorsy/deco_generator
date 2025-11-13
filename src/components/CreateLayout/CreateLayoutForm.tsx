/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useApiClient } from "@/lib/hooks/useApiClient";
import { useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import Image from "next/image";

interface CreateLayoutFormProps {
  chooseFile: (file: File | null) => void;
}

export default function CreateLayoutForm({
  chooseFile,
}: CreateLayoutFormProps) {
  const apiClient = useApiClient();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId');

  const [prompt, setPrompt] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [showGeneration, setShowGeneration] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await apiClient.post("/rooms", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: (response: any) => {
      toast.success("Photo uploadée avec succès !");
      
      // Get created room data
      const roomData = response.data?.data || response.data;
      const createdRoomId = roomData?.id;
      
      console.log('✅ Room created successfully:', { roomId: createdRoomId, projectId });
      
      if (createdRoomId) {
        setRoomId(createdRoomId);
        setShowGeneration(true);
        toast.success("Prêt pour la génération! Cliquez sur 'Générer' ci-dessous.");
      } else {
        console.error('❌ No roomId in response');
        toast.error("Erreur: ID de room manquant");
      }
    },
    onError: (error: any) => {
      const errorMsg = error.response?.data?.message || "Erreur lors de l'upload.";
      setError(errorMsg);
      toast.error(errorMsg);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      setError("Veuillez importer une photo.");
      return;
    }
    if (!prompt.trim()) {
      setError("Veuillez décrire les modifications souhaitées.");
      return;
    }
    if (!projectId) {
      setError("Aucun projet sélectionné.");
      return;
    }

    setError(null);

    const data = new FormData();
    data.append("projectId", projectId);
    data.append("projectName", "Room " + Date.now()); // Auto-generated name
    data.append("projectDescription", prompt);
    data.append("length", "5"); // Default values
    data.append("width", "5");
    data.append("height", "3");
    data.append("materials", "");
    data.append("ambientColor", "");
    data.append("images", selectedFile);

    mutation.mutate(data);
  };

  const handleGenerate = async () => {
    if (!roomId) return;

    setIsGenerating(true);
    setGeneratedImages([]);
    toast.loading("Génération en cours...", { id: 'generation' });

    try {
      const response = await apiClient.post('/designs/generate', {
        roomId,
        projectId,
        prompt,
        style: 'CONTEMPORARY'
      });

      const data = response.data;

      if (data.success) {
        const images = data.data?.output || [];
        setGeneratedImages(images);
        toast.success("Design généré avec succès!", { id: 'generation' });
      } else {
        throw new Error(data.error || 'Erreur de génération');
      }
    } catch (error: any) {
      console.error('Generation error:', error);
      const errorMsg = error.response?.data?.error || error.message || "Erreur lors de la génération";
      toast.error(errorMsg, { id: 'generation' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setSelectedFile(file);
      chooseFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 bg-transparent p-6 text-white max-w-6xl mx-auto">
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto" style={{ display: showGeneration ? 'none' : 'block' }}>
      {error && (
        <div className="bg-red-900/20 border border-red-700 text-red-300 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Photo Upload Section */}
      <div className="bg-[#2F2F2F] rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4 fustat">
          📸 Upload votre photo
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
              type="button"
              onClick={() => {
                setImagePreview("");
                setSelectedFile(null);
                chooseFile(null);
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
              onChange={handleFileChange}
              className="hidden"
              required
            />
            <div className="border-2 border-dashed border-[#00EEFF] rounded-lg p-12 text-center hover:border-[#00CCDD] transition-colors">
              <div className="text-7xl mb-4">📸</div>
              <p className="text-gray-300 text-lg mb-2">
                Cliquez pour télécharger une photo
              </p>
              <p className="text-gray-500 text-sm">
                JPG, PNG, WebP - Max 10MB
              </p>
            </div>
          </label>
        )}
      </div>

      {/* Prompt Section */}
      <div className="bg-[#2F2F2F] rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4 fustat">
          ✍️ Décrivez les modifications souhaitées
        </h2>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ex: Ajouter un canapé moderne gris, des plantes vertes près de la fenêtre, une table basse en bois, des coussins colorés sur le canapé, et une lampe design..."
          className="w-full h-40 p-4 bg-[#1a1a1a] border border-gray-600 rounded-lg text-white resize-none focus:ring-2 focus:ring-[#00EEFF] focus:border-transparent"
          required
        />
        <p className="text-gray-400 text-sm mt-2">
          💡 Soyez précis : décrivez les meubles, couleurs, matériaux, et l&apos;ambiance souhaitée
        </p>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          type="submit"
          disabled={mutation.isPending || !selectedFile || !prompt.trim()}
          className="bg-gradient-to-r from-[#00EEFF] to-[#00CCDD] hover:from-[#00CCDD] hover:to-[#00AACC] disabled:from-gray-600 disabled:to-gray-700 text-black font-bold py-4 px-8 rounded-lg transition-all duration-200 disabled:cursor-not-allowed text-lg"
        >
          {mutation.isPending ? (
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              <span>Upload en cours...</span>
            </div>
          ) : (
            "Continuer vers la génération 🎨"
          )}
        </button>
      </div>
    </form>

    {/* Generation Section */}
    {showGeneration && (
      <div className="space-y-6">
        <div className="bg-[#2F2F2F] rounded-lg p-6">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Original Image */}
            <div>
              <h3 className="text-lg font-semibold mb-3">📷 Photo originale</h3>
              <div className="relative w-full h-80 bg-black rounded-lg overflow-hidden">
                <Image
                  src={imagePreview}
                  alt="Original"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* Prompt Display */}
            <div>
              <h3 className="text-lg font-semibold mb-3">✍️ Votre demande</h3>
              <div className="bg-[#1a1a1a] p-4 rounded-lg h-80 overflow-y-auto">
                <p className="text-gray-300">{prompt}</p>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          {generatedImages.length === 0 && (
            <div className="flex justify-center">
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="bg-gradient-to-r from-[#00EEFF] to-[#00CCDD] hover:from-[#00CCDD] hover:to-[#00AACC] disabled:from-gray-600 disabled:to-gray-700 text-black font-bold py-4 px-8 rounded-lg transition-all duration-200 disabled:cursor-not-allowed text-lg"
              >
                {isGenerating ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    <span>Génération en cours...</span>
                  </div>
                ) : (
                  "🎨 Générer le design"
                )}
              </button>
            </div>
          )}
        </div>

        {/* Generated Results */}
        {generatedImages.length > 0 && (
          <div className="bg-[#2F2F2F] rounded-lg p-6">
            <h3 className="text-2xl font-semibold mb-6 text-center">✨ Designs générés</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {generatedImages.map((imageUrl, index) => (
                <div key={index} className="space-y-3">
                  <div className="relative w-full h-96 bg-black rounded-lg overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={`Design ${index + 1}`}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <a
                    href={imageUrl}
                    download={`design-${index + 1}.png`}
                    className="block text-center bg-[#00EEFF] hover:bg-[#00CCDD] text-black font-semibold py-2 px-4 rounded transition-colors"
                  >
                    📥 Télécharger
                  </a>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-center space-x-4">
              <button
                onClick={() => {
                  setShowGeneration(false);
                  setGeneratedImages([]);
                  setPrompt("");
                  setSelectedFile(null);
                  setImagePreview("");
                  setRoomId(null);
                  chooseFile(null);
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                🔄 Nouveau design
              </button>
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="bg-gradient-to-r from-[#00EEFF] to-[#00CCDD] hover:from-[#00CCDD] hover:to-[#00AACC] text-black font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                🎨 Régénérer
              </button>
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="flex justify-center">
          <button
            onClick={() => {
              setShowGeneration(false);
              setGeneratedImages([]);
              setRoomId(null);
            }}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← Retour au formulaire
          </button>
        </div>
      </div>
    )}
    </div>
  );
}
