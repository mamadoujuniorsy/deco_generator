/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
import { projectsApi } from "@/lib/api/projects";
import { roomsApi } from "@/lib/api/rooms";
import { designsApi } from "@/lib/api/designs";
import { uploadsApi } from "@/lib/api/uploads";
import {
  LoginDto,
  RegisterDto,
  CreateProjectDto,
  UpdateProjectDto,
  CreateRoomDto,
  UpdateRoomDto,
  GenerateDesignDto,
  ProjectQuery,
  RoomQuery,
  DesignQuery,
  UploadQuery,
} from "@/types/api";

// Query Keys
export const QUERY_KEYS = {
  auth: {
    profile: ["auth", "profile"] as const,
    sessions: ["auth", "sessions"] as const,
  },
  projects: {
    all: ["projects"] as const,
    list: (query?: ProjectQuery) => ["projects", "list", query] as const,
    detail: (id: string) => ["projects", "detail", id] as const,
    stats: ["projects", "stats"] as const,
  },
  rooms: {
    all: ["rooms"] as const,
    list: (query?: RoomQuery) => ["rooms", "list", query] as const,
    detail: (id: string) => ["rooms", "detail", id] as const,
    byProject: (projectId: string) =>
      ["rooms", "byProject", projectId] as const,
    stats: ["rooms", "stats"] as const,
  },
  designs: {
    all: ["designs"] as const,
    list: (query?: DesignQuery) => ["designs", "list", query] as const,
    detail: (id: string) => ["designs", "detail", id] as const,
    byRoom: (roomId: string) => ["designs", "byRoom", roomId] as const,
    stats: ["designs", "stats"] as const,
  },
  uploads: {
    all: ["uploads"] as const,
    list: (query?: UploadQuery) => ["uploads", "list", query] as const,
    detail: (id: string) => ["uploads", "detail", id] as const,
    byRoom: (roomId: string) => ["uploads", "byRoom", roomId] as const,
    stats: ["uploads", "stats"] as const,
  },
} as const;

// Auth Hooks
export const useLogin = (
  options?: UseMutationOptions<any, Error, LoginDto>
) => {
  return useMutation({
    mutationFn: authApi.login,
    ...options,
  });
};

export const useRegister = (
  options?: UseMutationOptions<any, Error, RegisterDto>
) => {
  return useMutation({
    mutationFn: authApi.register,
    ...options,
  });
};

export const useProfile = (options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: QUERY_KEYS.auth.profile,
    queryFn: authApi.getProfile,
    ...options,
  });
};

export const useUpdateProfile = (
  options?: UseMutationOptions<
    any,
    Error,
    { name?: string; organization?: string }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.profile });
    },
    ...options,
  });
};

export const useLogout = (options?: UseMutationOptions<void, Error, void>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.clear();
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");
    },
    ...options,
  });
};

// Project Hooks
export const useProjects = (
  query?: ProjectQuery,
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: QUERY_KEYS.projects.list(query),
    queryFn: () => projectsApi.getProjects(query),
    ...options,
  });
};

export const useProject = (
  id: string,
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: QUERY_KEYS.projects.detail(id),
    queryFn: () => projectsApi.getProject(id),
    enabled: !!id,
    ...options,
  });
};

export const useCreateProject = (
  options?: UseMutationOptions<any, Error, CreateProjectDto>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectsApi.createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects.all });
    },
    ...options,
  });
};

export const useUpdateProject = (
  options?: UseMutationOptions<
    any,
    Error,
    { id: string; data: UpdateProjectDto }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: any) => projectsApi.updateProject(id, data),
    onSuccess: (_: any, { id }: any) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.projects.detail(id),
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects.all });
    },
    ...options,
  });
};

export const useDeleteProject = (
  options?: UseMutationOptions<void, Error, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectsApi.deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects.all });
    },
    ...options,
  });
};

export const useDuplicateProject = (
  options?: UseMutationOptions<any, Error, { id: string; name?: string }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name }: any) => projectsApi.duplicateProject(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects.all });
    },
    ...options,
  });
};

export const useProjectStats = (options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: QUERY_KEYS.projects.stats,
    queryFn: projectsApi.getProjectStats,
    ...options,
  });
};

// Room Hooks
export const useRooms = (
  query?: RoomQuery,
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: QUERY_KEYS.rooms.list(query),
    queryFn: () => roomsApi.getRooms(query),
    ...options,
  });
};

export const useRoom = (id: string, options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: QUERY_KEYS.rooms.detail(id),
    queryFn: () => roomsApi.getRoom(id),
    enabled: !!id,
    ...options,
  });
};

export const useProjectRooms = (
  projectId: string,
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: QUERY_KEYS.rooms.byProject(projectId),
    queryFn: () => roomsApi.getProjectRooms(projectId),
    enabled: !!projectId,
    ...options,
  });
};

export const useCreateRoom = (
  options?: UseMutationOptions<any, Error, CreateRoomDto>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: roomsApi.createRoom,
    onSuccess: (room: any) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.rooms.all });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.rooms.byProject(room.projectId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.projects.detail(room.projectId),
      });
    },
    ...options,
  });
};

export const useUpdateRoom = (
  options?: UseMutationOptions<any, Error, { id: string; data: UpdateRoomDto }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: any) => roomsApi.updateRoom(id, data),
    onSuccess: (room: any, { id }: any) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.rooms.detail(id!) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.rooms.all });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.rooms.byProject(room?.projectId),
      });
    },
    ...options,
  });
};

export const useDeleteRoom = (
  options?: UseMutationOptions<void, Error, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: roomsApi.deleteRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.rooms.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects.all });
    },
    ...options,
  });
};

export const useUpdateRoomImage = (
  options?: UseMutationOptions<any, Error, { id: string; imageUrl: string }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, imageUrl }: any) =>
      roomsApi.updateRoomImage(id, imageUrl),
    onSuccess: (_: any, { id }: any) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.rooms.detail(id!) });
    },
    ...options,
  });
};

export const useRoomStats = (options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: QUERY_KEYS.rooms.stats,
    queryFn: roomsApi.getRoomStats,
    ...options,
  });
};

// Design Hooks
export const useDesigns = (
  query?: DesignQuery,
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: QUERY_KEYS.designs.list(query),
    queryFn: () => designsApi.getDesigns(query),
    ...options,
  });
};

export const useDesign = (
  id: string,
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: QUERY_KEYS.designs.detail(id),
    queryFn: () => designsApi.getDesign(id),
    enabled: !!id,
    ...options,
  });
};

export const useRoomDesigns = (
  roomId: string,
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: QUERY_KEYS.designs.byRoom(roomId),
    queryFn: () => designsApi.getRoomDesigns(roomId),
    enabled: !!roomId,
    ...options,
  });
};

export const useGenerateDesign = (
  options?: UseMutationOptions<any, Error, GenerateDesignDto>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: designsApi.generateDesign,
    onSuccess: (design: any) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.designs.all });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.designs.byRoom(design?.roomId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.rooms.detail(design?.roomId),
      });
    },
    ...options,
  });
};

export const useDeleteDesign = (
  options?: UseMutationOptions<void, Error, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: designsApi.deleteDesign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.designs.all });
    },
    ...options,
  });
};

export const useRegenerateDesign = (
  options?: UseMutationOptions<
    any,
    Error,
    {
      id: string;
      options?: { aiProvider?: "openai" | "homedesign"; customPrompt?: string };
    }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, options: regenOptions }: any) =>
      designsApi.regenerateDesign(id, regenOptions),
    onSuccess: (design: any) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.designs.all });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.designs.byRoom(design?.roomId),
      });
    },
    ...options,
  });
};

export const useDesignStats = (options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: QUERY_KEYS.designs.stats,
    queryFn: designsApi.getDesignStats,
    ...options,
  });
};

// Upload Hooks
export const useUploads = (
  query?: UploadQuery,
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: QUERY_KEYS.uploads.list(query),
    queryFn: () => uploadsApi.getUserUploads(query),
    ...options,
  });
};

export const useUpload = (
  id: string,
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: QUERY_KEYS.uploads.detail(id),
    queryFn: () => uploadsApi.getUpload(id),
    enabled: !!id,
    ...options,
  });
};

export const useRoomUploads = (
  roomId: string,
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: QUERY_KEYS.uploads.byRoom(roomId),
    queryFn: () => uploadsApi.getRoomUploads(roomId),
    enabled: !!roomId,
    ...options,
  });
};

export const useUploadRoomImage = (
  options?: UseMutationOptions<any, Error, { file: File; roomId?: string }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, roomId }: any) =>
      uploadsApi.uploadRoomImage(file, roomId),
    onSuccess: (result: any, { roomId }: any) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.uploads.all });
      if (roomId) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.uploads.byRoom(roomId),
        });
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.rooms.detail(roomId),
        });
      }
    },
    ...options,
  });
};

export const useDeleteUpload = (
  options?: UseMutationOptions<void, Error, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadsApi.deleteUpload,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.uploads.all });
    },
    ...options,
  });
};

export const useUploadStats = (options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: QUERY_KEYS.uploads.stats,
    queryFn: uploadsApi.getUploadStats,
    ...options,
  });
};
