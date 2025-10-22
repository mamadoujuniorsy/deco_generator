"use client";
import React, { useState } from "react";
import FeaturesCards from "./FeaturesCard";
import { useRouter } from "next/navigation";

const ServicesSection: React.FC = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const router = useRouter();
  const handlePlayVideo = () => {
    setIsVideoPlaying(true);
    // Add your video play logic here
    console.log("Playing video...");
  };

  return (
    <section className="bg-gray-50 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Top Section - Photo Import */}
        <div className="text-center mb-16">
          {/* Subtitle */}
          <p className="text-orange-400 text-lg mb-6 font-medium">
            Prenez une longueur d&apos;avance
          </p>

          {/* Main Heading */}
          <h2 className="text-gray-800 text-4xl md:text-5xl lg:text-6xl font-light leading-tight mb-12">
            Importez votre photo d&apos;intérieur
          </h2>

          {/* Generate Button */}
          <button
            className="bg-orange-400 hover:bg-orange-500 text-white px-8 py-3 rounded-full font-medium text-lg transition-colors inline-flex items-center mb-12"
            onClick={() => router.push("/welcome")}
          >
            Générer votre image
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

          {/* Video Player Component */}
          <div className="relative max-w-4xl mx-auto">
            <div
              className="relative rounded-3xl overflow-hidden shadow-2xl cursor-pointer"
              style={{
                backgroundImage: 'url("/assets/services-img.png")',
                backgroundSize: "cover",
                backgroundPosition: "center",
                aspectRatio: "16/9",
              }}
              onClick={handlePlayVideo}
            >
              {/* Overlay for better play button visibility */}
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>

              {/* Play Button */}
              {!isVideoPlaying && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-6 transition-all duration-300 transform hover:scale-110">
                    <svg
                      className="w-12 h-12 text-gray-800 ml-1"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Video Element (hidden by default) */}
              {isVideoPlaying && (
                <video
                  className="w-full h-full object-cover"
                  controls
                  autoPlay
                  poster="/your-interior-image.jpg"
                >
                  <source src="/your-video.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section - Services */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-12">
          {/* Left Content */}
          <div className="lg:w-2/3">
            {/* Services Label */}
            <p className="text-orange-400 text-sm uppercase tracking-wide font-medium mb-4">
              NOS SERVICES
            </p>

            {/* Services Heading */}
            <h3 className="text-gray-800 text-3xl md:text-4xl lg:text-5xl font-light leading-tight mb-6">
              Les services que nous proposons
            </h3>

            {/* Services Description */}
            <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">
              Our design services starts and ends with a best in class
              experience strategy that builds brands.
            </p>
          </div>

          {/* Right Content - CTA Button */}
          <div className="lg:w-1/3 flex justify-center lg:justify-end">
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
      </div>
      <FeaturesCards />
    </section>
  );
};

export default ServicesSection;
