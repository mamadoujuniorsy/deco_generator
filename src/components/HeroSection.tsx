"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

const HeroSection: React.FC = () => {
  const router = useRouter();
  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url("/assets/hero.png")' }}
      id="hero"
    >
      {/* Top Bar */}
      <div className="bg-orange-400 px-4 py-2 flex justify-between items-center">
        <div className="flex items-center text-white"></div>
        <div className="flex space-x-3">
          <a
            href="#"
            className="text-white hover:text-orange-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
            </svg>
          </a>
          <a
            href="#"
            className="text-white hover:text-orange-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.042-3.441.219-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.748.099.119.112.225.085.348-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378 0 0-.599 2.282-.744 2.840-.282 1.084-1.036 2.461-1.549 3.235C9.408 23.77 10.681 24 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z" />
            </svg>
          </a>
          <a
            href="#"
            className="text-white hover:text-orange-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>
          <a
            href="#"
            className="text-white hover:text-orange-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </a>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-transparent backdrop-blur-sm px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-white text-2xl font-bold mr-2">
              {/* Geometric logo shape */}
              <Image
                src={"/logo-white.png"}
                alt="Logo"
                width={150}
                height={50}
              />
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link
              href="/"
              className="text-white hover:text-orange-200 transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              href="/pricing"
              className="text-white hover:text-orange-200 transition-colors font-medium"
            >
              Pricing
            </Link>
            <Link
              href="/subscription"
              className="text-white hover:text-orange-200 transition-colors font-medium"
            >
              Subscription
            </Link>
            <Link
              href="/professionals"
              className="text-white hover:text-orange-200 transition-colors font-medium"
            >
              Professionals
            </Link>
          </div>

          {/* Generator Button avant ça redirigeait vers welcome et je l'ai changé vers 
          ma nouvele page generator pour faire des tests*/}
          <div className="flex items-center gap-4">
          <button
            className="bg-orange-400 hover:bg-orange-500 text-white px-6 py-2 rounded-full font-medium transition-colors flex items-center"
            onClick={() => router.push("/generator")}
          >
            Generator
            <svg
              className="w-4 h-4 ml-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            className="bg-white hover:bg-orange-500/60 text-orange-500 hover:text-white px-6 py-2 rounded-full font-medium transition-colors flex items-center"
            onClick={() => router.push("/auth/signup")}
          >
            Sign Up
          </button>
          <button
            className="bg-white hover:bg-orange-500/60 text-orange-500 hover:text-white px-6 py-2 rounded-full font-medium transition-colors flex items-center"
            onClick={() => router.push("/auth/login")}
          >
            Sign In
          </button>

          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Subtitle */}
          <p className="text-orange-200 text-lg mb-6 font-light">
            Libérez votre créativité
          </p>

          {/* Main Heading */}
          <h1 className="text-white text-5xl md:text-6xl lg:text-7xl font-light leading-tight mb-12">
            Un simple clic
            <br />
            transformera votre
            <br />
            espace
          </h1>

          {/* CTA Button */}
          <button
            className="bg-orange-400 hover:bg-orange-500 text-white px-8 py-3 rounded-full font-medium text-lg transition-colors inline-flex items-center"
            onClick={() => router.push("/welcome")}
          >
            C&apos;est parti !
            <svg
              className="w-5 h-5 ml-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Bottom Right - Payment Methods */}
      <div className="absolute bottom-6 right-6 flex space-x-2">
        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
          <span className="text-white text-sm">Paiements sécurisés</span>
        </div>
        <div className="flex space-x-2">
          <div className="bg-white rounded p-2">
            <div className="w-8 h-6 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
              2K
            </div>
          </div>
          <div className="bg-white rounded p-2">
            <div className="w-8 h-6 bg-blue-900 rounded text-white text-xs flex items-center justify-center font-bold">
              W
            </div>
          </div>
          <div className="bg-white rounded p-2">
            <div className="w-8 h-6 bg-yellow-500 rounded text-white text-xs flex items-center justify-center font-bold">
              YG
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Button (hidden by default, shows on mobile) */}
      <button className="md:hidden fixed top-4 right-4 z-50 text-white">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </div>
  );
};

export default HeroSection;
