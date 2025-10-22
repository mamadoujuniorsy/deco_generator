import React from "react";
import AuthFormNavbar from "./AuthFormNavbar";
import Image from "next/image";

const AuthFormWrapper: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  return (
    <>
      <AuthFormNavbar />
      <section
        className={`
          relative min-h-[calc(100dvh-5.9rem)] 
          flex justify-center items-start
          py-8 sm:py-12 lg:py-16
          bg-cover bg-center bg-no-repeat
          ${className}
        `
          .trim()
          .replace(/\s+/g, " ")}
      >
        {/* Background Image with Enhanced Blur */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/render.png"
            alt=""
            fill
            className="object-cover blur-[3px] sm:blur-[2px]"
            priority={false}
            quality={75}
          />
          {/* Additional overlay for better contrast */}
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/30" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-start min-h-[calc(100dvh-11.9rem)]">
            {children}
          </div>
        </div>

        {/* Animated background elements for visual interest */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Floating orbs */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-yellow-400/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400/3 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-3/4 left-1/3 w-48 h-48 bg-purple-400/4 rounded-full blur-3xl animate-pulse delay-2000" />
        </div>
      </section>
    </>
  );
};

export default AuthFormWrapper;
