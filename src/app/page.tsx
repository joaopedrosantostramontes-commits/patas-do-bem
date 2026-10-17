"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ImpactMetrics from "@/components/ImpactMetrics";
import CampaignsSection from "@/components/CampaignsSection";
import HowItWorks from "@/components/HowItWorks";
import ShelterOnboarding from "@/components/ShelterOnboarding";
import TransparencySection from "@/components/TransparencySection";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";
import OnboardingModal from "@/components/OnboardingModal";

export default function Home() {
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);

  const handleOpenOnboarding = () => {
    setIsOnboardingModalOpen(true);
  };

  const handleCloseOnboarding = () => {
    setIsOnboardingModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] selection:bg-amber-200 selection:text-amber-950">
      {/* 1. Responsive Header with Navigation */}
      <Header onOpenOnboarding={handleOpenOnboarding} />

      {/* 3. Main Landing Page Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero onOpenOnboarding={handleOpenOnboarding} />

        {/* Demonstrative Impact Indicators */}
        <ImpactMetrics />

        {/* Featured Campaigns Grid with Details Modal */}
        <CampaignsSection />

        {/* How It Works (Transparent Steps) */}
        <HowItWorks />

        {/* Rescuers & ONGs Onboarding Call */}
        <ShelterOnboarding onOpenOnboarding={handleOpenOnboarding} />

        {/* Transparency & Ethical Accountability */}
        <TransparencySection />

        {/* Frequently Asked Questions */}
        <FaqSection />
      </main>

      {/* 4. Complete Institutional Footer */}
      <Footer />

      {/* 5. Demonstrative Rescuer / NGO Pre-registration Modal */}
      <OnboardingModal
        isOpen={isOnboardingModalOpen}
        onClose={handleCloseOnboarding}
      />
    </div>
  );
}
