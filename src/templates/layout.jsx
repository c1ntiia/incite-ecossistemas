import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Menu from "../components/Menu"
import Footer from "../components/Footer"


export default function Layout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (

    <div 
      className="relative min-h-screen text-gray-800 font-sans bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/fundo.png')"}}
    >
      <div className="absolute inset-0 bg-[#ffffff]/80 z-0"></div>
      <div className="relative z-10 flex flex-col min-h-screen">
          <Menu />
        <div className="flex-grow">
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>

  )
}
