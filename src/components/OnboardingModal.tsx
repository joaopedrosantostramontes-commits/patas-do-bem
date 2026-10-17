"use client";

import React, { useState, useEffect } from "react";
import { X, ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    rescuerType: "independent",
    name: "",
    cityState: "",
    animalCount: "10-30",
    message: "",
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      rescuerType: "independent",
      name: "",
      cityState: "",
      animalCount: "10-30",
      message: "",
    });
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
    >
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
        aria-hidden="true" 
      />

      <div className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-[#eedece] overflow-hidden z-10 max-h-[92vh] flex flex-col text-[#5A3825]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#eedece] bg-[#FFF9F0]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#237A45]" />
            <h2 id="onboarding-modal-title" className="text-base sm:text-lg font-bold text-[#3e2417]">
              Pré-Cadastro de Protetor ou ONG
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#5A3825] hover:text-[#3e2417] hover:bg-[#eedece]/40 transition-colors cursor-pointer"
            aria-label="Fechar formulário de pré-cadastro"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          
          {/* Privacy Disclaimer Notice */}
          <div className="bg-[#fef5e9] border border-[#F39A24]/30 rounded-2xl p-4 flex items-start gap-3 text-xs text-[#5A3825]">
            <AlertCircle className="w-5 h-5 text-[#F39A24] shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-[#3e2417] block">Aviso de Privacidade & Demonstração:</strong>
              Este formulário é uma prévia da interface do Patas do Bem. Por segurança, <strong>não insira dados pessoais reais</strong> (como CPF, RG ou senhas). Nenhum dado será salvo em banco de dados nesta etapa.
            </div>
          </div>

          {submitted ? (
            <div className="text-center py-8 space-y-4 animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-[#eaf4ee] text-[#237A45] flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-xl font-bold text-[#3e2417]">
                Manifestação Simulada com Sucesso!
              </h3>
              <p className="text-sm text-[#5A3825] max-w-md mx-auto leading-relaxed">
                A simulação do fluxo de interesse foi validada na interface. Quando o backend e o Supabase estiverem ativos, seu cadastro passará pelo processo de verificação documental e checagem de idoneidade.
              </p>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-2.5 rounded-xl bg-[#237A45] hover:bg-[#1b5f36] text-white font-bold text-sm cursor-pointer transition-colors"
                >
                  Concluir e Fechar
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Type Selection */}
              <div>
                <label className="block text-xs font-bold text-[#3e2417] mb-1.5">
                  Tipo de Atuação
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`flex items-center gap-2 p-3 rounded-xl border text-xs sm:text-sm font-semibold cursor-pointer transition-colors ${
                    formData.rescuerType === "independent"
                      ? "border-[#237A45] bg-[#eaf4ee] text-[#1b5f36]"
                      : "border-[#eedece] hover:bg-[#FFF9F0] text-[#5A3825]"
                  }`}>
                    <input
                      type="radio"
                      name="rescuerType"
                      value="independent"
                      checked={formData.rescuerType === "independent"}
                      onChange={() => setFormData({ ...formData, rescuerType: "independent" })}
                      className="text-[#237A45] focus:ring-[#237A45]"
                    />
                    <span>Protetor Independente</span>
                  </label>

                  <label className={`flex items-center gap-2 p-3 rounded-xl border text-xs sm:text-sm font-semibold cursor-pointer transition-colors ${
                    formData.rescuerType === "ong"
                      ? "border-[#237A45] bg-[#eaf4ee] text-[#1b5f36]"
                      : "border-[#eedece] hover:bg-[#FFF9F0] text-[#5A3825]"
                  }`}>
                    <input
                      type="radio"
                      name="rescuerType"
                      value="ong"
                      checked={formData.rescuerType === "ong"}
                      onChange={() => setFormData({ ...formData, rescuerType: "ong" })}
                      className="text-[#237A45] focus:ring-[#237A45]"
                    />
                    <span>ONG / Abrigo Coletivo</span>
                  </label>
                </div>
              </div>

              {/* Name (Simulated) */}
              <div>
                <label htmlFor="name-input" className="block text-xs font-bold text-[#3e2417] mb-1">
                  Nome do Protetor ou da ONG (Exemplo Fictício)
                </label>
                <input
                  id="name-input"
                  type="text"
                  placeholder="Ex: Associação Patinhas do Sul (Fictício)"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#eedece] focus:outline-none focus:ring-2 focus:ring-[#237A45] text-sm text-[#3e2417] bg-[#FFF9F0]/50"
                  required
                />
              </div>

              {/* City & State */}
              <div>
                <label htmlFor="location-input" className="block text-xs font-bold text-[#3e2417] mb-1">
                  Cidade e Estado de Atuação
                </label>
                <input
                  id="location-input"
                  type="text"
                  placeholder="Ex: Curitiba, PR"
                  value={formData.cityState}
                  onChange={(e) => setFormData({ ...formData, cityState: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#eedece] focus:outline-none focus:ring-2 focus:ring-[#237A45] text-sm text-[#3e2417] bg-[#FFF9F0]/50"
                  required
                />
              </div>

              {/* Animals Count */}
              <div>
                <label htmlFor="count-select" className="block text-xs font-bold text-[#3e2417] mb-1">
                  Quantos animais estão sob seus cuidados atualmente?
                </label>
                <select
                  id="count-select"
                  value={formData.animalCount}
                  onChange={(e) => setFormData({ ...formData, animalCount: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#eedece] focus:outline-none focus:ring-2 focus:ring-[#237A45] text-sm text-[#3e2417] bg-[#FFF9F0]/50"
                >
                  <option value="1-5">Até 5 animais</option>
                  <option value="5-20">De 5 a 20 animais</option>
                  <option value="20-50">De 20 a 50 animais</option>
                  <option value="50+">Mais de 50 animais</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message-input" className="block text-xs font-bold text-[#3e2417] mb-1">
                  Breve resumo da sua atuação e necessidades principais
                </label>
                <textarea
                  id="message-input"
                  rows={3}
                  placeholder="Ex: Realizamos resgates em casos de atropelamento e precisamos de apoio para cirurgias e ração..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-[#eedece] focus:outline-none focus:ring-2 focus:ring-[#237A45] text-sm text-[#3e2417] bg-[#FFF9F0]/50"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-[#237A45] hover:bg-[#1b5f36] active:bg-[#164627] text-white font-bold text-sm shadow-sm transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#237A45]"
                >
                  Enviar Manifestação Demonstrativa
                </button>
              </div>

            </form>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#eedece] bg-[#FFF9F0] flex justify-end text-xs text-[#5A3825]">
          <button
            onClick={onClose}
            className="px-3 py-1.5 font-semibold text-[#5A3825] hover:bg-[#eedece]/40 rounded-lg transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
}
