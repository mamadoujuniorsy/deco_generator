/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "../api-client";
import {
  ApiResponse,
  Upload,
  UploadQuery,
} from "@/types/api";

export const uploadsApi = {
  // Upload room image
  uploadRoomImage: async (
    file: File,
    roomId?: string
  ): Promise<{
    upload: Upload;
    url: string;
    thumbnailUrl: string;
    responsiveUrls: {
      thumbnail: string;
      small: string;
      medium: string;
      large: string;
      original: string;
    };
  }> => {
    const formData = new FormData();
    formData.append("file", file);
    if (roomId) {
      formData.append("roomId", roomId);
    }

    const response = await apiClient.post<ApiResponse<any>>(
      "/uploads/room-image",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data!;
  },

  // Get upload by ID
  getUpload: async (id: string): Promise<Upload> => {
    const response = await apiClient.get<ApiResponse<Upload>>(`/uploads/${id}`);
    return response.data.data!;
  },

  // Delete upload
  deleteUpload: async (id: string): Promise<void> => {
    await apiClient.delete(`/uploads/${id}`);
  },

  // Get user uploads with pagination
  getUserUploads: async (query?: UploadQuery) => {
    const params = new URLSearchParams();

    if (query?.page) params.append("page", query.page.toString());
    if (query?.limit) params.append("limit", query.limit.toString());
    if (query?.roomId) params.append("roomId", query.roomId);

    const response = await apiClient.get(`/uploads?${params.toString()}`);
    return response.data;
  },

  // Get uploads for a specific room
  getRoomUploads: async (roomId: string): Promise<Upload[]> => {
    const response = await apiClient.get<ApiResponse<Upload[]>>(
      `/uploads/room/${roomId}`
    );
    return response.data.data!;
  },

  // Get upload statistics
  getUploadStats: async (): Promise<{
    totalUploads: number;
    totalSize: number;
    totalSizeMB: number;
    uploadsByType: Record<string, number>;
    recentUploads: number;
  }> => {
    const response = await apiClient.get<ApiResponse<any>>("/uploads/stats");
    return response.data.data!;
  },

  // Generate signed upload URL for direct uploads
  generateSignedUploadUrl: async (options?: {
    folder?: string;
    eager?: string;
  }): Promise<{
    url: string;
    signature: string;
    timestamp: number;
    cloudName: string;
    apiKey: string;
    folder: string;
  }> => {
    const response = await apiClient.post<ApiResponse<any>>(
      "/uploads/signed-url",
      options
    );
    return response.data.data!;
  },
};
