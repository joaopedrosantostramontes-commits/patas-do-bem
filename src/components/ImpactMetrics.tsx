import React from "react";
import { MOCK_METRICS } from "@/data/mockData";
import { Info, HeartHandshake, Stethoscope, Users, CheckCircle2 } from "lucide-react";

export default function ImpactMetrics() {
  const icons = [
    <HeartHandshake key="1" className="w-6 h-6 text-[#237A45]" />,
    <Stethoscope key="2" className="w-6 h-6 text-[#F39A24]" />,
    <Users key="3" className="w-6 h-6 text-[#237A45]" />,
    <CheckCircle2 key="4" className="w-6 h-6 text-[#F39A24]" />,
  ];

  return (
    <section 
      aria-label="Indicadores de impacto"
      className="py-12 bg-white border-y border-[#eedece]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Notice Header for Metrics */}
        <div className="flex flex-col sm:row items-center justify-between gap-2 mb-8 text-center sm:text-left">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#3e2417] tracking-tight">
              Nosso Impacto Esperado
            </h2>
            <p className="text-sm text-[#5A3825] font-medium">
              Metas e indicadores de capacidade projetados para a plataforma Patas do Bem.
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fef5e9] border border-[#F39A24]/30 text-[#F39A24] text-xs font-semibold">
            <Info className="w-3.5 h-3.5 text-[#F39A24]" />
            <span>Dados demonstrativos de teste</span>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {MOCK_METRICS.map((metric, index) => (
            <div
              key={metric.label}
              className="bg-[#FFF9F0] rounded-2xl p-5 sm:p-6 border border-[#eedece] hover:border-[#237A45]/40 hover:shadow-md transition-all duration-200 group"
            >
              <div className="w-12 h-12 rounded-xl bg-white shadow-xs border border-[#eedece] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                {icons[index % icons.length]}
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#3e2417] tracking-tight">
                {metric.value}
              </div>
              <div className="text-sm font-bold text-[#5A3825] mt-1">
                {metric.label}
              </div>
              <div className="text-xs text-[#5A3825]/75 mt-1">
                {metric.description}
              </div>
              <div className="mt-3 pt-3 border-t border-[#eedece] flex items-center justify-between text-[10px] text-[#F39A24] font-medium uppercase tracking-wider">
                <span>Fictício</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#F39A24]" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
