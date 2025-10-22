/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "../api-client";
import {
  ApiResponse,
  Project,
  CreateProjectDto,
  UpdateProjectDto,
  ProjectQuery,
} from "@/types/api";

export const projectsApi = {
  // Get all projects with pagination and filters
  getProjects: async (query?: ProjectQuery) => {
    const params = new URLSearchParams();

    if (query?.page) params.append("page", query.page.toString());
    if (query?.limit) params.append("limit", query.limit.toString());
    if (query?.type) params.append("type", query.type);
    if (query?.style) params.append("style", query.style);
    if (query?.isActive !== undefined)
      params.append("isActive", query.isActive.toString());
    if (query?.search) params.append("search", query.search);

    const response = await apiClient.get(`/projects?${params.toString()}`);
    return response.data;
  },

  // Create new project
  createProject: async (data: CreateProjectDto): Promise<Project> => {
    const response = await apiClient.post<ApiResponse<Project>>(
      "/projects",
      data
    );
    return response.data.data!;
  },

  // Get project by ID
  getProject: async (id: string): Promise<Project> => {
    const response = await apiClient.get<ApiResponse<Project>>(
      `/projects/${id}`
    );
    return response.data.data!;
  },

  // Update project
  updateProject: async (
    id: string,
    data: UpdateProjectDto
  ): Promise<Project> => {
    const response = await apiClient.put<ApiResponse<Project>>(
      `/projects/${id}`,
      data
    );
    return response.data.data!;
  },

  // Delete project
  deleteProject: async (id: string): Promise<void> => {
    await apiClient.delete(`/projects/${id}`);
  },

  // Duplicate project
  duplicateProject: async (id: string, name?: string): Promise<Project> => {
    const response = await apiClient.post<ApiResponse<Project>>(
      `/projects/${id}/duplicate`,
      {
        name,
      }
    );
    return response.data.data!;
  },

  // Get project statistics
  getProjectStats: async (): Promise<{
    totalProjects: number;
    activeProjects: number;
    projectsByType: Record<string, number>;
    projectsByStyle: Record<string, number>;
    totalRooms: number;
    totalDesigns: number;
    recentActivity: any[];
  }> => {
    const response = await apiClient.get<ApiResponse<any>>("/projects/stats");
    return response.data.data!;
  },
};
