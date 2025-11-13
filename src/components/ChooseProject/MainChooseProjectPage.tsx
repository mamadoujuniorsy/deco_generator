"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import ScreenScale from "../ScreenScale";
import MainPageWrapper from "../WelcomePage/MainPageWrapper";
import OptionBox from "../WelcomePage/OptionBox";
import { useProjects } from "@/lib/hooks/api";
import { Project } from "@/types/api";

const MainChooseProjectPage: React.FC = () => {
  const router = useRouter();
  const { data: projectsData, isLoading, error } = useProjects();
  
  // Debug: log the data structure
  console.log('Projects data:', projectsData);
  
  const projects = projectsData?.data?.projects || [];

  const handleContinueProject = (project: Project) => {
    // Redirect to create-layout with the existing project
    router.push(`/create-layout?projectId=${project.id}`);
  };

  const xml: React.ReactElement = (
    <MainPageWrapper head="Choisissez un projet">
      <div className="w-full max-w-[80rem] mx-auto px-4">
        {/* Debug Info */}
        {!isLoading && (
          <div className="mb-4 p-4 bg-gray-800 rounded text-xs text-gray-400">
            <p>Debug: Total projects found: {projects.length}</p>
            <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
            <p>Error: {error ? 'Yes' : 'No'}</p>
          </div>
        )}

        {/* Existing Projects Section */}
        {projects.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 fustat">
              Vos projets existants
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {projects.map((project: Project) => (
                <div
                  key={project.id}
                  className="bg-[#2F2F2F] rounded-lg p-6 hover:bg-[#3F3F3F] transition-colors cursor-pointer"
                  onClick={() => handleContinueProject(project)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-white fustat">
                      {project.name}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      project.isActive 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {project.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                  {project.description && (
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {project.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 bg-[#00EEFF]/20 text-[#00EEFF] rounded text-xs">
                      {project.type}
                    </span>
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">
                      {project.style}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{project.roomCount || 0} pièce(s)</span>
                    <button className="text-[#00EEFF] hover:text-[#00CCDD] font-semibold">
                      Continuer →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-[#00EEFF] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 mt-4">Chargement de vos projets...</p>
          </div>
        )}

        {/* Create New Project Section */}
        <div className="border-t border-gray-700 pt-8">
          <h2 className="text-2xl font-bold text-white mb-4 fustat">
            Créer un nouveau projet
          </h2>
          <ScreenScale className="!w-[69.3rem] flex gap-[2.5rem] h-[33.4rem] max-lg:flex-col max-lg:h-[17.5rem] max-lg:gap-[1.5rem]">
            <Link
              href={
                "/choose-interior-style?type=RESIDENTIAL&name=Projet Résidentiel"
              }
              passHref
              className="w-full flex-[1_0_0] flex justify-center items-center"
            >
              <OptionBox className="cursor-pointer h-full">
                <span className="fustat font-bold text-[1.8rem] text-white text-center">
                  Résidentiel
                </span>
              </OptionBox>
            </Link>
            <Link
              href={"/choose-interior-style?type=OFFICE&name=Projet Bureau"}
              passHref
              className="w-full flex-[1_0_0] flex justify-center items-center"
            >
              <OptionBox className="cursor-pointer h-full">
                <span className="fustat font-bold text-[1.8rem] text-white text-center">
                  Bureaux
                </span>
              </OptionBox>
            </Link>
          </ScreenScale>
        </div>
      </div>
    </MainPageWrapper>
  );
  return xml;
};

export default MainChooseProjectPage;
