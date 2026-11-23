import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ExternalLink, Search } from 'lucide-react'
import ResearcherAvatar from '@/components/ResearcherAvatar'
import { getLattesUrl, normalizeText } from '@/data/researchers'
import { useResearchers } from '@/hooks/useResearchers'

export default function Researcher() {
  const [query, setQuery] = useState('')
  const [institutionId, setInstitutionId] = useState('')
  const { researchers: list, institutions, loading, error } = useResearchers()

  const filtered = useMemo(() => {
    const q = normalizeText(query.trim())
    return list.filter((r) => {
      const matchesName = !q || normalizeText(r.name).includes(q)
      const rInstId = String(r.institution_id ?? r.institution?.institution_id ?? r.institution?.id ?? '').toLowerCase()
      const matchesInstitution = !institutionId || rInstId === institutionId.toLowerCase()
      return matchesName && matchesInstitution
    })
  }, [list, query, institutionId])

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
          {loading ? 'Carregando pesquisadores...' : `${list.length} pesquisadores cadastrados.`}
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

        {institutions && institutions.length > 0 && (
          <label className="sm:w-72">
            <span className="sr-only">Filtrar por instituição</span>
            <select
              value={institutionId}
              onChange={(e) => setInstitutionId(e.target.value)}
              className="w-full rounded-full border border-gray-200 bg-white/90 py-3 px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Todas as instituições</option>
              {institutions.map((inst) => (
                <option key={inst.institution_id || inst.id} value={inst.institution_id || inst.id}>
                  {inst.acronym ? `${inst.acronym} - ` : ''}{inst.name}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <p className="mb-6 text-sm text-gray-500">
        {loading
          ? 'Buscando na base de dados...'
          : `${filtered.length} ${filtered.length === 1 ? 'resultado' : 'resultados'}`}
      </p>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" aria-busy="true">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-64 rounded-[2rem] bg-white/70 shadow-sm border border-gray-100 animate-pulse p-6"
            />
          ))}
        </div>
      ) : error ? (
        <p className="text-center text-gray-500 py-16">
          Não foi possível carregar os pesquisadores. Verifique a conexão com a API.
        </p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-gray-500 py-16">Nenhum pesquisador encontrado.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((r) => {
            const profileId = r.id || r.lattes_id
            return (
              <li
                key={r.lattes_id || r.id}
                className="flex flex-col items-center justify-between text-center bg-white/90 border-2 border-gray-100 rounded-[2rem] p-6 shadow-md hover:shadow-lg hover:-translate-y-2 transition-all duration-300"
              >
                <Link
                  to={`/pesquisadores/${profileId}`}
                  className="flex flex-col items-center group w-full"
                >
                  <ResearcherAvatar
                    researcher={r}
                    className="h-24 w-24 text-2xl group-hover:scale-105 transition-transform"
                  />
                  <h2 className="mt-4 font-semibold leading-snug group-hover:text-emerald-700 transition-colors">
                    {r.name}
                  </h2>
                  {r.institution && (
                    <p className="mt-1 text-sm text-gray-500" title={r.institution.name}>
                      {r.institution.acronym || r.institution.name}
                    </p>
                  )}
                  {r.graduation && (
                    <span className="mt-2 inline-block rounded-full bg-emerald-50 text-emerald-700 px-3 py-0.5 text-xs font-medium">
                      {r.graduation}
                    </span>
                  )}
                </Link>

                <div className="mt-5 pt-4 border-t border-gray-100 w-full flex flex-col gap-2">
                  <a
                    href={getLattesUrl(r)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1 text-xs font-medium text-gray-500 hover:text-emerald-700 hover:underline"
                  >
                    Currículo Lattes <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </main>
  )
}
