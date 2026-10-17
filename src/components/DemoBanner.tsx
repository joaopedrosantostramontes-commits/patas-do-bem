import React from "react";
import { AlertCircle } from "lucide-react";
import { DEMO_NOTICE } from "@/data/mockData";

export default function DemoBanner() {
  return (
    <aside 
      aria-label="Aviso de ambiente de demonstração" 
      className="bg-[#fef5e9] border-b border-[#F39A24]/30 text-[#5A3825] px-4 py-2 text-xs sm:text-sm font-medium"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-[#F39A24] shrink-0" aria-hidden="true" />
          <span>
            <strong className="font-bold text-[#3e2417]">{DEMO_NOTICE.badgeText}:</strong>{" "}
            <span className="hidden sm:inline">{DEMO_NOTICE.disclaimer}</span>
            <span className="sm:hidden">Dados fictícios para validação de interface.</span>
          </span>
        </div>
        <span className="text-[11px] uppercase tracking-wider bg-[#F39A24]/15 text-[#5A3825] border border-[#F39A24]/30 px-2 py-0.5 rounded font-bold shrink-0">
          Demonstração
        </span>
      </div>
    </aside>
  );
}
