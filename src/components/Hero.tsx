"use client";

import React from "react";
import Image from "next/image";
import { Heart, ArrowDown, ShieldCheck, ReceiptText, Sparkles } from "lucide-react";

interface HeroProps {
  onOpenOnboarding: () => void;
}

export default function Hero({ onOpenOnboarding }: HeroProps) {
  const scrollToCampaigns = () => {
    const el = document.getElementById("campanhas");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24 bg-gradient-to-b from-[#FFF9F0] via-[#F9F0E2] to-[#FFF9F0]">
      {/* Decorative background glow */}
      <div 
        aria-hidden="true" 
        className="absolute top-0 right-1/4 -translate-y-1/2 w-96 h-96 bg-[#F39A24]/15 rounded-full blur-3xl pointer-events-none"
      />
      <div 
        aria-hidden="true" 
        className="absolute bottom-0 left-10 translate-y-1/3 w-80 h-80 bg-[#237A45]/15 rounded-full blur-3xl pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Emotional Copy & CTAs */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#eaf4ee] border border-[#237A45]/30 text-[#237A45] text-xs sm:text-sm font-bold tracking-wide shadow-xs">
              <Sparkles className="w-4 h-4 text-[#F39A24] shrink-0" />
              <span>Patas do Bem — Juntos por mais vidas</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#3e2417] leading-[1.14]">
              Conectando corações a quem{" "}
              <span className="text-[#237A45] underline decoration-[#F39A24] decoration-wavy decoration-3">
                só sabe amar
              </span>{" "}
              e precisa de um recomeço.
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-[#5A3825] font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Apoiamos protetores independentes e pequenas ONGs a custear cirurgias,
              tratamentos de emergência e alimentação para animais resgatados. Com
              prestação de contas aberta e acompanhamento de cada centavo.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={scrollToCampaigns}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-[#F39A24] hover:bg-[#dc8416] active:bg-[#c9750d] text-[#3e2417] font-bold text-base shadow-md shadow-[#F39A24]/25 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-3 focus-visible:ring-[#F39A24]"
              >
                <Heart className="w-5 h-5 fill-[#3e2417]" />
                <span>Conhecer Campanhas</span>
                <ArrowDown className="w-4 h-4 text-[#3e2417] animate-bounce" />
              </button>

              <button
                onClick={onOpenOnboarding}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white hover:bg-[#FFF9F0] border-2 border-[#237A45] text-[#237A45] font-bold text-base shadow-xs hover:shadow transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#237A45]"
              >
                <ShieldCheck className="w-5 h-5 text-[#237A45]" />
                <span>Cadastrar como Protetor / ONG</span>
              </button>
            </div>

            {/* Value Highlights */}
            <div className="pt-4 border-t border-[#eedece] grid grid-cols-1 sm:grid-cols-3 gap-4 text-[#5A3825] text-xs sm:text-sm font-semibold">
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <ReceiptText className="w-4 h-4 text-[#237A45] shrink-0" />
                <span>Prestação de contas com notas</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#237A45] shrink-0" />
                <span>Casos checados na moderação</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <Heart className="w-4 h-4 text-[#F39A24] shrink-0" />
                <span>Foco em protetores independentes</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual with Real Story Card Preview */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Image Frame */}
              <div className="relative h-[380px] sm:h-[460px] w-full rounded-3xl overflow-hidden shadow-2xl shadow-[#5A3825]/15 border-4 border-white">
                <Image
                  src="/images/hero/hero-voluntaria-abrigo.jpg"
                  alt="Voluntária acolhendo cão resgatado em abrigo animal"
                  fill
                  priority
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 500px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#29170e]/80 via-[#29170e]/20 to-transparent" />
                
                {/* Overlay Text Inside Image */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[11px] font-bold uppercase tracking-wider bg-[#237A45]/95 backdrop-blur-md px-2.5 py-1 rounded-md">
                    Caso Demonstrativo
                  </span>
                  <p className="mt-2 text-sm font-medium text-stone-100 line-clamp-2">
                    &quot;Cada vida resgatada merece o mesmo respeito e chance de viver sem dor que daríamos a um amigo da família.&quot;
                  </p>
                </div>
              </div>

              {/* Floating Highlight Card */}
              <div className="absolute -bottom-6 -left-3 sm:-left-8 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-[#eedece] w-[calc(100%-1.5rem)] max-w-[310px] sm:max-w-[330px] space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#eaf4ee] text-[#237A45] border border-[#237A45]/20 text-[11px] font-bold">
                    <span className="w-2 h-2 rounded-full bg-[#237A45] animate-pulse" />
                    <span>Em arrecadação</span>
                  </div>
                  <span className="text-xs font-bold text-[#F39A24]">77% atingido</span>
                </div>

                <div className="text-sm font-bold text-[#3e2417] leading-snug">
                  Pipoca precisa de cirurgia
                </div>

                {/* Values: Arrecadado em destaque & Meta separada */}
                <div className="flex flex-wrap items-baseline gap-1.5 pt-0.5">
                  <span className="text-lg font-black text-[#3e2417]">
                    R$ 2.450,00
                  </span>
                  <span className="text-xs font-medium text-[#5A3825]/75">
                    de R$ 3.200,00
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-[#FFF9F0] rounded-full h-2.5 overflow-hidden border border-[#eedece]">
                  <div className="bg-gradient-to-r from-[#F39A24] to-[#237A45] h-2.5 rounded-full w-[77%]" />
                </div>

                {/* Independent Supporters Section with Heart Icon */}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-[#eedece]/40">
                  <span className="text-[11px] font-semibold text-[#237A45]">
                    Meta solidária
                  </span>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-[#FFF9F0] border border-[#eedece] text-[#5A3825] font-bold text-xs shadow-2xs">
                    <Heart className="w-3.5 h-3.5 text-[#F39A24] fill-current shrink-0" />
                    <span>42 apoiadores</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
