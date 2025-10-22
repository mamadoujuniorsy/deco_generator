/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useCallback } from "react";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { useAuth } from "../context/AuthContext";
import { tokenStorage, authUtils } from "../cookies";
import apiClient from "../api-client";

export const useApiClient = () => {
  const { state } = useAuth();

  // GET request
  const get = useCallback(
    async <T = any>(
      url: string,
      config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> => {
      return apiClient.get<T>(url, config);
    },
    []
  );

  // POST request
  const post = useCallback(
    async <T = any>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> => {
      return apiClient.post<T>(url, data, config);
    },
    []
  );

  // PUT request
  const put = useCallback(
    async <T = any>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> => {
      return apiClient.put<T>(url, data, config);
    },
    []
  );

  // PATCH request
  const patch = useCallback(
    async <T = any>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> => {
      return apiClient.patch<T>(url, data, config);
    },
    []
  );

  // DELETE request
  const del = useCallback(
    async <T = any>(
      url: string,
      config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> => {
      return apiClient.delete<T>(url, config);
    },
    []
  );

  // Upload file
  const upload = useCallback(
    async <T = any>(
      url: string,
      file: File,
      onUploadProgress?: (progressEvent: any) => void
    ): Promise<AxiosResponse<T>> => {
      const formData = new FormData();
      formData.append("file", file);

      return apiClient.post<T>(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress,
      });
    },
    []
  );

  // Get current auth token from cookies
  const getAuthToken = useCallback(() => {
    return tokenStorage.getAccessToken();
  }, []);

  // Check if user is authenticated using cookies
  const isAuthenticated = useCallback(() => {
    return authUtils.isAuthenticated();
  }, []);

  // Get token expiry
  const getTokenExpiry = useCallback(() => {
    const token = tokenStorage.getAccessToken();
    return token ? authUtils.getTokenExpiry(token) : null;
  }, []);

  // Check if token will expire soon (within 5 minutes)
  const isTokenExpiringSoon = useCallback(() => {
    const expiry = getTokenExpiry();
    if (!expiry) return true;

    const fiveMinutesFromNow = Date.now() + 5 * 60 * 1000;
    return expiry < fiveMinutesFromNow;
  }, [getTokenExpiry]);

  return {
    get,
    post,
    put,
    patch,
    delete: del,
    upload,
    getAuthToken,
    isAuthenticated,
    getTokenExpiry,
    isTokenExpiringSoon,
    user: state.user,
    apiClient, // Export the raw client for advanced usage

    // Additional cookie-based utilities
    hasTokens: tokenStorage.hasTokens,
    clearTokens: tokenStorage.clearTokens,
  };
};
