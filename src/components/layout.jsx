import { Outlet } from 'react-router-dom'


export default function Layout() {
  return (

    <div 
      className="relative min-h-screen text-gray-800 font-sans bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/fundo.jpg')"}}
    >
      <div className="absolute inset-0 bg-[#fafaf9]/40 z-0 backdrop-blur-[2px]"></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* <Navbar /> */}

        {/* O <Outlet /> é a "janela" mágica onde o React vai injetar a Home, Projetos, etc. */}
        <div className="flex-grow">
          <Outlet />
        </div>
        
        {/* <Footer /> */}
      </div>
    </div>
  )
}