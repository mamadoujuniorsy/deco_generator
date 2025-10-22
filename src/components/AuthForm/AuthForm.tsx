/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "./InputField";
import AuthSubmitButton from "./AuthSubmitButton";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useLogin, useRegister } from "@/lib/hooks/api";
import { useAuth } from "@/lib/context/AuthContext";

const AuthForm: React.FC<{ type: "signup" | "signin" }> = ({ type }) => {
  const router = useRouter();
  const { login } = useAuth();

  const signupMutation = useRegister({
    onSuccess: (res) => {
      console.log("login response:", res);
      if (res.token) {
        const { token, refreshToken, expiresIn } = res;

        // Save user and tokens to context
        login(res?.user, { token, refreshToken, expiresIn });

        toast.success("Signup successful! Welcome!");

        router.push("/welcome");
      }
    },
    onError: (error: any) => {
      console.error("Signup error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Signup failed. Please try again.";
      toast.error(errorMessage);
    },
  });

  const loginMutation = useLogin({
    onSuccess: (res) => {
      console.log("login response:", res);
      if (res.user) {
        const { user, token, refreshToken, expiresIn } = res;

        // Save user and tokens to context
        login(user, { token, refreshToken, expiresIn });

        toast.success("Login successful! Welcome back!");

        // Redirect to welcome page
        router.push("/welcome");
      }
    },
    onError: (error: any) => {
      console.error("Login error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Login failed. Please try again.";
      toast.error(errorMessage);
    },
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    organization: "",
    userType: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  // Form validation function
  const validateForm = () => {
    if (type === "signup") {
      if (!form.name.trim()) {
        toast.error("Name is required");
        return false;
      }
      if (!form.email.trim()) {
        toast.error("Email is required");
        return false;
      }
      if (!form.password.trim()) {
        toast.error("Password is required");
        return false;
      }
      if (!form.userType) {
        toast.error("User type is required");
        return false;
      }
      // Organization is optional
    } else {
      if (!form.email.trim()) {
        toast.error("Email is required");
        return false;
      }
      if (!form.password.trim()) {
        toast.error("Password is required");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    try {
      if (type === "signup") {
        // The onSuccess callback will handle the redirect
        await signupMutation.mutateAsync({
          name: form.name,
          email: form.email,
          password: form.password,
          organization: form.organization || undefined, // Send undefined if empty
          userType: form.userType,
        });
      } else {
        // The onSuccess callback will handle the redirect
        await loginMutation.mutateAsync({
          email: form.email,
          password: form.password,
        });
      }
    } catch (error) {
      // Error handling is done in the mutation's onError callback
      console.error("Auth submission error:", error);
    }
  };

  return (
    <div className="w-full max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
      <form
        onSubmit={handleSubmit}
        className="relative p-8 sm:p-12 lg:p-16 bg-gradient-to-br from-black/80 via-black/70 to-black/60
                   border border-white/20 backdrop-blur-xl rounded-2xl
                   w-full max-w-[52rem] mx-auto
                   shadow-[0_0_60px_rgba(255,197,0,0.15)]
                   before:absolute before:inset-0 before:rounded-2xl
                   before:bg-gradient-to-br before:from-white/10 before:to-transparent
                   before:opacity-50 before:pointer-events-none
                   transition-all duration-300 hover:shadow-[0_0_80px_rgba(255,197,0,0.2)]"
      >
        {/* Form Header */}
        <div className="text-center mb-8 lg:mb-12">
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4
                         bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text"
          >
            {type === "signup" ? "Créer un compte" : "Se connecter"}
          </h1>
          <p className="text-gray-300 text-lg sm:text-xl">
            {type === "signup"
              ? "Rejoignez-nous pour commencer votre voyage"
              : "Bon retour parmi nous"}
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-6 lg:space-y-8">
          {type === "signup" && (
            <>
              <InputField
                type="text"
                id="name"
                label="Prénom et nom"
                placeholder="Prénom et nom"
                value={form.name}
                onChange={handleChange}
                className="transform transition-all duration-200 hover:scale-[1.02]"
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                <InputField
                  type="email"
                  id="email"
                  label="Adresse e-mail"
                  placeholder="Adresse électronique"
                  value={form.email}
                  onChange={handleChange}
                  className="transform transition-all duration-200 hover:scale-[1.02]"
                />
                <InputField
                  type="password"
                  id="password"
                  label="Mot de passe"
                  placeholder="Mot de passe"
                  value={form.password}
                  onChange={handleChange}
                  className="transform transition-all duration-200 hover:scale-[1.02]"
                />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                <InputField
                  type="text"
                  id="organization"
                  label="Organisation (optionnel)"
                  placeholder="Nom de votre organisation"
                  value={form.organization}
                  onChange={handleChange}
                  className="transform transition-all duration-200 hover:scale-[1.02]"
                />

                {/* User Type Selection */}
                <div className="transform transition-all duration-200 hover:scale-[1.02]">
                  <label
                    htmlFor="userType"
                    className="block text-white text-lg font-medium mb-3
                               bg-gradient-to-r from-white to-gray-200 bg-clip-text"
                  >
                    Type d&apos;utilisateur
                  </label>
                  <select
                    id="userType"
                    value={form.userType}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl
                               text-white text-lg backdrop-blur-sm
                               focus:outline-none focus:ring-2 focus:ring-yellow-400/50
                               focus:border-yellow-400/50 focus:bg-white/15
                               transition-all duration-300
                               hover:bg-white/15 hover:border-white/30"
                  >
                    <option value="" className="bg-gray-800 text-white">
                      Sélectionner le type
                    </option>
                    <option
                      value="INDIVIDUAL"
                      className="bg-gray-800 text-white"
                    >
                      Individuel
                    </option>
                    <option value="BUSINESS" className="bg-gray-800 text-white">
                      Entreprise
                    </option>
                  </select>
                </div>
              </div>

              <div className="pt-4 lg:pt-8">
                <AuthSubmitButton
                  disabled={signupMutation.isPending}
                  className="w-full py-4 lg:py-5 text-xl lg:text-2xl font-semibold
                             bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600
                             hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700
                             transform transition-all duration-300 hover:scale-[1.02]
                             hover:shadow-[0_0_30px_rgba(255,197,0,0.4)]
                             disabled:opacity-50 disabled:cursor-not-allowed
                             disabled:transform-none disabled:shadow-none"
                >
                  {signupMutation.isPending ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-6 h-6 border-2 border-gray-800 border-t-transparent rounded-full animate-spin" />
                      Inscription...
                    </div>
                  ) : (
                    "S'inscrire"
                  )}
                </AuthSubmitButton>
              </div>
            </>
          )}

          {type === "signin" && (
            <>
              <InputField
                type="email"
                id="email"
                label="Adresse e-mail"
                placeholder="Adresse électronique"
                value={form.email}
                onChange={handleChange}
                className="transform transition-all duration-200 hover:scale-[1.02]"
              />
              <InputField
                type="password"
                id="password"
                label="Mot de passe"
                placeholder="Mot de passe"
                value={form.password}
                onChange={handleChange}
                className="transform transition-all duration-200 hover:scale-[1.02]"
              />

              <div className="pt-4 lg:pt-8 space-y-6">
                <AuthSubmitButton
                  disabled={loginMutation.isPending}
                  className="w-full py-4 lg:py-5 text-xl lg:text-2xl font-semibold
                             bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600
                             hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700
                             transform transition-all duration-300 hover:scale-[1.02]
                             hover:shadow-[0_0_30px_rgba(255,197,0,0.4)]
                             disabled:opacity-50 disabled:cursor-not-allowed
                             disabled:transform-none disabled:shadow-none"
                >
                  {loginMutation.isPending ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-6 h-6 border-2 border-gray-800 border-t-transparent rounded-full animate-spin" />
                      Connexion...
                    </div>
                  ) : (
                    "Se connecter"
                  )}
                </AuthSubmitButton>

                <div className="text-center space-y-4">
                  <Link
                    href="/auth/forgot-password"
                    className="inline-block text-yellow-400 hover:text-yellow-300
                               text-lg font-medium underline decoration-transparent
                               hover:decoration-current transition-all duration-300
                               transform hover:scale-105"
                  >
                    Mot de passe oublié ?
                  </Link>
                  <div className="text-gray-400">
                    Pas de compte ?{" "}
                    <Link
                      href="/auth/signup"
                      className="text-yellow-400 hover:text-yellow-300 font-medium
                                 underline decoration-transparent hover:decoration-current
                                 transition-all duration-300 transform hover:scale-105"
                    >
                      S&apos;inscrire
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default AuthForm;
