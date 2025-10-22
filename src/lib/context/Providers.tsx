"use client";
import React from "react";
import { AuthProvider } from "./AuthContext";

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default Providers;
