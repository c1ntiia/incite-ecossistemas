import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    // Removi o bg-[#fafaf9] e min-h-screen para o fundo do Layout poder aparecer aqui!
    <main className="text-gray-800 p-8 font-sans">
      
      <header className="max-w-5xl mx-auto pt-12 pb-16">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4 drop-shadow-sm">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-lime-500 to-sky-400">
            INCITE
          </span>{' '}
          Ecossistemas
        </h1>
      </header>

      <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        
        <div className="group relative bg-white/55 backdrop-blur-sm p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 border-t-8 border-emerald-500 overflow-hidden">
          <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-emerald-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
          <h2 className="text-2xl font-bold text-emerald-800 mb-4 relative z-10">
            O que é o INCITE?
          </h2>
          <p className="text-gray-600 relative z-10 leading-relaxed">
            O INCITE é uma iniciativa multidisciplinar focada em mapear, estudar e proteger os ecossistemas. 
            Atuamos como uma ponte vital entre a pesquisa acadêmica avançada e a aplicação prática na natureza.
          </p>
        </div>

        <div className="group relative bg-white/55 backdrop-blur-sm p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 border-t-8 border-lime-400 overflow-hidden md:-translate-y-6">
          <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-lime-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
          <h2 className="text-2xl font-bold text-lime-700 mb-4 relative z-10">
            Nossa Missão
          </h2>
          <p className="text-gray-600 relative z-10 leading-relaxed">
            Promover o desenvolvimento sustentável através de ações concretas de preservação, 
            educação ambiental, mobilização social e implementação de tecnologias verdes em áreas vulneráveis.
          </p>
        </div>

        <div className="group relative bg-white/55 backdrop-blur-sm p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 border-t-8 border-sky-400 overflow-hidden">
          <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-sky-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
          <h2 className="text-2xl font-bold text-sky-700 mb-4 relative z-10">
            Problemática
          </h2>
          <p className="text-gray-600 relative z-10 leading-relaxed">
            O avanço desordenado e a exploração irracional ameaçam nossa biodiversidade. 
            Enfrentamos a degradação acelerada de habitats essenciais que necessitam de intervenção e proteção urgente.
          </p>
        </div>

      </section>

      <div className="text-center mt-20 pb-10">
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 rounded-full text-lg shadow-lg hover:shadow-emerald-500/30 transition-all">
          Conheça nossos pesquisadores
        </Button>
      </div>
    </main>
  )
}


// import { Button } from '@/components/ui/button'

// export default function home() {
//   return (
//     <main className="app min-h-screen p-8 bg-gray-50">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-6">
//           INCITE Ecossistemas Baianos
//         </h1>
        
//         <section className="bg-white p-6 rounded-lg shadow-md">
//           <h2 className="text-3xl font-bold tracking-tight text-green-700 mb-4">
//             Missão
//           </h2>
//           <p className="text-lg text-gray-700 mb-6">
//             Buscamos gerar conhecimento científico de alto impacto e qualificar recursos 
//             humanos para atuação em problemas ambientais associados à restauração e a 
//             conservação da biodiversidade nos três biomas baianos: Caatinga, Cerrado e 
//             Mata Atlântica.
//           </p>
          
//           <Button variant="default">Conheça nossos projetos</Button>
//         </section>
//       </div>
//     </main>
//   )
// }