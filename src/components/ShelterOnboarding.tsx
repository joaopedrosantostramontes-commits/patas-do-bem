"use client";

import React from "react";
import { ShieldCheck, HeartHandshake, UploadCloud, CheckCircle } from "lucide-react";

interface ShelterOnboardingProps {
  onOpenOnboarding: () => void;
}

export default function ShelterOnboarding({ onOpenOnboarding }: ShelterOnboardingProps) {
  const benefits = [
    {
      icon: <HeartHandshake className="w-5 h-5 text-[#F39A24]" />,
      title: "Espaço para Protetores Independentes",
      description:
        "Sabemos que grande parte dos resgates é feita por pessoas físicas sem CNPJ. Criamos um fluxo de validação humana e ética para apoiar quem realmente está no chão.",
    },
    {
      icon: <UploadCloud className="w-5 h-5 text-[#F39A24]" />,
      title: "Prestação de Contas Simplificada",
      description:
        "Envie fotos do animal e notas fiscais diretamente pelo celular. Doadores confiantes apoiam mais quando veem o resultado transparente na prática.",
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-[#F39A24]" />,
      title: "Sem Mensalidades ou Barreiras",
      description:
        "O cadastro e o envio de campanhas para validação são 100% gratuitos. Nosso objetivo comum é aliviar a sobrecarga de quem resgata.",
    },
  ];

  return (
    <section 
      id="para-protetores" 
      aria-label="Espaço para protetores e ONGs"
      className="py-16 sm:py-24 bg-gradient-to-br from-[#1b5f36] via-[#237A45] to-[#164627] text-white relative overflow-hidden"
    >
      {/* Decorative subtle patterns */}
      <div 
        aria-hidden="true" 
        className="absolute -top-24 -right-24 w-96 h-96 bg-[#237A45]/20 rounded-full blur-3xl pointer-events-none"
      />
      <div 
        aria-hidden="true" 
        className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#F39A24]/15 rounded-full blur-3xl pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading and Motivation */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#164627]/80 border border-[#237A45]/40 text-[#eaf4ee] text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#F39A24]" />
              <span>Rede de Proteção & Acolhimento</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Você resgata e cuida. Nós ajudamos a financiar a cura.
            </h2>

            <p className="text-base sm:text-lg text-emerald-50/90 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Muitos protetores se endividam em clínicas veterinárias para não deixar um animal sofrendo. O Patas do Bem nasce para ser o braço financeiro e comunitário de quem dedica a vida a essa causa.
            </p>

            <div className="pt-2">
              <button
                onClick={onOpenOnboarding}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[#F39A24] hover:bg-[#e08915] active:bg-[#c97510] text-[#3e2417] font-black text-base shadow-lg shadow-[#F39A24]/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-3 focus-visible:ring-[#F39A24]"
              >
                <ShieldCheck className="w-5 h-5 text-[#3e2417]" />
                <span>Solicitar Cadastro de Protetor / ONG</span>
              </button>
            </div>
          </div>

          {/* Right Column: Benefit Cards */}
          <div className="lg:col-span-5 space-y-4">
            {benefits.map((item, idx) => (
              <div
                key={idx}
                className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 hover:bg-white/15 transition-colors space-y-2 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#164627] border border-[#237A45]/40 flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-white text-base">
                    {item.title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-emerald-50/80 leading-relaxed pl-12">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
