/* eslint-disable @typescript-eslint/no-explicit-any */
// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errors?: ValidationError[];
}

export interface PaginatedResponse extends ApiResponse {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ValidationError {
  field: string;
  message: string;
}


export interface User {
  id: string;
  email: string;
  name: string;
  userType: string;
  organization?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: string;
}

// Project Types
export enum ProjectType {
  RESIDENTIAL = "RESIDENTIAL",
  OFFICE = "OFFICE",
}

export enum InteriorStyle {
  ART_DECO = "ART_DECO",
  BOHEMIAN = "BOHEMIAN",
  COASTAL = "COASTAL",
  RUSTIC = "RUSTIC",
  CONTEMPORARY = "CONTEMPORARY",
  ETHNIC = "ETHNIC",
  INDUSTRIAL = "INDUSTRIAL",
  SCANDINAVIAN = "SCANDINAVIAN",
  VINTAGE = "VINTAGE",
  MINIMALIST = "MINIMALIST",
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  type: ProjectType;
  style: InteriorStyle;
  isActive: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
  roomCount: number;
  rooms?: Room[];
}

// Room Types
export enum RoomType {
  LIVING_ROOM = "LIVING_ROOM",
  BEDROOM = "BEDROOM",
  KITCHEN = "KITCHEN",
  BATHROOM = "BATHROOM",
  OFFICE = "OFFICE",
  DINING_ROOM = "DINING_ROOM",
  BALCONY = "BALCONY",
  STUDY = "STUDY",
  HALLWAY = "HALLWAY",
  OTHER = "OTHER",
}

export interface Room {
  id: string;
  projectId: string;
  name?: string;
  type: RoomType;
  length: number;
  width: number;
  height: number;
  materials: string[];
  ambientColor?: string;
  freePrompt?: string;
  originalImageUrl?: string;
  createdAt: string;
  updatedAt: string;
  designCount: number;
  uploadCount: number;
  area: number;
  volume: number;
  project?: {
    id: string;
    name: string;
    type: ProjectType;
    style: InteriorStyle;
  };
  latestDesigns?: Design[];
  latestUploads?: Upload[];
}

// Design Types
export enum DesignStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export interface Design {
  id: string;
  roomId: string;
  imageUrl: string;
  prompt: string;
  aiProvider: "openai" | "replicate";
  status: DesignStatus;
  processingTime?: number;
  error?: string;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
  allImageUrls?: string[];
  room?: Room;
}

// Upload Types
export interface Upload {
  id: string;
  roomId?: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  cloudinaryId?: string;
  metadata?: any;
  createdAt: string;
  room?: {
    id: string;
    name?: string;
    type: RoomType;
    project: {
      id: string;
      name: string;
      userId: string;
    };
  };
}

// DTO Types
export interface RegisterDto {
  email: string;
  name: string;
  password: string;
  userType: string;
  organization?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface CreateProjectDto {
  name: string;
  description?: string;
  type: ProjectType;
  style: InteriorStyle;
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
  type?: ProjectType;
  style?: InteriorStyle;
  isActive?: boolean;
}

export interface CreateRoomDto {
  projectId: string;
  name?: string;
  type: RoomType;
  length: number;
  width: number;
  height: number;
  materials: string[];
  ambientColor?: string;
  freePrompt?: string;
}

export interface UpdateRoomDto {
  name?: string;
  type?: RoomType;
  length?: number;
  width?: number;
  height?: number;
  materials?: string[];
  ambientColor?: string;
  freePrompt?: string;
}

export interface GenerateDesignDto {
  roomId: string;
  customPrompt?: string;
  aiProvider?: "openai" | "replicate";
}

// Query Types
export interface ProjectQuery {
  page?: number;
  limit?: number;
  type?: ProjectType;
  style?: InteriorStyle;
  isActive?: boolean;
  search?: string;
}

export interface RoomQuery {
  page?: number;
  limit?: number;
  projectId?: string;
  type?: RoomType;
}

export interface DesignQuery {
  page?: number;
  limit?: number;
  roomId?: string;
  status?: DesignStatus;
  aiProvider?: "openai" | "replicate";
}

export interface UploadQuery {
  page?: number;
  limit?: number;
  roomId?: string;
}
