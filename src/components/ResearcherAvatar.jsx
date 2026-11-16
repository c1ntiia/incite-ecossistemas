import { useState } from 'react'
import { cn } from '@/lib/utils'
import { getInitials, getPhotoUrl } from '@/data/researchers'

// Foto do pesquisador; se não houver foto (ou ela falhar), mostra as iniciais
export default function ResearcherAvatar({ researcher, className }) {
  const photoUrl = getPhotoUrl(researcher)
  const [failed, setFailed] = useState(false)

  return (
    <div
      className={cn(
        'flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-emerald-400 to-sky-400 text-white font-bold shadow-md ring-4 ring-white',
        className,
      )}
    >
      {photoUrl && !failed ? (
        <img
          src={photoUrl}
          alt={researcher.name}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span aria-label={researcher.name}>{getInitials(researcher.name)}</span>
      )}
    </div>
  )
}
