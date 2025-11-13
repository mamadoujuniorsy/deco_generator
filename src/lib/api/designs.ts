/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "../api-client";
import {
  ApiResponse,
  Design,
  GenerateDesignDto,
  DesignQuery,
} from "@/types/api";

export const designsApi = {
  // Get all designs with pagination and filters
  getDesigns: async (query?: DesignQuery) => {
    const params = new URLSearchParams();

    if (query?.page) params.append("page", query.page.toString());
    if (query?.limit) params.append("limit", query.limit.toString());
    if (query?.roomId) params.append("roomId", query.roomId);
    if (query?.status) params.append("status", query.status);
    if (query?.aiProvider) params.append("aiProvider", query.aiProvider);

    const response = await apiClient.get(`/designs?${params.toString()}`);
    return response.data;
  },

  // Generate new design
  generateDesign: async (data: GenerateDesignDto): Promise<Design> => {
    const response = await apiClient.post<ApiResponse<Design>>(
      "/designs/generate",
      data
    );
    return response.data.data!;
  },

  // Create design directly (save generated design)
  createDesign: async (data: {
    roomId: string;
    designData: {
      prompt: string;
      style: string;
      images: string[];
    };
  }): Promise<Design> => {
    const response = await apiClient.post<ApiResponse<Design>>(
      "/designs",
      {
        roomId: data.roomId,
        prompt: data.designData.prompt,
        style: data.designData.style,
        images: data.designData.images,
        status: 'completed',
        aiProvider: 'homedesign'
      }
    );
    return response.data.data!;
  },

  // Get design by ID
  getDesign: async (id: string): Promise<Design> => {
    const response = await apiClient.get<ApiResponse<Design>>(`/designs/${id}`);
    return response.data.data!;
  },

  // Delete design
  deleteDesign: async (id: string): Promise<void> => {
    await apiClient.delete(`/designs/${id}`);
  },

  // Get designs for a specific room
  getRoomDesigns: async (roomId: string): Promise<Design[]> => {
    const response = await apiClient.get<ApiResponse<Design[]>>(
      `/designs/room/${roomId}`
    );
    return response.data.data!;
  },

  // Regenerate design
  regenerateDesign: async (
    id: string,
    options?: { aiProvider?: "openai" | "homedesign"; customPrompt?: string }
  ): Promise<Design> => {
    const response = await apiClient.post<ApiResponse<Design>>(
      `/designs/${id}/regenerate`,
      options
    );
    return response.data.data!;
  },

  // Get design statistics
  getDesignStats: async (): Promise<{
    totalDesigns: number;
    designsByStatus: Record<string, number>;
    designsByProvider: Record<string, number>;
    designsByRoomType: Record<string, number>;
    averageProcessingTime: number;
    successRate: number;
    recentDesigns: Array<{
      id: string;
      status: string;
      aiProvider: string;
      roomName: string;
      projectName: string;
      createdAt: string;
      processingTime?: number;
    }>;
  }> => {
    const response = await apiClient.get<ApiResponse<any>>("/designs/stats");
    return response.data.data!;
  },
};
