"use client";

import React, { useState } from "react";
import { MOCK_FAQS } from "@/data/mockData";
import { ChevronDown, HelpCircle } from "lucide-react";

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<"todos" | "doador" | "protetor" | "plataforma">("todos");

  const filteredFaqs = MOCK_FAQS.filter((faq) => {
    if (activeCategory === "todos") return true;
    return faq.category === activeCategory;
  });

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section 
      id="faq" 
      aria-label="Perguntas Frequentes"
      className="py-16 sm:py-24 bg-[#FFF9F0] border-t border-[#eedece]"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eaf4ee] border border-[#237A45]/20 text-[#237A45] text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4 text-[#237A45]" />
            <span>Tire Suas Dúvidas</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#3e2417] tracking-tight">
            Perguntas Frequentes
          </h2>
          <p className="text-base text-[#5A3825] font-normal leading-relaxed">
            Entenda como funciona o apoio comunitário, a segurança e a prestação de contas no Patas do Bem.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {[
            { id: "todos", label: "Todas as dúvidas" },
            { id: "doador", label: "Para Doadores" },
            { id: "protetor", label: "Para Protetores & ONGs" },
            { id: "plataforma", label: "Sobre a Plataforma" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id as typeof activeCategory);
                setOpenIndex(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-[#237A45] text-white shadow-xs"
                  : "bg-white text-[#5A3825] hover:bg-[#FFF9F0] border border-[#eedece]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.question}
                className="bg-white rounded-2xl border border-[#eedece] overflow-hidden shadow-xs transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(idx)}
                  aria-expanded={isOpen}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-bold text-[#3e2417] hover:text-[#237A45] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#237A45]"
                >
                  <span className="text-base sm:text-lg">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#5A3825] shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-[#237A45]" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-[#5A3825] leading-relaxed border-t border-[#eedece]/60 animate-in fade-in duration-150">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
