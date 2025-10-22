/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useApiClient } from "@/lib/hooks/useApiClient";

interface CreateLayoutFormProps {
  chooseFile: (file: File | null) => void;
}

export default function CreateLayoutForm({
  chooseFile,
}: CreateLayoutFormProps) {
  const apiClient = useApiClient();

  const [formData, setFormData] = useState({
    projectName: "",
    projectDescription: "",
    length: 0,
    width: 0,
    height: 0,
    materials: "",
    ambientColor: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await apiClient.post("/rooms", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      alert("Rendu créé avec succès !");
      setFormData({
        projectName: "",
        projectDescription: "",
        length: 0,
        width: 0,
        height: 0,
        materials: "",
        ambientColor: "",
      });
      setSelectedFile(null);
      chooseFile(null); // reset preview
    },
    onError: (error: any) => {
      setError(
        error.response?.data?.message || "Erreur lors de la création du rendu."
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.projectName || !formData.projectDescription) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    if (formData.length <= 0 || formData.width <= 0 || formData.height <= 0) {
      setError("Les dimensions doivent être supérieures à zéro.");
      return;
    }
    if (!selectedFile) {
      setError("Veuillez importer au moins une photo.");
      return;
    }

    setError(null);

    const data = new FormData();
    data.append("projectName", formData.projectName);
    data.append("projectDescription", formData.projectDescription);
    data.append("length", String(formData.length));
    data.append("width", String(formData.width));
    data.append("height", String(formData.height));
    data.append("materials", formData.materials);
    data.append("ambientColor", formData.ambientColor);
    data.append("images", selectedFile);

    mutation.mutate(data);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    chooseFile(file); // sync with parent preview
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-transparent p-4 text-white">
      {error && <p className="text-red-500">{error}</p>}

      {/* File Upload */}
      <div>
        <label className="block text-sm font-medium">Importer des photos</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mt-1 block w-full"
        />
        {selectedFile && (
          <p className="mt-1 text-sm text-gray-600">
            Fichier sélectionné : {selectedFile.name}
          </p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium">Nom du projet</label>
        <input
          type="text"
          onChange={(e) => handleInputChange("projectName", e.target.value)}
          className="mt-1 block w-full border rounded p-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">
          Description du projet
        </label>
        <textarea
          onChange={(e) =>
            handleInputChange("projectDescription", e.target.value)
          }
          className="mt-1 block w-full border rounded p-2"
          required
        />
      </div>

      {/* Dimensions */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium">Longueur (m)</label>
          <input
            type="number"
            onChange={(e) =>
              handleInputChange(
                "length",
                e.target.value ? parseFloat(e.target.value) : 0
              )
            }
            className="mt-1 block w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Largeur (m)</label>
          <input
            type="number"
            onChange={(e) =>
              handleInputChange(
                "width",
                e.target.value ? parseFloat(e.target.value) : 0
              )
            }
            className="mt-1 block w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Hauteur (m)</label>
          <input
            type="number"
            onChange={(e) =>
              handleInputChange(
                "height",
                e.target.value ? parseFloat(e.target.value) : 0
              )
            }
            className="mt-1 block w-full border rounded p-2"
            required
          />
        </div>
      </div>

      {/* Materials */}
      <div>
        <label className="block text-sm font-medium">
          Matériaux (séparés par des virgules)
        </label>
        <input
          type="text"
          onChange={(e) => handleInputChange("materials", e.target.value)}
          className="mt-1 block w-full border rounded p-2"
        />
      </div>

      {/* Ambient Color */}
      <div>
        <label className="block text-sm font-medium">
          Couleur ambiante souhaitée
        </label>
        <input
          type="text"
          onChange={(e) => handleInputChange("ambientColor", e.target.value)}
          className="mt-1 block w-full border rounded p-2"
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={mutation.isPending}
          className="bg-white text-black px-4 py-2 rounded disabled:opacity-50"
        >
          {mutation.isPending ? "Création..." : "Créer le rendu"}
        </button>
      </div>
    </form>
  );
}
