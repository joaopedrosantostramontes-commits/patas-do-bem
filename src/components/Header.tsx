"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Heart, Menu, X, ShieldCheck } from "lucide-react";

interface HeaderProps {
  onOpenOnboarding: () => void;
}

export default function Header({ onOpenOnboarding }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Campanhas", href: "#campanhas" },
    { label: "Como Funciona", href: "#como-funciona" },
    { label: "Protetores & ONGs", href: "#para-protetores" },
    { label: "Transparência", href: "#transparencia" },
    { label: "Dúvidas", href: "#faq" },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFF9F0]/95 backdrop-blur-md border-b border-[#eedece] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo with official image */}
          <a
            href="#"
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#237A45] rounded-xl px-1 py-0.5"
            aria-label="Patas do Bem - Juntos por mais vidas"
          >
            <div className="relative h-12 w-12 sm:h-14 sm:w-14 shrink-0 transition-transform duration-200 group-hover:scale-105">
              <Image
                src="/images/logo-patas-do-bem.png"
                alt="Logo Patas do Bem"
                width={56}
                height={56}
                priority
                className="h-full w-full object-contain rounded-xl drop-shadow-xs"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-[#5A3825] leading-tight">
                Patas do <span className="text-[#F39A24]">Bem</span>
              </span>
              <span className="text-xs text-[#237A45] font-semibold tracking-wide">
                Juntos por mais vidas
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="px-3.5 py-2 text-sm font-semibold text-[#5A3825] hover:text-[#237A45] hover:bg-[#f5ece0]/70 rounded-xl transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#237A45]"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Header Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onOpenOnboarding}
              className="text-xs lg:text-sm font-bold text-[#5A3825] hover:text-[#237A45] px-3.5 py-2 rounded-xl hover:bg-[#f5ece0]/70 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#237A45] flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-[#237A45]" />
              Sou Protetor / ONG
            </button>
            <button
              onClick={() => handleNavClick("#campanhas")}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#F39A24] hover:bg-[#dc8416] active:bg-[#c9750d] text-[#3e2417] font-bold text-sm shadow-sm shadow-[#F39A24]/30 hover:shadow-md transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F39A24] focus-visible:ring-offset-2"
            >
              <Heart className="w-4 h-4 fill-[#3e2417]" />
              <span>Quero Ajudar</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => handleNavClick("#campanhas")}
              className="px-3 py-1.5 rounded-lg bg-[#F39A24] text-[#3e2417] font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Heart className="w-3.5 h-3.5 fill-[#3e2417]" />
              Ajudar
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-[#5A3825] hover:bg-[#f5ece0] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#237A45] cursor-pointer"
              aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#eedece] animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="w-full text-left px-4 py-2.5 text-base font-semibold text-[#5A3825] hover:text-[#237A45] hover:bg-[#f5ece0]/80 rounded-xl transition-colors cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
              <div className="pt-3 border-t border-[#eedece] mt-2 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenOnboarding();
                  }}
                  className="w-full text-left px-4 py-2.5 text-base font-bold text-[#237A45] hover:bg-[#eaf4ee] rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-5 h-5 text-[#237A45]" />
                  Cadastrar Protetor / ONG
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
