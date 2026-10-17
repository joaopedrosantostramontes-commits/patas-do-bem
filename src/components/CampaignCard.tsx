"use client";

import React from "react";
import Image from "next/image";
import { Campaign } from "@/types";
import { formatCurrency, calculateProgress } from "@/lib/utils";
import { MapPin, Heart, ArrowRight } from "lucide-react";

interface CampaignCardProps {
  campaign: Campaign;
  onSelect: (campaign: Campaign) => void;
}

export default function CampaignCard({ campaign, onSelect }: CampaignCardProps) {
  const progress = calculateProgress(campaign.raisedAmount, campaign.targetAmount);

  return (
    <article className="bg-white rounded-3xl overflow-hidden border border-[#eedece] shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-[#237A45]/30 transition-all duration-300 flex flex-col h-full group focus-within:ring-2 focus-within:ring-[#237A45]">
      
      {/* Animal Photo with Badges */}
      <div className="relative h-56 w-full overflow-hidden bg-[#FFF9F0]">
        <Image
          src={campaign.imageUrl}
          alt={`Foto de ${campaign.animalName}, ${campaign.breed}`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/95 text-[#5A3825] shadow-sm backdrop-blur-xs">
            {campaign.categoryLabel}
          </span>
          {campaign.urgency === "high" && (
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-rose-600 text-white shadow-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              Urgente
            </span>
          )}
        </div>

        {/* Animal Details Overlay */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black tracking-tight drop-shadow-xs">
              {campaign.animalName}
            </h3>
            <span className="text-xs font-medium text-stone-200 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-xs">
              {campaign.age}
            </span>
          </div>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        
        <div className="space-y-3">
          {/* Location and Rescuer Meta */}
          <div className="flex flex-wrap items-center justify-between text-xs text-[#5A3825]/80 font-medium gap-2">
            <span className="flex items-center gap-1 text-[#5A3825]">
              <MapPin className="w-3.5 h-3.5 text-[#237A45] shrink-0" />
              {campaign.location}
            </span>
            <span className="bg-[#eaf4ee] text-[#237A45] border border-[#237A45]/20 px-2 py-0.5 rounded-md font-semibold text-[11px]">
              {campaign.rescuerType === "ong" ? "ONG Parceira" : "Protetor Independente"}
            </span>
          </div>

          {/* Campaign Title & Summary */}
          <div>
            <h4 className="text-base font-bold text-[#3e2417] group-hover:text-[#237A45] transition-colors line-clamp-1">
              {campaign.title}
            </h4>
            <p className="mt-1.5 text-sm text-[#5A3825] line-clamp-2 leading-relaxed">
              {campaign.summary}
            </p>
          </div>
        </div>

        {/* Progress & Financial Information Section */}
        <div className="space-y-3 pt-3 border-t border-[#eedece]/60">
          
          {/* Status Indicator & Progress Percentage */}
          <div className="flex items-center justify-between text-xs gap-2">
            <span className="inline-flex items-center gap-1.5 font-bold text-[#237A45] bg-[#eaf4ee] px-2.5 py-0.5 rounded-full border border-[#237A45]/20 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-[#237A45] animate-pulse" />
              Em arrecadação
            </span>
            <span className="font-extrabold text-[#237A45] text-xs">
              {progress}% alcançado
            </span>
          </div>

          {/* Highlighted Raised Amount & Target */}
          <div className="space-y-0.5">
            <div className="flex flex-wrap items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-[#3e2417] tracking-tight">
                {formatCurrency(campaign.raisedAmount)}
              </span>
              <span className="text-xs font-semibold text-[#5A3825]/75">
                de {formatCurrency(campaign.targetAmount)}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-[#eedece]/60 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#F39A24] to-[#237A45] h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Progresso da campanha: ${progress}%`}
            />
          </div>

          {/* Independent Supporters Section with Heart Icon & Meta */}
          <div className="flex items-center justify-between pt-0.5 text-xs">
            <span className="text-[11px] font-medium text-[#5A3825]/70">
              Meta: {formatCurrency(campaign.targetAmount)}
            </span>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FFF9F0] border border-[#eedece] text-[#5A3825] font-bold text-xs shadow-2xs">
              <Heart className="w-3.5 h-3.5 text-[#F39A24] fill-current shrink-0" />
              <span>{campaign.supportersCount} apoiadores</span>
            </div>
          </div>

        </div>

        {/* Card CTA */}
        <div className="pt-2">
          <button
            onClick={() => onSelect(campaign)}
            className="w-full py-3 px-4 rounded-xl bg-[#FFF9F0] border border-[#eedece] hover:bg-[#237A45] hover:text-white hover:border-[#237A45] text-[#5A3825] font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#237A45]"
          >
            <Heart className="w-4 h-4 fill-current opacity-80" />
            <span>Ver Campanha</span>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </button>
        </div>

      </div>
    </article>
  );
}
