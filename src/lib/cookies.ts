/* eslint-disable @typescript-eslint/no-explicit-any */
import Cookies from "js-cookie";

// Cookie configuration
const COOKIE_OPTIONS = {
  secure: process.env.NODE_ENV === "production", // Only use secure in production (HTTPS)
  sameSite: "strict" as const, // CSRF protection
  expires: 7, // 7 days
};

const REFRESH_COOKIE_OPTIONS = {
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  expires: 30, // 30 days for refresh token
};

// Cookie names
export const COOKIE_NAMES = {
  ACCESS_TOKEN: "auth_token",
  REFRESH_TOKEN: "refresh_token",
  USER_DATA: "user_data",
} as const;

// Token management functions
export const tokenStorage = {
  // Set tokens
  setTokens: (tokens: {
    token: string;
    refreshToken: string;
    expiresIn: string;
  }) => {
    try {
      // Set access token
      Cookies.set(COOKIE_NAMES.ACCESS_TOKEN, tokens.token, COOKIE_OPTIONS);

      // Set refresh token with longer expiry
      Cookies.set(
        COOKIE_NAMES.REFRESH_TOKEN,
        tokens.refreshToken,
        REFRESH_COOKIE_OPTIONS
      );

      return true;
    } catch (error) {
      console.error("Error setting tokens in cookies:", error);
      return false;
    }
  },

  // Get access token
  getAccessToken: (): string | null => {
    try {
      return Cookies.get(COOKIE_NAMES.ACCESS_TOKEN) || null;
    } catch (error) {
      console.error("Error getting access token from cookies:", error);
      return null;
    }
  },

  // Get refresh token
  getRefreshToken: (): string | null => {
    try {
      return Cookies.get(COOKIE_NAMES.REFRESH_TOKEN) || null;
    } catch (error) {
      console.error("Error getting refresh token from cookies:", error);
      return null;
    }
  },

  // Clear all tokens
  clearTokens: () => {
    try {
      Cookies.remove(COOKIE_NAMES.ACCESS_TOKEN);
      Cookies.remove(COOKIE_NAMES.REFRESH_TOKEN);
      Cookies.remove(COOKIE_NAMES.USER_DATA);
      return true;
    } catch (error) {
      console.error("Error clearing tokens from cookies:", error);
      return false;
    }
  },

  // Check if token exists
  hasTokens: (): boolean => {
    return !!(tokenStorage.getAccessToken() && tokenStorage.getRefreshToken());
  },
};

// User data management
export const userStorage = {
  // Set user data
  setUser: (user: any) => {
    try {
      const userData = JSON.stringify(user);
      Cookies.set(COOKIE_NAMES.USER_DATA, userData, COOKIE_OPTIONS);
      return true;
    } catch (error) {
      console.error("Error setting user data in cookies:", error);
      return false;
    }
  },

  // Get user data
  getUser: (): any | null => {
    try {
      const userData = Cookies.get(COOKIE_NAMES.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error getting user data from cookies:", error);
      return null;
    }
  },

  // Clear user data
  clearUser: () => {
    try {
      Cookies.remove(COOKIE_NAMES.USER_DATA);
      return true;
    } catch (error) {
      console.error("Error clearing user data from cookies:", error);
      return false;
    }
  },
};

// Utility functions
export const authUtils = {
  // Check if token is expired
  isTokenExpired: (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      console.error("Error checking token expiration:", error);
      return true;
    }
  },

  // Get token expiry time
  getTokenExpiry: (token: string): number | null => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000; // Convert to milliseconds
    } catch (error) {
      console.error("Error getting token expiry:", error);
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const token = tokenStorage.getAccessToken();
    if (!token) return false;

    return !authUtils.isTokenExpired(token);
  },
};
