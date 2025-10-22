/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "../api-client";
import {
  ApiResponse,
  Room,
  CreateRoomDto,
  UpdateRoomDto,
  RoomQuery,
} from "@/types/api";

export const roomsApi = {
  // Get all rooms with pagination and filters
  getRooms: async (query?: RoomQuery) => {
    const params = new URLSearchParams();

    if (query?.page) params.append("page", query.page.toString());
    if (query?.limit) params.append("limit", query.limit.toString());
    if (query?.projectId) params.append("projectId", query.projectId);
    if (query?.type) params.append("type", query.type);

    const response = await apiClient.get(`/rooms?${params.toString()}`);
    return response.data;
  },

  // Create new room
  createRoom: async (data: CreateRoomDto): Promise<Room> => {
    const response = await apiClient.post<ApiResponse<Room>>("/rooms", data);
    return response.data.data!;
  },

  // Get room by ID
  getRoom: async (id: string): Promise<Room> => {
    const response = await apiClient.get<ApiResponse<Room>>(`/rooms/${id}`);
    return response.data.data!;
  },

  // Update room
  updateRoom: async (id: string, data: UpdateRoomDto): Promise<Room> => {
    const response = await apiClient.put<ApiResponse<Room>>(
      `/rooms/${id}`,
      data
    );
    return response.data.data!;
  },

  // Delete room
  deleteRoom: async (id: string): Promise<void> => {
    await apiClient.delete(`/rooms/${id}`);
  },

  // Get rooms for a specific project
  getProjectRooms: async (projectId: string): Promise<Room[]> => {
    const response = await apiClient.get<ApiResponse<Room[]>>(
      `/rooms/project/${projectId}`
    );
    return response.data.data!;
  },

  // Update room image
  updateRoomImage: async (id: string, imageUrl: string): Promise<Room> => {
    const response = await apiClient.put<ApiResponse<Room>>(
      `/rooms/${id}/image`,
      {
        imageUrl,
      }
    );
    return response.data.data!;
  },

  // Get room statistics
  getRoomStats: async (): Promise<{
    totalRooms: number;
    roomsByType: Record<string, number>;
    roomsByProject: Array<{
      projectId: string;
      projectName: string;
      roomCount: number;
    }>;
    averageRoomSize: number;
    totalDesigns: number;
    totalUploads: number;
  }> => {
    const response = await apiClient.get<ApiResponse<any>>("/rooms/stats");
    return response.data.data!;
  },
};
