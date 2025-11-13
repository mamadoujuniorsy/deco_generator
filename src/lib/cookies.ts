// Storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "auth_token",
  REFRESH_TOKEN: "refresh_token",
  USER_DATA: "user_data",
} as const;

// Token management with localStorage (secure enough for JWT)
export const tokenStorage = {
  setTokens: (tokens: {
    token: string;
    refreshToken: string;
    expiresIn: string;
  }) => {
    try {
      if (typeof window === 'undefined') return false;
      
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.token);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
      
      console.log('✅ Tokens saved to localStorage');
      return true;
    } catch (error) {
      console.error("❌ Error saving tokens:", error);
      return false;
    }
  },

  getAccessToken: (): string | null => {
    try {
      if (typeof window === 'undefined') return null;
      return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    } catch (error) {
      console.error("❌ Error getting access token:", error);
      return null;
    }
  },

  getRefreshToken: (): string | null => {
    try {
      if (typeof window === 'undefined') return null;
      return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    } catch (error) {
      console.error("❌ Error getting refresh token:", error);
      return null;
    }
  },

  clearTokens: () => {
    try {
      if (typeof window === 'undefined') return false;
      
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      
      console.log('✅ Tokens cleared');
      return true;
    } catch (error) {
      console.error("❌ Error clearing tokens:", error);
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
  setUser: (user: any) => {
    try {
      if (typeof window === 'undefined') return false;
      
      const userData = JSON.stringify(user);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, userData);
      
      console.log('✅ User data saved');
      return true;
    } catch (error) {
      console.error("❌ Error saving user data:", error);
      return false;
    }
  },

  getUser: (): any | null => {
    try {
      if (typeof window === 'undefined') return null;
      
      const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("❌ Error getting user data:", error);
      return null;
    }
  },

  clearUser: () => {
    try {
      if (typeof window === 'undefined') return false;
      
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      console.log('✅ User data cleared');
      return true;
    } catch (error) {
      console.error("❌ Error clearing user data:", error);
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
