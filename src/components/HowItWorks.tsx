import React from "react";
import { Search, HeartHandshake, FileCheck2, ArrowRight } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Escolha uma história real",
      description:
        "Navegue pelas campanhas ativas, conheça a história de cada animal, a urgência médica e o protetor independente ou ONG responsável pelo resgate.",
      icon: <Search className="w-6 h-6 text-[#237A45]" />,
    },
    {
      step: "02",
      title: "Contribua com qualquer valor",
      description:
        "Cada real faz a diferença para comprar medicamentos ou ração. Na versão final, as doações serão processadas instantaneamente via PIX direto e seguro.",
      icon: <HeartHandshake className="w-6 h-6 text-[#F39A24]" />,
    },
    {
      step: "03",
      title: "Acompanhe a prestação de contas",
      description:
        "Receba fotos da evolução do animal, laudos veterinários e as notas fiscais dos serviços prestados. Transparência de ponta a ponta sem segredos.",
      icon: <FileCheck2 className="w-6 h-6 text-[#237A45]" />,
    },
  ];

  return (
    <section 
      id="como-funciona" 
      aria-label="Como funciona o processo de doação"
      className="py-16 sm:py-24 bg-[#FFF9F0] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#237A45] bg-[#eaf4ee] px-3 py-1 rounded-full border border-[#237A45]/20">
            Passo a Passo
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#3e2417] tracking-tight">
            Como funciona a doação no Patas do Bem?
          </h2>
          <p className="text-base sm:text-lg text-[#5A3825] font-normal leading-relaxed">
            Eliminamos a incerteza e aproximamos quem quer doar de quem está na linha de frente salvando vidas.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, idx) => (
            <div
              key={item.step}
              className="bg-white rounded-3xl p-8 border border-[#eedece] shadow-sm hover:shadow-md hover:border-[#237A45]/40 transition-all duration-200 flex flex-col justify-between relative group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFF9F0] border border-[#eedece] flex items-center justify-center group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <span className="text-3xl font-black text-[#eedece] group-hover:text-[#F39A24]/50 transition-colors">
                    {item.step}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#3e2417] mb-3">
                  {item.title}
                </h3>

                <p className="text-sm text-[#5A3825] leading-relaxed">
                  {item.description}
                </p>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden md:flex items-center gap-1 text-xs font-bold text-[#5A3825]/60 pt-6 mt-6 border-t border-[#eedece]/60">
                  <span>Próximo passo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
