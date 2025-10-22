/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from '../api-client';
import { ApiResponse, LoginDto, RegisterDto, LoginResponse, User } from '@/types/api';

export const authApi = {
  // Register new user
  register: async (data: RegisterDto): Promise<LoginResponse> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/register', data);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Registration failed');
  },

  // Login user
  login: async (data: LoginDto): Promise<LoginResponse> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', data);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Login failed');
  },

  // Get current user profile
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>('/auth/me');
    return response.data.data!;
  },

  // Update user profile
  updateProfile: async (data: { name?: string; organization?: string }): Promise<User> => {
    const response = await apiClient.put<ApiResponse<User>>('/auth/profile', data);
    return response.data.data!;
  },

  // Change password
  changePassword: async (data: { currentPassword: string; newPassword: string }): Promise<void> => {
    await apiClient.put('/auth/change-password', data);
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<{ token: string; expiresIn: string }> => {
    const response = await apiClient.post<ApiResponse<{ token: string; expiresIn: string }>>('/auth/refresh', {
      refreshToken,
    });
    return response.data.data!;
  },

  // Logout
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  // Logout from all devices
  logoutAll: async (): Promise<void> => {
    await apiClient.post('/auth/logout-all');
  },

  // Check if email exists
  checkEmail: async (email: string): Promise<{ exists: boolean }> => {
    const response = await apiClient.post<ApiResponse<{ exists: boolean }>>('/auth/check-email', {
      email,
    });
    return response.data.data!;
  },

  // Get active sessions
  getSessions: async (): Promise<any[]> => {
    const response = await apiClient.get<ApiResponse<any[]>>('/auth/sessions');
    return response.data.data!;
  },

  // Revoke specific session
  revokeSession: async (sessionId: string): Promise<void> => {
    await apiClient.delete(`/auth/sessions/${sessionId}`);
  },
};