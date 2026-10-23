import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function App() {
  const navigate = useNavigate()
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)

    // mudar para carregamento da api
    const timer = setTimeout(() => {
      navigate('/Home'), { replace: true}
    }, 5000)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', handleResize)
    }
  }, [navigate])

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
        <img 
          className={`animate-logo-initial drop-shadow-xl ${isMobile ? "w-40" : "w-52 py-2"}`}
          src="/logo.png"
          alt="INCITE Ecossistemas Baianos"
        />
      </div>
    )
}