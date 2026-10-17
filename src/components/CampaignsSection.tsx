"use client";

import React, { useState } from "react";
import { Campaign, AnimalSpecies } from "@/types";
import { MOCK_CAMPAIGNS } from "@/data/mockData";
import CampaignCard from "./CampaignCard";
import CampaignModal from "./CampaignModal";
import { Heart, Filter, Sparkles } from "lucide-react";

export default function CampaignsSection() {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [speciesFilter, setSpeciesFilter] = useState<"all" | AnimalSpecies>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filteredCampaigns = MOCK_CAMPAIGNS.filter((c) => {
    if (speciesFilter !== "all" && c.species !== speciesFilter) return false;
    if (categoryFilter !== "all" && c.category !== categoryFilter) return false;
    return true;
  });

  return (
    <section 
      id="campanhas" 
      aria-label="Campanhas de doação em destaque"
      className="py-16 sm:py-24 bg-[#FFF9F0] relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fef5e9] border border-[#F39A24]/30 text-[#F39A24] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#F39A24]" />
              <span>Campanhas em Destaque</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#3e2417] tracking-tight">
              Animais que precisam da sua ajuda agora
            </h2>
            <p className="text-base text-[#5A3825] font-normal leading-relaxed">
              Casos demonstrativos ilustrando como protetores e ONGs poderão publicar pedidos de socorro médico com metas claras e prestação de contas no Patas do Bem.
            </p>
          </div>

          {/* Species Quick Selector */}
          <div className="flex items-center gap-1.5 p-1 bg-[#eedece]/60 border border-[#eedece] rounded-2xl self-start md:self-auto">
            <button
              onClick={() => setSpeciesFilter("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                speciesFilter === "all"
                  ? "bg-[#237A45] text-white shadow-xs"
                  : "text-[#5A3825] hover:text-[#3e2417]"
              }`}
            >
              Todos os pets
            </button>
            <button
              onClick={() => setSpeciesFilter("dog")}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                speciesFilter === "dog"
                  ? "bg-[#237A45] text-white shadow-xs"
                  : "text-[#5A3825] hover:text-[#3e2417]"
              }`}
            >
              🐶 Cães
            </button>
            <button
              onClick={() => setSpeciesFilter("cat")}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                speciesFilter === "cat"
                  ? "bg-[#237A45] text-white shadow-xs"
                  : "text-[#5A3825] hover:text-[#3e2417]"
              }`}
            >
              🐱 Gatos
            </button>
          </div>
        </div>

        {/* Secondary Category Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-2 overflow-x-auto">
          <div className="flex items-center gap-1 text-xs font-bold text-[#5A3825]/75 mr-2">
            <Filter className="w-3.5 h-3.5 text-[#237A45]" />
            <span>Necessidade:</span>
          </div>
          {[
            { id: "all", label: "Todas as necessidades" },
            { id: "surgery", label: "Cirurgias de Emergência" },
            { id: "treatment", label: "Tratamentos Clínicos" },
            { id: "food", label: "Ração & Acolhimento" },
            { id: "emergency", label: "Casos Especiais" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                categoryFilter === cat.id
                  ? "bg-[#237A45] text-white"
                  : "bg-white text-[#5A3825] hover:bg-[#FFF9F0] border border-[#eedece]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Cards Grid */}
        {filteredCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCampaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                onSelect={(camp) => setSelectedCampaign(camp)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#eedece] p-8">
            <Heart className="w-12 h-12 text-[#eedece] mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[#3e2417]">
              Nenhuma campanha encontrada para este filtro.
            </h3>
            <p className="text-sm text-[#5A3825] mt-1">
              Tente selecionar &quot;Todos os pets&quot; ou remover o filtro de categoria.
            </p>
            <button
              onClick={() => {
                setSpeciesFilter("all");
                setCategoryFilter("all");
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-[#FFF9F0] border border-[#eedece] text-[#5A3825] text-xs font-bold hover:bg-[#eedece]/40 transition-colors cursor-pointer"
            >
              Limpar Filtros
            </button>
          </div>
        )}

      </div>

      {/* Campaign Details Modal */}
      <CampaignModal
        campaign={selectedCampaign}
        onClose={() => setSelectedCampaign(null)}
      />
    </section>
  );
}
