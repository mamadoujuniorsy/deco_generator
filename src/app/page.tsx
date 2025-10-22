import React from 'react'
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import ProcessSection from "@/components/ProcessSection";
import "@/app/home.css";


export default function Page() {
  return (
    <>
     <HeroSection />
      <ServicesSection />
      <ProcessSection />
    </>
  )
}
