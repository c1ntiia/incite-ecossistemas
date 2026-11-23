import { useState } from "react";
import { Link } from "react-router-dom";
import { Users, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button"; // ajuste o caminho se necessário


export default function AboutSection() {
  return (
    <div className="max-w-7xl mx-auto mt-12 pb-16 px-4">
      <div className="flex flex-col md:flex-row md:items-start">
        
        {/* Card 1: Esquerda, mais alto e SEMPRE na frente (z-20) */}
        <div className="group relative z-20 overflow-hidden rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-br from-emerald-50 via-white to-emerald-100/70 border border-emerald-200/80 p-6 sm:p-10 md:p-12 shadow-lg hover:shadow-2xl transition-all duration-500 min-h-[200px] sm:min-h-[260px] w-full md:flex-1 flex flex-col justify-center">
          <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-emerald-300/20 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:bg-emerald-300/30" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-lime-300/20 blur-2xl" />

          <div className="relative z-10 flex flex-col items-center text-center transition-all duration-500 group-hover:-translate-y-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-emerald-700">
              Rede de cooperação
            </span>
            <h3 className="mt-1 text-2xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              O que é o INCITE?
            </h3>
            <span className="mt-3 text-xs font-medium text-emerald-700/70 transition-opacity duration-300 group-hover:opacity-0 group-hover:h-0 overflow-hidden">
              Passe o mouse para ler →
            </span>
          </div>

          <div className="relative z-10 max-h-0 opacity-0 overflow-hidden transition-all duration-500 ease-in-out group-hover:max-h-[600px] group-hover:opacity-100 group-hover:mt-4">
            <p className="text-sm sm:text-base lg:text-lg text-justify text-gray-700 leading-relaxed">
              Apoiado pela <strong>FAPESB</strong>, o INCITE promove a criação e consolidação de redes de cooperação científica e tecnológica interinstitucionais e interdisciplinares. Cada rede foca em uma área estratégica definida por edital, trabalhando de forma colaborativa para superar desafios estruturais na Bahia. Iniciada em 2026, a rede <em>“Restauração e Conservação de Ecossistemas Terrestres Baianos”</em> reúne cerca de 100 pesquisadores de oito instituições, sob coordenação de docentes do Laboratório de Ecologia Aplicada à Conservação da Universidade Estadual de Santa Cruz (<strong>LEAC/UESC</strong>).
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-emerald-900 font-medium text-xs sm:text-sm">
              <span className="bg-emerald-200/60 px-4 py-1.5 rounded-full flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-700" /> ~100 Pesquisadores
              </span>
              <span className="bg-emerald-200/60 px-4 py-1.5 rounded-full flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-700" /> 8 Instituições
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Direita, 20px abaixo e SEMPRE atrás (z-10) */}
        <div className="group relative z-10 mt-[20px] md:mt-[20px] md:-ml-12 overflow-hidden rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-br from-sky-50 via-white to-sky-100/70 border border-sky-200/80 p-6 sm:p-10 md:p-12 md:pl-16 pt-10 md:pt-12 shadow-lg hover:shadow-2xl transition-all duration-500 min-h-[200px] sm:min-h-[260px] w-full md:flex-1 flex flex-col justify-center">
          <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-sky-300/20 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:bg-sky-300/30" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-emerald-300/20 blur-2xl" />

          <div className="relative z-10 flex flex-col items-center text-center transition-all duration-500 group-hover:-translate-y-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-sky-700">
              Prioridade Ambiental
            </span>
            <h3 className="mt-1 text-2xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Problemática
            </h3>
            <span className="mt-3 text-xs font-medium text-sky-700/70 transition-opacity duration-300 group-hover:opacity-0 group-hover:h-0 overflow-hidden">
              Passe o mouse para ler →
            </span>
          </div>

          <div className="relative z-10 max-h-0 opacity-0 overflow-hidden transition-all duration-500 ease-in-out group-hover:max-h-[600px] group-hover:opacity-100 group-hover:mt-4">
            <p className="text-sm sm:text-base lg:text-lg text-justify text-gray-700 leading-relaxed">
              Diante das mudanças climáticas globais e da acentuada perda de espécies e serviços ecossistêmicos, a Bahia ocupa uma posição prioritária para ações de mitigação ambiental. O estado abriga uma riquíssima biodiversidade, mas enfrenta severa degradação em seus diferentes biomas (<strong>Caatinga, Cerrado e Mata Atlântica</strong>). Por isso, desenvolver pesquisas voltadas à conservação e à restauração ecológica é uma estratégia essencial para enfrentar e minimizar a atual crise ambiental no estado.
            </p>

            <div className="mt-6 flex justify-end">
              <Link to="/acoes">
                <Button className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-6 rounded-full text-base sm:text-lg shadow-md transition-all">
                  Ações →
                </Button>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}