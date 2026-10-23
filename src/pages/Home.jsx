import { Button } from '@/components/ui/button'

export default function Home() {
  // // Array provisório
  // const pesquisadores = [
  //   { id: 1, nome: "Dra. Ana Silva", foto: "https://via.placeholder.com/150" },
  //   { id: 2, nome: "Dr. Carlos Mendes", foto: "https://via.placeholder.com/150" },
  //   { id: 3, nome: "Dra. Beatriz Costa", foto: "https://via.placeholder.com/150" },
  // ];

  return (
    <main className="text-gray-800 p-8 font-sans scroll-smooth">
      
      <div className="max-w-8xl mx-auto px-6 lg:px-16 pt-[5%] pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="flex flex-col text-left">
            <header className="mb-6">
              <p className="mb-3 text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-widest">
                Institutos de Ciência, Inovação e Tecnologia do Estado da Bahia
              </p>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-sm leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-lime-500 to-sky-400">
                  INCITE
                </span>{' '}
                Restauração e Conservação de Ecossistemas Terrestres Baianos
              </h1>
            </header>

            <section>
              <p className="text-0.5xl text-gray-600 text-justify leading-relaxed">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-8xl mx-auto mt-12 pb-20 px-4">
          
          <a
            className="group flex flex-col justify-start items-center h-full bg-emerald-100 hover:bg-emerald-200 p-10 rounded-[2rem] shadow-lg hover:shadow-emerald-200/40 hover:-translate-y-2 transition-all duration-300"
          >
            <h3 className="text-3xl font-bold mb-6 text-center text-gray/90">O que é o INCITE?</h3>
            <p className="text-lg text-justify text-gray/90 leading-relaxed">
              O INCITE é uma iniciativa apoiada pela Fundação de Amparo à Pesquisa do 
              Estado da Bahia (FAPESB), que visa promover a criação e consolidação de 
              redes de cooperação científica e tecnológica interinstitucional e interdisciplinar. 
              Cada rede atua em uma área estratégica definida por Edital e deve atuar de 
              forma colaborativa para superar problemas estruturais existentes no estado da 
              Bahia. Em 2026, foi iniciada a rede “Restauração e Conservação de 
              Ecossistemas Terrestres Baianos”, que conta com cerca de 100 pesquisadores 
              de oito diferentes instituições de pesquisa e é coordenado por docentes do 
              Laboratório de Ecologia Aplicada a Conservação da Universidade Estadual de 
              Santa Cruz (LEAC/UESC).
            </p>
          </a>

          <a
            className="group flex flex-col justify-start items-center h-full bg-sky-100 hover:bg-sky-200 p-10 rounded-[2rem] shadow-lg hover:shadow-sky-200/40 hover:-translate-y-2 transition-all duration-300"
          >
            <h3 className="text-3xl font-bold mb-6 text-center text-gray/90">Problemática</h3>
            <p className="text-lg text-justify text-gray/90 leading-relaxed">
              Num cenário de mudanças climáticas globais, elevada perda de espécies e de 
              serviços ecossistêmicos, o estado da Bahia integra uma região prioritária para 
              ações de mitigação dos problemas ambientais, especialmente por ser um 
              estado que abriga uma alta biodiversidade e enfrenta elevada degradação dos 
              seus diferentes ecossistemas. Assim, desenvolver pesquisas relacionadas à 
              conservação e restauração de ecossistemas no estado é uma estratégia 
              prioritária para minimizar a atual a crise ambiental no estado da Bahia.
            </p>
            <a href="/acoes">
              <Button variant="outline" className="mt-5 ml-[100%] text-sky-900 border-sky-300 hover:bg-sky-200 px-8 py-6 rounded-full text-lg transition-all ">
                Ações →
              </Button>
            </a>
          </a>

        </div>
      
        <div className="text-center">
          <a href="/pesquisadores">
            <Button variant="outline" className="text-emerald-700 border-emerald-600 hover:bg-emerald-50 px-8 py-6 rounded-full text-lg transition-all">
              Quem somos
            </Button>
          </a>
        </div>
      </section>

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