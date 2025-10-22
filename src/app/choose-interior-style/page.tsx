/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import InteriorStyleCard from "@/components/InteriorStyle/InteriorStyleCard";
import ScreenScale from "@/components/ScreenScale";
import MainPageWrapper from "@/components/WelcomePage/MainPageWrapper";
import PageNavbar from "@/components/WelcomePage/PageNavbar";
import { useCreateProject } from "@/lib/hooks/api";
import { InteriorStyle, ProjectType, CreateProjectDto } from "@/types/api";
import { toast } from "react-hot-toast";

// Separate component that uses useSearchParams
const ChooseInteriorStyleContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<InteriorStyle | "">("");

  // Get project type from URL params (set in previous step)
  const projectType =
    (searchParams.get("type") as ProjectType) || ProjectType.RESIDENTIAL;
  const projectName = searchParams.get("name") || "Mon Projet";

  const createProjectMutation = useCreateProject();

  // Select a style
  const selectStyle = (style: InteriorStyle): void => {
    setSelected(style);
  };

  // Handle continue to next step
  const handleContinue = async () => {
    if (!selected) {
      toast.error("Veuillez sélectionner un style d'intérieur");
      return;
    }

    const projectData: CreateProjectDto = {
      name: projectName,
      type: projectType,
      style: selected,
      description: `Projet ${projectType.toLowerCase()} en style ${selected.toLowerCase()}`,
    };

    try {
      const project = await createProjectMutation.mutateAsync(projectData);
      toast.success("Projet créé avec succès!");

      // Redirect to room creation with project ID
      router.push(`/create-layout?projectId=${project.id}`);
    } catch (error: any) {
      console.error("Project creation error:", error);
      toast.error(
        error.response?.data?.message || "Erreur lors de la création du projet"
      );
    }
  };

  // Style mapping for display
  const styleDisplayNames = {
    [InteriorStyle.ART_DECO]: "Art déco",
    [InteriorStyle.BOHEMIAN]: "Bohème",
    [InteriorStyle.COASTAL]: "Bord de mer",
    [InteriorStyle.RUSTIC]: "Rustique",
    [InteriorStyle.CONTEMPORARY]: "Contemporain",
    [InteriorStyle.ETHNIC]: "Ethnique",
    [InteriorStyle.INDUSTRIAL]: "Industriel",
    [InteriorStyle.SCANDINAVIAN]: "Scandinave",
    [InteriorStyle.VINTAGE]: "Vintage",
    [InteriorStyle.MINIMALIST]: "Minimaliste",
  };

  const styles = [
    { key: InteriorStyle.ART_DECO, image: "/Art déco.png" },
    { key: InteriorStyle.BOHEMIAN, image: "/Boho.png" },
    { key: InteriorStyle.COASTAL, image: "/Bord de mer.png" },
    { key: InteriorStyle.RUSTIC, image: "/Charme.png" },
    { key: InteriorStyle.CONTEMPORARY, image: "/Contemporaine_.png" },
    { key: InteriorStyle.ETHNIC, image: "/Ethnique.png" },
    { key: InteriorStyle.INDUSTRIAL, image: "/Industrielle.png" },
    { key: InteriorStyle.SCANDINAVIAN, image: "/Scandinave.png" },
    { key: InteriorStyle.VINTAGE, image: "/Vintage.png" },
    { key: InteriorStyle.MINIMALIST, image: "/minimaliste 1.png" },
  ];

  return (
    <MainPageWrapper head="Choisissez un style d'intérieur">
      <ScreenScale className="!grid grid-cols-5 !w-[98.4rem] gap-[2.1rem] max-lg:grid-cols-3 max-lg:gap-[1rem] max-lg:!w-[83.60945273631842%] max-lg:max-w-[unset]">
        {styles.map(({ key, image }) => (
          <InteriorStyleCard
            key={key}
            src={image}
            style={styleDisplayNames[key]}
            onClick={() => selectStyle(key)}
            selected={selected}
          />
        ))}
      </ScreenScale>

      {/* Continue Button */}
      {selected && (
        <div className="flex justify-center mt-[4rem]">
          <button
            onClick={handleContinue}
            disabled={createProjectMutation.isPending}
            className="px-[3rem] py-[1.2rem] bg-[#f5f5f5] border border-[#f5f5f5] rounded-[0.8rem] font-['Inter'] text-[1.6rem] leading-[1] text-[#1E1E1E] hover:bg-[#e5e5e5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createProjectMutation.isPending ? "Création..." : "Continuer"}
          </button>
        </div>
      )}

      {/* Project Info Display */}
      <div className="flex justify-center mt-[2rem] text-white/70 text-[1.4rem]">
        <span>
          Projet: {projectName} • Type:{" "}
          {projectType === ProjectType.RESIDENTIAL ? "Résidentiel" : "Bureau"}
          {selected && ` • Style: ${styleDisplayNames[selected]}`}
        </span>
      </div>
    </MainPageWrapper>
  );
};

// Loading component for Suspense fallback
const LoadingFallback: React.FC = () => {
  return (
    <MainPageWrapper head="Choisissez un style d'intérieur">
      <div className="flex justify-center items-center min-h-[20rem]">
        <div className="text-white/70 text-[1.6rem]">Chargement...</div>
      </div>
    </MainPageWrapper>
  );
};

// Main component with Suspense wrapper
const ChooseInteriorStyle: React.FC = () => {
  return (
    <>
      <PageNavbar />
      <Suspense fallback={<LoadingFallback />}>
        <ChooseInteriorStyleContent />
      </Suspense>
    </>
  );
};

export default ChooseInteriorStyle;
