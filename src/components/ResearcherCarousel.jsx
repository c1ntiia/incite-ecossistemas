import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ResearcherAvatar from '@/components/ResearcherAvatar'

// Avança um card; no fim volta ao início (e vice-versa)
function scrollTrack(track, direction) {
  if (!track) return
  const card = track.querySelector('[data-card]')
  const gap = parseFloat(getComputedStyle(track).columnGap) || 0
  const step = card ? card.offsetWidth + gap : track.clientWidth
  const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4
  const atStart = track.scrollLeft <= 4

  if (direction > 0 && atEnd) track.scrollTo({ left: 0, behavior: 'smooth' })
  else if (direction < 0 && atStart) track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' })
  else track.scrollBy({ left: direction * step, behavior: 'smooth' })
}

export default function ResearcherCarousel({ researchers, interval = 3000 }) {
  const trackRef = useRef(null)
  const [paused, setPaused] = useState(false)

  // Rolagem automática (pausa no hover/foco e respeita "reduzir movimento")
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (paused || reduceMotion) return
    const id = setInterval(() => scrollTrack(trackRef.current, 1), interval)
    return () => clearInterval(id)
  }, [paused, interval])

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <button
        type="button"
        onClick={() => scrollTrack(trackRef.current, -1)}
        aria-label="Pesquisadores anteriores"
        className="absolute left-0 top-1/2 z-10 -translate-y-1/2 -translate-x-1/2 hidden sm:flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-emerald-700 shadow-lg hover:bg-emerald-50 transition-colors"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <ul
        ref={trackRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth py-4 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {researchers.map((researcher) => (
          <li
            key={researcher.lattes_id}
            data-card
            className="snap-start shrink-0 w-44 sm:w-48 flex flex-col items-center text-center bg-white/90 rounded-[2rem] p-6 shadow-md"
          >
            <ResearcherAvatar researcher={researcher} className="h-24 w-24 text-2xl" />
            <p className="mt-4 text-sm font-semibold text-gray-800 leading-snug line-clamp-2">
              {researcher.name}
            </p>
            {researcher.institution && (
              <p className="mt-1 text-xs font-medium text-emerald-700">
                {researcher.institution.acronym}
              </p>
            )}
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => scrollTrack(trackRef.current, 1)}
        aria-label="Próximos pesquisadores"
        className="absolute right-0 top-1/2 z-10 -translate-y-1/2 translate-x-1/2 hidden sm:flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-emerald-700 shadow-lg hover:bg-emerald-50 transition-colors"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </div>
  )
}
