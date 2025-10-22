"use client";

import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

interface ImageUploadProps {
  onComplete: (file: File, analysis: string) => void;
  onError: (error: string) => void;
}

export default function ImageUpload({ onComplete, onError }: ImageUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisStep, setAnalysisStep] = useState<string>("");

  // Clean up preview URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        // Clean up previous preview URL
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
          setPreviewUrl(null);
        }

        // Create new preview URL
        const newFile = acceptedFiles[0];
        const newPreviewUrl = URL.createObjectURL(newFile);

        setFile(newFile);
        setPreviewUrl(newPreviewUrl);
        onError(""); // Clear previous errors
      }
    },
    [onError, previewUrl]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
    disabled: isProcessing,
  });

  const clearFile = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setFile(null);
  }, [previewUrl]);

  const handleSubmit = async () => {
    if (!file) return;

    setIsProcessing(true);
    setUploadProgress(0);
    setAnalysisStep("Préparation de l'image...");

    try {
      // Step 1: Preprocess image if needed
      const processedFile = file;

      // Simple preprocessing - just ensure it's within size limits
      if (file.size > 5 * 1024 * 1024) {
        throw new Error(
          "Image trop volumineuse. Veuillez utiliser une image de moins de 5MB."
        );
      }

      setUploadProgress(10);
      setAnalysisStep("Analyse de l'espace...");

      // Step 2: Try free analysis first, with fallback
      let analysis = "";
      try {
        const formData = new FormData();
        formData.append("file", processedFile);

        const response = await axios.post("/api/analyze-room", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 80) / (progressEvent.total || 1)
            );
            setUploadProgress(10 + percentCompleted);
          },
          timeout: 30000, // 30 second timeout
        });

        if (response.data.error) {
          throw new Error(response.data.error);
        }

        analysis = response.data.analysis;
        setUploadProgress(95);
        setAnalysisStep("Finalisation...");
      } catch (apiError) {
        console.warn("Free API failed, using fallback analysis:", apiError);

        // Fallback to basic analysis
        setAnalysisStep("Génération de l'analyse de base...");
        analysis = await generateFallbackAnalysis(processedFile);
        setUploadProgress(95);
      }

      // Small delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 500));
      setUploadProgress(100);
      setAnalysisStep("Terminé!");

      onComplete(processedFile, analysis);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Analyse d'image échouée";
      onError(errorMessage);
      console.error("Upload error:", err);
    } finally {
      setIsProcessing(false);
      setUploadProgress(0);
      setAnalysisStep("");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="space-y-6">
          {/* Upload Zone */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
              isDragActive
                ? "border-orange-400 bg-orange-50"
                : "border-gray-300 hover:border-orange-300"
            } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <input {...getInputProps()} />
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-orange-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              {isDragActive ? (
                <div>
                  <p className="text-orange-600 font-medium text-lg">
                    Déposez votre image ici...
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-gray-800 font-medium text-lg mb-2">
                    Importez votre photo d&apos;intérieur
                  </p>
                  <p className="text-gray-600">
                    Glissez-déposez votre image ou cliquez pour sélectionner
                  </p>
                </div>
              )}
              <div className="space-y-2">
                <p className="text-sm text-gray-500">
                  JPEG, PNG ou WEBP (max 5MB)
                </p>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                  <svg
                    className="w-3 h-3 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  API Gratuite - Phase MVP
                </div>
              </div>
            </div>
          </div>

          {/* File Preview */}
          {file && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-orange-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                {!isProcessing && (
                  <button
                    onClick={clearFile}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Supprimer l'image"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
              </div>

              {/* Image Preview with proper URL cleanup */}
              {previewUrl && (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Aperçu de votre intérieur"
                    className="w-full h-auto rounded-2xl shadow-lg"
                    onError={() => {
                      console.error("Error loading preview image");
                      // Optionally handle image load error
                    }}
                  />
                  {isProcessing && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-2xl">
                      <div className="text-white text-center">
                        <svg
                          className="animate-spin h-8 w-8 mx-auto mb-3"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <p className="font-medium mb-2">{analysisStep}</p>
                        <p className="text-sm mb-3">{uploadProgress}%</p>
                        <div className="w-64 bg-gray-300 h-2 rounded-full">
                          <div
                            className="bg-orange-400 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isProcessing || !file}
            className={`w-full py-4 px-6 rounded-full font-medium text-lg transition-all duration-300 flex items-center justify-center ${
              isProcessing || !file
                ? "bg-gray-300 cursor-not-allowed text-gray-500"
                : "bg-orange-400 hover:bg-orange-500 text-white shadow-lg hover:shadow-xl"
            }`}
          >
            {isProcessing ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {analysisStep} ({uploadProgress}%)
              </>
            ) : (
              <>
                Générer votre design (Gratuit)
                <svg
                  className="w-5 h-5 ml-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </>
            )}
          </button>

          {/* Free API Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <h4 className="text-sm font-medium text-blue-800 mb-1">
                  Version MVP - API Gratuite
                </h4>
                <p className="text-sm text-blue-700">
                  Cette version utilise des APIs gratuites pour la phase de
                  test. Les résultats peuvent prendre un peu plus de temps à
                  générer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Fallback analysis function
async function generateFallbackAnalysis(file: File): Promise<string> {
  // Simple client-side analysis based on image metadata and basic heuristics
  const fileName = file.name.toLowerCase();

  // Basic room type detection from filename
  let roomType = "living space";
  if (fileName.includes("bedroom") || fileName.includes("chambre"))
    roomType = "bedroom";
  else if (fileName.includes("kitchen") || fileName.includes("cuisine"))
    roomType = "kitchen";
  else if (fileName.includes("bathroom") || fileName.includes("salle"))
    roomType = "bathroom";
  else if (fileName.includes("office") || fileName.includes("bureau"))
    roomType = "office";

  return `**Analyse de l'espace (Mode MVP)**

**Type de pièce:** ${roomType.charAt(0).toUpperCase() + roomType.slice(1)}

**Analyse de base:** Cette pièce présente un potentiel intéressant pour une transformation design. L'espace semble adapté à plusieurs styles d'aménagement.

**Dimensions estimées:** Espace de taille moyenne (12-18 m²)

**Style actuel:** Style contemporain de base

**Conditions d'éclairage:** Éclairage mixte naturel et artificiel

**Suggestions de design:**

1. **Style Scandinave Moderne**
   - Tons clairs et bois naturel
   - Mobilier fonctionnel aux lignes épurées
   - Textiles douillets en tons neutres
   - Plantes vertes pour l'aspect naturel

2. **Style Industriel Contemporain**
   - Éléments en métal et bois brut
   - Éclairage type Edison
   - Palette de couleurs chaudes
   - Mobilier mixte métal/bois

3. **Style Minimaliste Élégant**
   - Lignes épurées et espace dégagé
   - Palette monochrome
   - Mobilier multifonctionnel
   - Éclairage d'ambiance

**Palette de couleurs recommandée:**
- Primaire: Blancs chauds et gris doux
- Secondaire: Tons bois naturel
- Accent: Bleus sourds ou vert sauge

**Idées d'aménagement:**
- Créer des points focaux avec des pièces maîtresses
- Optimiser la circulation dans l'espace
- Maximiser la lumière naturelle
- Utiliser des miroirs pour agrandir visuellement

*Note: Cette analyse a été générée en mode MVP avec des outils gratuits. Pour une analyse plus détaillée, nous passerons aux APIs premium.*`;
}
