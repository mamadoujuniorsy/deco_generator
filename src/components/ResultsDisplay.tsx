/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import DownloadButton from "./DownloadButton";
import Image from "next/image";

interface JobStatus {
  status: "pending" | "processing" | "completed" | "failed";
  progress: number;
  analysis?: string;
  generatedImages?: string[];
  error?: string;
}

// Simple polling function to replace the external dependency
async function pollJobStatus(
  sessionId: string,
  options: { onProgress: (progress: number) => void; timeout: number }
): Promise<JobStatus> {
  const startTime = Date.now();

  while (Date.now() - startTime < options.timeout) {
    try {
      const response = await fetch("/api/check-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });

      if (!response.ok) {
        throw new Error(`Status check failed: ${response.status}`);
      }

      const result: JobStatus = await response.json();

      // Update progress
      options.onProgress(result.progress);

      // If completed or failed, return result
      if (result.status === "completed" || result.status === "failed") {
        return result;
      }

      // Wait before next poll
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error("Polling error:", error);
      // Continue polling on error
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  // Timeout reached
  throw new Error("Timeout: Job took too long to complete");
}

export default function ResultsDisplay({ sessionId }: { sessionId: string }) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<
    "pending" | "processing" | "completed" | "failed"
  >("pending");
  const [results, setResults] = useState<{
    analysis?: string;
    generatedImages?: string[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Fix hydration by ensuring we're on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !sessionId) return;

    const fetchData = async () => {
      try {
        const result = await pollJobStatus(sessionId, {
          onProgress: setProgress,
          timeout: 120000, // 2 minutes
        });

        setStatus(result.status as any);
        if (result.status === "completed") {
          setResults({
            analysis: result.analysis,
            generatedImages: result.generatedImages,
          });
        } else if (result.status === "failed") {
          setError(result.error || "Processing failed");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    };

    fetchData();
  }, [sessionId, isClient]);

  // Show loading during hydration
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-orange-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (status === "pending" || status === "processing") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto text-center p-8">
          <div className="mb-8">
            <svg
              className="animate-spin h-12 w-12 text-orange-400 mx-auto mb-4"
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
          </div>
          <h2 className="text-2xl font-light text-gray-800 mb-2">
            Génération de votre design
          </h2>
          <p className="text-gray-600 mb-6">
            Création de vos rendus personnalisés... {progress}%
          </p>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-orange-400 to-orange-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto text-center p-8">
          <div className="mb-6">
            <svg
              className="h-12 w-12 text-red-400 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-light text-gray-800 mb-2">
            Oops ! Une erreur s&apos;est produite
          </h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-orange-400 hover:bg-orange-500 text-white px-6 py-3 rounded-full font-medium transition-colors inline-flex items-center"
          >
            Réessayer
            <svg
              className="w-4 h-4 ml-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  if (status === "completed" && results) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-light text-gray-800 mb-4">
              Vos rendus sont prêts !
            </h1>
            <p className="text-gray-600 text-lg">
              Découvrez vos nouvelles propositions de design d&apos;intérieur
            </p>
          </div>

          <div className="space-y-12">
            {/* Analysis Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <svg
                  className="w-6 h-6 text-orange-400 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8z"
                    clipRule="evenodd"
                  />
                </svg>
                <h2 className="text-2xl font-medium text-gray-800">
                  Analyse de votre espace
                </h2>
              </div>
              <div className="prose max-w-none">
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {results.analysis}
                </div>
              </div>
            </div>

            {/* Generated Images Section */}
            <div>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-light text-gray-800 mb-2">
                  Vos designs générés
                </h2>
                <p className="text-gray-600">
                  Cliquez sur une image pour la télécharger
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.generatedImages?.map((img, i) => (
                  <div
                    key={i}
                    className="relative group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="aspect-square relative overflow-hidden">
                      <Image
                        src={img}
                        alt={`Design ${i + 1}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <DownloadButton imageUrl={img} />
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-medium text-gray-800 mb-1">
                        Design {i + 1}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Cliquez pour télécharger
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="text-center pt-8">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={() => window.location.reload()}
                  className="bg-orange-400 hover:bg-orange-500 text-white px-8 py-3 rounded-full font-medium transition-colors inline-flex items-center"
                >
                  Générer de nouveaux designs
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <button className="text-orange-400 hover:text-orange-500 font-medium transition-colors inline-flex items-center">
                  Partager mes designs
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center py-12">
        <h2 className="text-2xl font-light text-gray-800 mb-2">
          Aucun résultat trouvé
        </h2>
        <p className="text-gray-600 mb-6">
          Veuillez réessayer avec une nouvelle image
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-orange-400 hover:bg-orange-500 text-white px-6 py-3 rounded-full font-medium transition-colors"
        >
          Recommencer
        </button>
      </div>
    </div>
  );
}
