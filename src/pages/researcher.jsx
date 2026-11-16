import { useMemo, useState } from 'react'
import { ExternalLink, Search } from 'lucide-react'
import ResearcherAvatar from '@/components/ResearcherAvatar'
import { getLattesUrl, institutions, normalizeText, researchers } from '@/data/researchers'

export default function Researcher() {
  const [query, setQuery] = useState('')
  const [institutionId, setInstitutionId] = useState('')

  const filtered = useMemo(() => {
    const q = normalizeText(query.trim())
    return researchers.filter((r) => {
      const matchesName = !q || normalizeText(r.name).includes(q)
      const matchesInstitution =
        !institutionId || r.institution_id.toLowerCase() === institutionId.toLowerCase()
      return matchesName && matchesInstitution
    })
  }, [query, institutionId])

  return (
    <main className="max-w-7xl mx-auto px-6 lg:px-16 py-12 text-gray-800">
      <header className="mb-10">
        <p className="mb-3 text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-widest">
          Quem somos
        </p>
        <h1 className="text-4xl font-bold tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-lime-500 to-sky-400">
            Pesquisadores
          </span>{' '}
          da rede
        </h1>
        <p className="mt-3 text-sm text-gray-600">
          {researchers.length} pesquisadores de {institutions.length} instituições.
        </p>
      </header>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <label className="relative flex-1">
          <span className="sr-only">Buscar pesquisador</span>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome..."
            className="w-full rounded-full border border-gray-200 bg-white/90 py-3 pl-12 pr-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </label>

        <label className="sm:w-72">
          <span className="sr-only">Filtrar por instituição</span>
          <select
            value={institutionId}
            onChange={(e) => setInstitutionId(e.target.value)}
            className="w-full rounded-full border border-gray-200 bg-white/90 py-3 px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Todas as instituições</option>
            {institutions.map((inst) => (
              <option key={inst.institution_id} value={inst.institution_id}>
                {inst.acronym} - {inst.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="mb-6 text-sm text-gray-500">
        {filtered.length} {filtered.length === 1 ? 'resultado' : 'resultados'}
      </p>

      {filtered.length === 0 ? (
        <p className="text-center text-gray-500 py-16">Nenhum pesquisador encontrado.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((r) => (
            <li
              key={r.lattes_id}
              className="flex flex-col items-center text-center bg-white/90 rounded-[2rem] p-6 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <ResearcherAvatar researcher={r} className="h-24 w-24 text-2xl" />
              <h2 className="mt-4 font-semibold leading-snug">{r.name}</h2>
              {r.institution && (
                <p className="mt-1 text-sm text-gray-500" title={r.institution.name}>
                  {r.institution.acronym}
                </p>
              )}
              <a
                href={getLattesUrl(r)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 hover:text-emerald-800 hover:underline"
              >
                Currículo Lattes <ExternalLink className="h-4 w-4" />
              </a>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
