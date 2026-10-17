import React from "react";
import { ShieldCheck, Receipt, Eye, AlertOctagon, Scale } from "lucide-react";

export default function TransparencySection() {
  const pillars = [
    {
      icon: <Receipt className="w-6 h-6 text-[#237A45]" />,
      title: "Notas Fiscais e Recibos Públicos",
      description:
        "Toda campanha exige a anexação de comprovantes fiscais emitidos por clínicas veterinárias credenciadas, com CRMV e CNPJ visíveis aos doadores.",
    },
    {
      icon: <Eye className="w-6 h-6 text-[#237A45]" />,
      title: "Diário de Evolução do Animal",
      description:
        "Os protetores são estimulados e cobrados a atualizar a comunidade com fotos, vídeos e laudos de recuperação ao longo de todo o tratamento.",
    },
    {
      icon: <Scale className="w-6 h-6 text-[#237A45]" />,
      title: "Repasse Condicionado à Necessidade",
      description:
        "Metas fechadas e estipuladas com base em orçamentos prévios. Se o tratamento custar menos que a meta, o excedente é realocado com autorização para outro caso urgente.",
    },
    {
      icon: <AlertOctagon className="w-6 h-6 text-[#F39A24]" />,
      title: "Canal Aberto de Denúncias",
      description:
        "Qualquer usuário ou voluntário local pode acionar o comitê de moderação caso haja suspeita de maus-tratos, fotos reaproveitadas ou irregularidades.",
    },
  ];

  return (
    <section 
      id="transparencia" 
      aria-label="Área de transparência e prestação de contas"
      className="py-16 sm:py-24 bg-white border-t border-[#eedece]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eaf4ee] border border-[#237A45]/20 text-[#237A45] text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-[#237A45]" />
            <span>Nossos Pilares de Confiabilidade</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#3e2417] tracking-tight">
            Transparência que gera confiança e salva vidas
          </h2>
          <p className="text-base sm:text-lg text-[#5A3825] font-normal leading-relaxed">
            A causa animal depende da credibilidade. No Patas do Bem, estruturamos regras claras para que você doe com a certeza de que a ajuda chega a quem realmente precisa.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="bg-[#FFF9F0] rounded-3xl p-6 border border-[#eedece] hover:border-[#237A45]/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-[#eedece] flex items-center justify-center mb-5">
                  {pillar.icon}
                </div>
                <h3 className="text-lg font-bold text-[#3e2417] mb-2">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#5A3825] leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Ethical Box Disclaimer */}
        <div className="mt-12 bg-[#fef5e9] border border-[#F39A24]/30 rounded-2xl p-5 text-center max-w-4xl mx-auto text-xs sm:text-sm text-[#5A3825]">
          <p className="leading-relaxed">
            <strong className="text-[#3e2417]">Aviso de Escopo:</strong> Durante o desenvolvimento desta etapa de interface visual do Patas do Bem, nenhum cadastro foi homologado juridicamente e nenhum dinheiro real está sendo arrecadado. Os processos acima compõem as diretrizes operacionais que serão implementadas nas próximas etapas.
          </p>
        </div>

      </div>
    </section>
  );
}
