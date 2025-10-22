/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import ScreenScale from "../ScreenScale";
import { useProjects, useUploadRoomImage } from "@/lib/hooks/api";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const MainWelcomePage: React.FC = () => {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);

  // Fetch user's projects
  const { data: projectsData, isLoading: projectsLoading } = useProjects({
    limit: 1,
  });
  const uploadImageMutation = useUploadRoomImage();

  // Handle quick photo upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner une image valide");
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("L'image ne peut pas dépasser 10MB");
      return;
    }

    setIsUploading(true);

    try {
      // Upload image without associating to a room initially
      const result = await uploadImageMutation.mutateAsync({ file });

      toast.success("Image uploadée avec succès!");

      // Redirect to project creation with the uploaded image
      router.push(
        `/newproject?uploadedImage=${encodeURIComponent(result.url)}`
      );
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Erreur lors de l'upload");
    } finally {
      setIsUploading(false);
    }
  };

  // Get project count for display
  const projectCount = projectsData?.pagination?.total || 0;

  return (
    <main className="h-[calc(100dvh-7rem)] bg-[#242426] pt-[5.5rem] max-lg:pt-[2.5rem]">
      <h2 className="mb-[4.1rem] font-semibold text-[2.4rem] leading-[120%] text-center tracking-[-0.02em] text-white fustat max-lg:mb-[1.7rem]">
        Bienvenue
      </h2>

      {/* ITEMS */}
      <ScreenScale className="!w-[105.2rem] flex gap-[2.5rem] h-[33.4rem] max-lg:w-[83.6094527363182%] max-lg:flex-col max-lg:h-[unset] max-lg:gap-[1.5rem]">
        {/* UPLOAD */}
        <div className="flex-[1_0_0] max-lg:flex-auto max-lg:h-[23.1rem]">
          <input
            type="file"
            name="file"
            id="upload"
            className="hidden"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
          <label
            htmlFor="upload"
            className={`flex flex-col justify-center items-center rounded-[0.8rem] bg-[linear-gradient(270deg,_#444444_0%,_#2F2F2F_100%)] border-dashed border-[0.1rem] border-[#00EEFF] h-full cursor-pointer transition-all hover:border-[#00CCDD] hover:bg-[linear-gradient(270deg,_#555555_0%,_#3F3F3F_100%)] ${
              isUploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <span className="text-[#B3B3B3] fustat text-[1.2rem] mb-[0.8rem] font-semibold text-center">
              {isUploading
                ? "Upload en cours..."
                : "Démarrer un projet rapidement"}
            </span>
            <span className="fustat text-[1.8rem] text-white font-bold text-center">
              {isUploading ? (
                "Veuillez patienter"
              ) : (
                <>
                  Importer une photo <br /> de votre pièce
                </>
              )}
            </span>
          </label>
        </div>

        {/* MIDDLE SECTION */}
        <div className="flex-[1_0_0] flex flex-col gap-[2.5rem] max-lg:gap-[1.5rem] max-lg:h-[17.5rem] max-lg:flex-auto">
          {/* NEW PROJECT */}
          <article className="flex-[1_0_0] rounded-[0.8rem] bg-[linear-gradient(270deg,_#444444_0%,_#2F2F2F_100%)] relative flex justify-center items-center text-center hover:bg-[linear-gradient(270deg,_#555555_0%,_#3F3F3F_100%)] transition-all cursor-pointer">
            <span className="fustat font-bold text-[1.8rem] text-white text-center">
              Nouveau projet
            </span>
            <Link
              href="/newproject"
              className="absolute top-0 left-0 inline-block w-full h-full"
            />
          </article>

          {/* MY PROJECTS */}
          <article className="flex-[1_0_0] rounded-[0.8rem] bg-[linear-gradient(270deg,_#444444_0%,_#2F2F2F_100%)] relative flex justify-center items-center text-center hover:bg-[linear-gradient(270deg,_#555555_0%,_#3F3F3F_100%)] transition-all cursor-pointer">
            <div className="flex flex-col items-center">
              <span className="fustat font-bold text-[1.8rem] text-white text-center">
                Mes projets
              </span>
              {projectsLoading ? (
                <span className="text-[1.2rem] text-white/60 mt-1">
                  Chargement...
                </span>
              ) : (
                <span className="text-[1.2rem] text-white/60 mt-1">
                  {projectCount} projet{projectCount !== 1 ? "s" : ""}
                </span>
              )}
            </div>
            <Link
              href="/projects"
              className="absolute top-0 left-0 inline-block w-full h-full"
            />
          </article>
        </div>

        {/* HOW IT WORKS */}
        <article className="flex-[1_0_0] flex flex-col justify-center items-center rounded-[0.8rem] bg-[linear-gradient(270deg,_#444444_0%,_#2F2F2F_100%)] max-lg:flex-auto max-lg:h-[8rem] relative hover:bg-[linear-gradient(270deg,_#555555_0%,_#3F3F3F_100%)] transition-all cursor-pointer">
          <span className="fustat font-bold text-[1.8rem] text-center text-white">
            Comment ça marche ?
          </span>
          <Link
            href="/how-it-works"
            className="absolute top-0 left-0 inline-block w-full h-full"
          />
        </article>
      </ScreenScale>
    </main>
  );
};

export default MainWelcomePage;
