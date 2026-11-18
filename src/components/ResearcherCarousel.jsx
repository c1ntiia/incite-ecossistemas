import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
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
        className="absolute left-0 top-1/2 z-10 -translate-y-1/2 -translate-x-1/2 hidden sm:flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-emerald-700 shadow-xl hover:bg-emerald-50 hover:scale-105 transition-all"
      >
        <ChevronLeft className="h-7 w-7" />
      </button>

      <ul
        ref={trackRef}
        className="flex gap-8 overflow-x-auto snap-x snap-mandatory scroll-smooth py-8 px-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {researchers.map((researcher) => {
          const profileId = researcher.id || researcher.lattes_id
          return (
            <li
              key={researcher.lattes_id || researcher.id}
              data-card
              className="snap-start shrink-0 w-64 sm:w-72 min-h-[300px] flex flex-col items-center justify-between text-center bg-white rounded-[2.5rem] p-8 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <Link
                to={`/pesquisadores/${profileId}`}
                className="flex flex-col items-center justify-between h-full w-full group"
              >
                <div className="flex flex-col items-center">
                  <ResearcherAvatar
                    researcher={researcher}
                    className="h-32 w-32 text-3xl shadow-md group-hover:scale-105 transition-transform"
                  />
                  <p className="mt-6 text-lg font-bold text-gray-800 group-hover:text-emerald-700 transition-colors leading-snug line-clamp-2">
                    {researcher.name}
                  </p>
                </div>

                {researcher.institution && (
                  <span className="mt-4 inline-block bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-semibold">
                    {researcher.institution.acronym}
                  </span>
                )}
              </Link>
            </li>
          )
        })}
      </ul>

      <button
        type="button"
        onClick={() => scrollTrack(trackRef.current, 1)}
        aria-label="Próximos pesquisadores"
        className="absolute right-0 top-1/2 z-10 -translate-y-1/2 translate-x-1/2 hidden sm:flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-emerald-700 shadow-xl hover:bg-emerald-50 hover:scale-105 transition-all"
      >
        <ChevronRight className="h-7 w-7" />
      </button>
    </div>
  )
}