import React from 'react';
import Image from 'next/image';

interface FeatureCard {
  id: number;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  imageSrc: string;
  imageAlt: string;
}

const FeaturesCards: React.FC = () => {
  const features: FeatureCard[] = [
    {
      id: 1,
      title: "Rendus d'intérieur",
      description: "Refresh Your Interior With New design Flooring Looking to install new interior look.",
      ctaText: "Générer des rendus",
      ctaLink: "/generate-renders",
      imageSrc: "/assets/img-1.png",
      imageAlt: "Interior rendering showing modern living room design"
    },
    {
      id: 2,
      title: "Personnalisation",
      description: "Refresh Your Interior With New design Flooring Looking to install new interior look.",
      ctaText: "Essayer",
      ctaLink: "/personalization",
      imageSrc: "/assets/img-2.png",
      imageAlt: "Personalized interior design with custom furniture selection"
    },
    {
      id: 3,
      title: "Click & Buy",
      description: "Refresh Your Interior With New design Flooring Looking to install new interior look.",
      ctaText: "Faire un tour",
      ctaLink: "/click-buy",
      imageSrc: "/assets/img-3.png", // Replace with your actual image path
      imageAlt: "Click and buy furniture interface showing chair selection"
    }
  ];

  return (
    <section className="bg-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
            >
              {/* Image Container */}
              <div className="relative overflow-hidden rounded-t-2xl">
                <div className="aspect-[4/3] relative">
                  <Image
                    src={feature.imageSrc}
                    alt={feature.imageAlt}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                {/* Title */}
                <h3 className="text-gray-800 text-xl md:text-2xl font-semibold mb-4">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-base leading-relaxed mb-6">
                  {feature.description}
                </p>

                {/* CTA Link */}
                <a
                  href={feature.ctaLink}
                  className="inline-flex items-center text-orange-400 hover:text-orange-500 font-medium transition-colors duration-200 group/link"
                >
                  {feature.ctaText}
                  <svg 
                    className="w-4 h-4 ml-2 transition-transform duration-200 group-hover/link:translate-x-1" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" 
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesCards;