"use client"
import { useRouter } from 'next/navigation';
import React from 'react';

interface ProcessStep {
  id: number;
  title: string;
  icon?: React.ReactNode;
}

const ProcessSection: React.FC = () => {
    const router = useRouter();
  const designSteps: ProcessStep[] = [
    {
      id: 1,
      title: "Style de décoration",
      icon: (
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      )
    },
    {
      id: 2,
      title: "Type de matériaux",
      icon: (
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
        </svg>
      )
    },
    {
      id: 3,
      title: "Couleurs & Textiles",
      icon: (
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-5.52-4.48-10-9-10z"/>
        </svg>
      )
    },
    {
      id: 4,
      title: "Ambiances générales",
      icon: (
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 11H7v6h2v-6zm4 0h-2v6h2v-6zm4 0h-2v6h2v-6zm2.5-9H19v2h-1.5v17.5c0 .83-.67 1.5-1.5 1.5H8c-.83 0-1.5-.67-1.5-1.5V4H5V2h4.5V.5c0-.83.67-1.5 1.5-1.5h2c.83 0 1.5.67 1.5 1.5V2H19.5z"/>
        </svg>
      )
    }
  ];

  return (
    <section className="bg-gray-50 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* First Process Section - Design Refinement */}
        <div className="text-center mb-20">
          {/* Section Label */}
          <p className="text-orange-400 text-sm uppercase tracking-wide font-medium mb-6">
            OUR PROCESSES
          </p>

          {/* Section Heading */}
          <h2 className="text-gray-800 text-3xl md:text-4xl lg:text-5xl font-light leading-tight mb-6">
            Affinez votre design
          </h2>

          {/* Section Description */}
          <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto mb-16">
            Our design services starts and ends with a best in class experience 
            strategy that builds brands.
          </p>

          {/* Process Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {designSteps.map((step) => (
              <div key={step.id} className="flex flex-col items-center">
                {/* Circle Icon */}
                <div className="w-24 h-24 bg-orange-400 rounded-full flex items-center justify-center mb-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  {step.icon}
                </div>

                {/* Step Title */}
                <h3 className="text-gray-800 text-lg md:text-xl font-medium text-center leading-tight">
                  {step.title}
                </h3>
              </div>
            ))}
          </div>
        </div>

        {/* Second Process Section - Your Turn */}
        <div className="text-center">
          {/* Section Label */}
          <p className="text-orange-400 text-sm uppercase tracking-wide font-medium mb-6">
            OUR PROCESSES
          </p>

          {/* Section Heading */}
          <h2 className="text-gray-800 text-3xl md:text-4xl lg:text-5xl font-light leading-tight mb-6">
            À vous de jouer
          </h2>

          {/* Section Description */}
          <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto mb-12">
            Our design services starts and ends with a best in class experience 
            strategy that builds brands.
          </p>

          {/* CTA Button */}
          <button className="bg-orange-400 hover:bg-orange-500 text-white px-8 py-4 rounded-full font-medium text-lg transition-colors inline-flex items-center shadow-lg hover:shadow-xl" onClick={() => router.push('/welcome')}>
            Générez des rendus maintenant
            <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;