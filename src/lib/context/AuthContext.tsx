"use client";
import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { clearAuthToken, setAuthContextMethods } from "../api-client";
import { tokenStorage, userStorage, authUtils } from "../cookies";

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  userType: "INDIVIDUAL" | "BUSINESS";
  organization: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  token: string;
  refreshToken: string;
  expiresIn: string;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Action types
type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: { user: User; tokens: AuthTokens } }
  | { type: "LOGIN_FAILURE" }
  | { type: "LOGOUT" }
  | { type: "UPDATE_USER"; payload: User }
  | { type: "REFRESH_TOKEN"; payload: AuthTokens }
  | { type: "SET_LOADING"; payload: boolean };

// Initial state
const initialState: AuthState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: true,
};

// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        ...state,
        isLoading: true,
      };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        tokens: action.payload.tokens,
        isAuthenticated: true,
        isLoading: false,
      };
    case "LOGIN_FAILURE":
      return {
        ...state,
        user: null,
        tokens: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        tokens: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: action.payload,
      };
    case "REFRESH_TOKEN":
      return {
        ...state,
        tokens: action.payload,
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

// Context type
interface AuthContextType {
  state: AuthState;
  login: (user: User, tokens: AuthTokens) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  refreshToken: (tokens: AuthTokens) => void;
  setLoading: (loading: boolean) => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set up API client integration
  useEffect(() => {
    setAuthContextMethods(logout, refreshToken);
  }, []);

  // Load auth data from cookies on mount
  useEffect(() => {
    const loadAuthData = () => {
      try {
        const user = userStorage.getUser();
        const accessToken = tokenStorage.getAccessToken();
        const refreshTokenValue = tokenStorage.getRefreshToken();

        if (user && accessToken && refreshTokenValue) {
          // Check if token is expired
          const isExpired = authUtils.isTokenExpired(accessToken);

          if (!isExpired) {
            const tokens: AuthTokens = {
              token: accessToken,
              refreshToken: refreshTokenValue,
              expiresIn: "", // You might want to calculate this from token payload
            };

            dispatch({
              type: "LOGIN_SUCCESS",
              payload: { user, tokens },
            });
          } else {
            // Token expired, clear cookies
            tokenStorage.clearTokens();
            userStorage.clearUser();
            dispatch({ type: "LOGIN_FAILURE" });
          }
        } else {
          dispatch({ type: "LOGIN_FAILURE" });
        }
      } catch (error) {
        console.error("Error loading auth data:", error);
        // Clear corrupted data
        tokenStorage.clearTokens();
        userStorage.clearUser();
        dispatch({ type: "LOGIN_FAILURE" });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    loadAuthData();
  }, []);

  // Context methods
  const login = (user: User, tokens: AuthTokens) => {
    // Save to cookies
    const tokensSaved = tokenStorage.setTokens(tokens);
    const userSaved = userStorage.setUser(user);

    if (tokensSaved && userSaved) {
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { user, tokens },
      });
    } else {
      console.error("Failed to save auth data to cookies");
      dispatch({ type: "LOGIN_FAILURE" });
    }
  };

  const logout = () => {
    // Clear cookies
    tokenStorage.clearTokens();
    userStorage.clearUser();

    // Clear API client token
    clearAuthToken();

    dispatch({ type: "LOGOUT" });
  };

  const updateUser = (user: User) => {
    // Update cookies
    userStorage.setUser(user);

    dispatch({
      type: "UPDATE_USER",
      payload: user,
    });
  };

  const refreshToken = (tokens: AuthTokens) => {
    // Update cookies
    tokenStorage.setTokens(tokens);

    dispatch({
      type: "REFRESH_TOKEN",
      payload: tokens,
    });
  };

  const setLoading = (loading: boolean) => {
    dispatch({
      type: "SET_LOADING",
      payload: loading,
    });
  };

  const contextValue: AuthContextType = {
    state,
    login,
    logout,
    updateUser,
    refreshToken,
    setLoading,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
