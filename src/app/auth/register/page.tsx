"use client";

import AuthForm from "@/components/AuthForm/AuthForm";
import AuthFormWrapper from "@/components/AuthForm/AuthFormWrapper";

export default function SignupPage() {
  return (
    <AuthFormWrapper className="bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="w-full flex items-center justify-center">
        <AuthForm type="signup" />
      </div>
    </AuthFormWrapper>
  );
}
