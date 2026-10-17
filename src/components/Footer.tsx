import React from "react";
import Image from "next/image";
import { Mail, MapPin, ShieldCheck, HeartHandshake } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#382115] text-[#f7eedf] pt-16 pb-12 border-t border-[#4f2f1e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#523321]">
          
          {/* Brand & Vision */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="relative h-14 w-14 shrink-0 bg-[#FFF9F0] rounded-2xl p-1 shadow-md">
                <Image
                  src="/images/logo-patas-do-bem.png"
                  alt="Patas do Bem"
                  width={56}
                  height={56}
                  className="h-full w-full object-contain rounded-xl"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-2xl text-white tracking-tight leading-tight">
                  Patas do <span className="text-[#F39A24]">Bem</span>
                </span>
                <span className="text-xs text-[#6ee7a0] font-semibold tracking-wide">
                  Juntos por mais vidas
                </span>
              </div>
            </div>

            <p className="text-sm text-[#d4c1b0] leading-relaxed max-w-sm">
              Conectando quem quer ajudar com quem dedica os dias a acolher animais vulneráveis. Transparência médica, ética e repasse rastreável.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-[#d4c1b0]">
              <MapPin className="w-4 h-4 text-[#F39A24] shrink-0" />
              <span>Iniciativa brasileira solidária de apoio à causa animal</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Navegação
            </h3>
            <ul className="space-y-2 text-sm text-[#d4c1b0]">
              <li>
                <a href="#campanhas" className="hover:text-[#F39A24] transition-colors">
                  Campanhas Ativas
                </a>
              </li>
              <li>
                <a href="#como-funciona" className="hover:text-[#F39A24] transition-colors">
                  Como Funciona o Repasse
                </a>
              </li>
              <li>
                <a href="#para-protetores" className="hover:text-[#F39A24] transition-colors">
                  Para Protetores & ONGs
                </a>
              </li>
              <li>
                <a href="#transparencia" className="hover:text-[#F39A24] transition-colors">
                  Pilares de Transparência
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#F39A24] transition-colors">
                  Perguntas Frequentes
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Transparency */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Contato Institucional
            </h3>
            <p className="text-xs text-[#d4c1b0] leading-relaxed">
              Dúvidas, parcerias com clínicas veterinárias ou sugestões para a plataforma:
            </p>
            <div className="bg-[#29170e] p-3.5 rounded-xl border border-[#4d2c1c] space-y-2 text-xs">
              <div className="flex items-center gap-2 text-white">
                <Mail className="w-4 h-4 text-[#6ee7a0] shrink-0" />
                <span className="font-mono">contato@patasdobem.org.br</span>
              </div>
              <div className="flex items-center gap-2 text-[#F39A24] text-[11px] font-medium">
                <HeartHandshake className="w-4 h-4 shrink-0" />
                <span>Canal direto com a comunidade</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2 text-xs text-[#d4c1b0]">
              <ShieldCheck className="w-4 h-4 text-[#6ee7a0] shrink-0" />
              <span>Ambiente seguro em desenvolvimento</span>
            </div>
          </div>

        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#b8a493] text-center md:text-left">
          <p>
            © 2026 Patas do Bem. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-2 text-[#d4c1b0]">
            <span>Amor, cuidado e transparência na proteção animal</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
