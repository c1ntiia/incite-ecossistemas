import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import ResearcherCarousel from '@/components/ResearcherCarousel'
import { researchers } from '@/data/researchers'
import { useResearchers } from '@/hooks/useResearchers'
import AboutSection from '../components/AboutSection'
import InstitutionsSection from '../components/InstitutionsSection'
import { Info, AlertTriangle, Users, Building2 } from 'lucide-react'

// Embaralha uma cópia para o carrossel não começar sempre pelos mesmos nomes
function shuffle(list) {
  const copy = [...list]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export default function Home() {
  // Estado necessário para controlar as abas interativas
  const [activeTab, setActiveTab] = useState('incite')

  const carouselResearchers = useMemo(() => shuffle(researchers), [])
  const { researchers: apiResearchers, loading, error } = useResearchers()

  return (
    <main className="text-gray-800 p-8 font-sans scroll-smooth">
      <div className="max-w-8xl mx-auto px-6 lg:px-16 pt-[5%] pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="flex flex-col text-left">
            <header className="mb-6">
              <p className="mb-3 text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-widest">
                Institutos de Ciência, Inovação e Tecnologia do Estado da Bahia
              </p>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight drop-shadow-sm leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-lime-500 to-sky-400">
                  INCITE
                </span>{' '}
                Restauração e Conservação de Ecossistemas Terrestres Baianos
              </h1>
            </header>

            <section>
              <p className="text-base text-gray-600 text-justify leading-relaxed">
                Buscando gerar conhecimento científico de alto impacto e qualificar recursos 
                humanos para atuação em problemas ambientais associados à restauração e a 
                conservação da biodiversidade nos três biomas baianos: <strong>Caatinga, Cerrado e 
                Mata Atlântica</strong>.
              </p>
            </section>

            <div className="max-w-8xl mx-auto px-6 lg:px-16 pt-20 pb-12">
              <a href="#inicio">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-8 py-6 rounded-full text-lg shadow-lg hover:shadow-emerald-600/30 hover:-translate-y-1 transition-all duration-300">
                  Conheça mais ↓
                </Button>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-[5%]">
            <div className="w-full h-40 sm:h-56 bg-gray-200 rounded-[2rem] overflow-hidden shadow-md">
              <img src="./img1.jpg" alt="Restauração 1" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="w-full h-40 sm:h-56 bg-gray-200 rounded-[2rem] overflow-hidden shadow-md lg:mt-8">
              <img src="./img2.JPG" alt="Restauração 2" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="w-full h-40 sm:h-56 bg-gray-200 rounded-[2rem] overflow-hidden shadow-md">
              <img src="./img3.JPG" alt="Restauração 3" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="w-full h-40 sm:h-56 bg-gray-200 rounded-[2rem] overflow-hidden shadow-md lg:mt-8">
              <img src="./img4.jpeg" alt="Restauração 4" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
            </div>
          </div>

        </div>
      </div>

      <section id="inicio" className="max-w-7xl mx-auto pt-20 pb-10 border-gray-200">
        
        {/* Seção das Abas Interativas */}
        <AboutSection />

        {/* Seção de Pesquisadores */}
        <div className="px-4 sm:px-10 pb-16 pt-16">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-3">
            Nossos pesquisadores
          </h2>
          <div className="text-center mt-4">
            <Button asChild variant="ghost" className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 text-xl font-semibold px-8 py-2 rounded-full transition-all">
              <Link to="/pesquisadores">
                Quem somos <span className="ml-2 text-2xl">→</span>
              </Link>
            </Button>
          </div>

          {loading ? (
            <div className="flex gap-6 overflow-hidden py-4 px-1" aria-busy="true">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="shrink-0 w-44 sm:w-48 h-52 rounded-[2rem] bg-white/70 shadow-md animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <p className="text-center text-gray-500">Não foi possível carregar os pesquisadores.</p>
          ) : (
            <ResearcherCarousel researchers={apiResearchers} />
          )}
        </div>

        {/* Seção de Instituições Envolvidas */}
        <InstitutionsSection />
      </section>
    </main>
  )
}