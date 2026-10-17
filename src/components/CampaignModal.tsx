"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Campaign } from "@/types";
import { formatCurrency, calculateProgress } from "@/lib/utils";
import { X, Heart, MapPin, Calendar, ShieldCheck, ExternalLink } from "lucide-react";
import { ALLOWED_DONATION_AMOUNTS, AllowedDonationAmount, getSunizeCheckoutUrl } from "@/lib/sunize";

interface CampaignModalProps {
  campaign: Campaign | null;
  onClose: () => void;
}

export default function CampaignModal({ campaign, onClose }: CampaignModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<AllowedDonationAmount>(20);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (campaign) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [campaign, onClose]);

  if (!campaign) return null;

  const progress = calculateProgress(campaign.raisedAmount, campaign.targetAmount);
  const remaining = Math.max(0, campaign.targetAmount - campaign.raisedAmount);
  const checkoutUrl = getSunizeCheckoutUrl(selectedAmount) || "";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-campaign-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
    >
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
        aria-hidden="true" 
      />

      <div className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-[#eedece] overflow-hidden z-10 max-h-[92vh] flex flex-col text-[#5A3825]">
        
        {/* Header Bar with Close Button */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#eedece] bg-[#FFF9F0]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-[#eaf4ee] text-[#237A45] px-2.5 py-1 rounded-md border border-[#237A45]/20">
              {campaign.categoryLabel}
            </span>
            <span className="text-xs text-[#5A3825]/70 font-medium">
              ID: {campaign.id} (Fictício)
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#5A3825] hover:text-[#3e2417] hover:bg-[#eedece]/40 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#237A45]"
            aria-label="Fechar detalhes da campanha"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          
          {/* Main Visual & Title */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-5 relative h-64 md:h-full min-h-[220px] rounded-2xl overflow-hidden bg-[#FFF9F0] border border-[#eedece]/60">
              <Image
                src={campaign.imageUrl}
                alt={`Foto de ${campaign.animalName}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 300px"
              />
            </div>

            <div className="md:col-span-7 space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#5A3825]/80">
                <span className="flex items-center gap-1 font-semibold text-[#237A45]">
                  <MapPin className="w-3.5 h-3.5" />
                  {campaign.location}
                </span>
                <span>•</span>
                <span>Idade: {campaign.age}</span>
                <span>•</span>
                <span>{campaign.breed}</span>
              </div>

              <h2 id="modal-campaign-title" className="text-2xl sm:text-3xl font-black text-[#3e2417] tracking-tight leading-snug">
                {campaign.title}
              </h2>

              <p className="text-xs sm:text-sm text-[#5A3825] font-medium bg-[#FFF9F0] p-3 rounded-xl border border-[#eedece]">
                Responsável pelo resgate: <strong className="text-[#3e2417]">{campaign.rescuerName}</strong> ({campaign.rescuerType === "ong" ? "ONG" : "Protetor Independente"}).
              </p>

              {/* Progress Box */}
              <div className="bg-[#FFF9F0] p-4 rounded-2xl border border-[#eedece] space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#eaf4ee] text-[#237A45] border border-[#237A45]/20 text-[11px] font-bold">
                    <span className="w-2 h-2 rounded-full bg-[#237A45] animate-pulse" />
                    <span>Em arrecadação</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-white border border-[#eedece] text-[#5A3825] font-bold text-xs shadow-2xs">
                    <Heart className="w-3.5 h-3.5 text-[#F39A24] fill-current shrink-0" />
                    <span>{campaign.supportersCount} apoiadores</span>
                  </div>
                </div>

                <div className="space-y-0.5">
                  <div className="flex flex-wrap items-baseline gap-1.5">
                    <span className="text-[#3e2417] font-black text-2xl tracking-tight">
                      {formatCurrency(campaign.raisedAmount)}
                    </span>
                    <span className="text-xs font-semibold text-[#5A3825]/75">
                      de {formatCurrency(campaign.targetAmount)}
                    </span>
                  </div>
                </div>

                <div className="w-full bg-[#eedece] rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#F39A24] to-[#237A45] h-3 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs font-medium pt-0.5">
                  <span className="text-[#237A45] font-bold">{progress}% alcançado</span>
                  <span className="text-[#5A3825] font-semibold">Faltam {formatCurrency(remaining)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Full Story */}
          <div className="space-y-3 pt-4 border-t border-[#eedece]">
            <h3 className="text-lg font-bold text-[#3e2417]">História do Animal</h3>
            <p className="text-sm sm:text-base text-[#5A3825] leading-relaxed whitespace-pre-line">
              {campaign.story}
            </p>
          </div>

          {/* Updates Timeline */}
          {campaign.updates.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-[#eedece]">
              <h3 className="text-base font-bold text-[#3e2417] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#237A45]" />
                Diário de Cuidados & Atualizações Médicas
              </h3>
              <div className="space-y-2.5">
                {campaign.updates.map((update, idx) => (
                  <div key={idx} className="bg-[#eaf4ee] border border-[#237A45]/20 rounded-xl p-3.5 text-xs sm:text-sm">
                    <span className="font-bold text-[#237A45] block sm:inline mr-2">
                      {update.date}:
                    </span>
                    <span className="text-[#5A3825]">{update.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sunize Checkout Donation Section */}
          <div className="space-y-4 pt-4 border-t border-[#eedece] bg-[#fef5e9] p-5 sm:p-6 rounded-2xl border border-[#F39A24]/30">
            <div className="flex items-start gap-3">
              <Heart className="w-5 h-5 text-[#F39A24] fill-[#F39A24] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm sm:text-base font-bold text-[#3e2417]">
                  Apoiar esta Campanha
                </h4>
                <p className="text-xs text-[#5A3825] mt-1 leading-relaxed">
                  Escolha um dos valores abaixo para contribuir diretamente com o tratamento de {campaign.animalName}. O pagamento é processado com total segurança no checkout da Sunize via PIX ou cartão.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-[#3e2417]">
                Selecione o valor da sua contribuição:
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {ALLOWED_DONATION_AMOUNTS.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setSelectedAmount(amount)}
                    aria-pressed={selectedAmount === amount}
                    className={`py-2 px-2.5 text-xs sm:text-sm font-bold rounded-xl border transition-all cursor-pointer ${
                      selectedAmount === amount
                        ? "bg-[#F39A24] text-white border-[#F39A24] shadow-sm"
                        : "bg-white text-[#5A3825] border-[#eedece] hover:border-[#F39A24]/60 hover:bg-[#FFF9F0]"
                    }`}
                  >
                    {formatCurrency(amount, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </button>
                ))}
              </div>

              <a
                href={checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-[#237A45] hover:bg-[#1b5f36] active:bg-[#164d2c] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#237A45]"
                aria-label={`Apoiar ${campaign.animalName} com doação de ${formatCurrency(selectedAmount)} no checkout Sunize`}
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>Apoiar com {formatCurrency(selectedAmount)}</span>
                <ExternalLink className="w-4 h-4 ml-1 opacity-90" />
              </a>

              <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-[#5A3825]/80 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-[#237A45] shrink-0" />
                <span>Checkout 100% seguro processado pela Sunize • Redirecionamento direto</span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#eedece] bg-[#FFF9F0] flex items-center justify-between text-xs text-[#5A3825]">
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-[#237A45]" />
            Prestação de contas obrigatória por campanha
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 font-semibold text-[#5A3825] hover:bg-[#eedece]/50 rounded-lg transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
}
