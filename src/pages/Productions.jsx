import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Award,
  BarChart3,
  BookOpen,
  Calendar,
  Code,
  Copyright,
  Cpu,
  ExternalLink,
  FileCheck,
  FileText,
  Filter,
  Search,
  Star,
  Tag,
  User,
} from 'lucide-react'
import GraficoChart from '@/components/GraficoChart'
import { normalizeText } from '@/data/researchers'
import { formatIssn } from '@/hooks/useBibliographicProduction'
import { CoresQualis, useProductions } from '@/hooks/useProductions'

const PRODUCTION_TABS = [
  { id: 'artigos', label: 'Artigos', icon: FileText },
  { id: 'livrosECapitulos', label: 'Livros e Capítulos', icon: BookOpen },
  { id: 'producaoTecnica', label: 'Produção Técnica', icon: Cpu },
]

const QUALIS_OPTIONS = ['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'B3', 'B4', 'C', 'SQ']

const TECNICA_SUBTYPES = [
  { id: 'Software', label: 'Softwares', color: CoresQualis.Software, icon: Code },
  { id: 'Patente', label: 'Patentes', color: CoresQualis.Patente, icon: Copyright },
  { id: 'Marca', label: 'Marcas', color: CoresQualis.Marca, icon: Tag },
  { id: 'Relatorio', label: 'Relatórios Técnicos', color: CoresQualis.Relatorio, icon: FileCheck },
]

const LIVROS_SUBTYPES = [
  { id: 'Capitulo', label: 'Capítulos de Livros', color: CoresQualis.Capitulo },
  { id: 'Livro', label: 'Livros', color: CoresQualis.Livro },
]

const YEAR_OPTIONS = Array.from({ length: 27 }, (_, i) => 2026 - i) // 2026 até 2000

function ProductionItemCard({ item, tipo }) {
  const formattedIssn = formatIssn(item.issn)
  const doiUrl = item.doi
    ? item.doi.startsWith('http')
      ? item.doi
      : `https://doi.org/${item.doi}`
    : null
  const researcherProfileId = item.researcher_id || item.lattes_id

  const badgeColor =
    tipo === 'producaoTecnica'
      ? CoresQualis[item.categoriaGrafico] || CoresQualis.Software
      : tipo === 'livrosECapitulos'
        ? CoresQualis[item.categoriaGrafico] || CoresQualis.Livro
        : null

  return (
    <li className="flex flex-col justify-between bg-white/95 rounded-2xl p-4 shadow-sm border border-gray-200 hover:shadow-md hover:border-emerald-200/80 transition-all">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-1.5 mb-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            {item.year && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-bold">
                <Calendar className="h-3 w-3" />
                {item.year}
              </span>
            )}

            {tipo === 'artigos' && item.qualis && (
              <span
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold shadow-sm"
                style={{
                  backgroundColor: CoresQualis[item.qualis] || CoresQualis.SQ,
                  color: ['A3', 'A4', 'B3', 'B4'].includes(item.qualis)
                    ? '#0f172a'
                    : '#ffffff',
                }}
              >
                {item.qualis === 'SQ' ? 'Sem Qualis' : `Qualis ${item.qualis}`}
              </span>
            )}

            {item.subtipo && (
              <span
                className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold"
                style={
                  badgeColor
                    ? { backgroundColor: badgeColor, color: '#ffffff' }
                    : { backgroundColor: '#f3f4f6', color: '#374151' }
                }
              >
                {item.subtipo}
              </span>
            )}

            {item.relevance && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 text-[11px] font-semibold">
                <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
                Relevante
              </span>
            )}
          </div>

          {doiUrl && (
            <a
              href={doiUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={`DOI: ${item.doi}`}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50/70 hover:bg-emerald-100/80 px-2.5 py-1 rounded-full transition-colors"
            >
              DOI
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>

        <h3
          className="text-sm font-bold text-gray-900 leading-snug line-clamp-2"
          title={item.cleanTitle || item.title}
        >
          {item.cleanTitle || item.title}
        </h3>
      </div>

      <div className="mt-3 pt-2.5 border-t border-gray-100 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600">
        {Array.isArray(item.researchers) && item.researchers.length > 0 ? (
          <span className="inline-flex items-center gap-1 font-medium text-xs text-gray-700 flex-wrap">
            <User className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            {item.researchers.map((r, idx) => {
              const rId = r.id || r.lattes_id
              return (
                <span key={rId || r.name || idx} className="inline-flex items-center">
                  {idx > 0 && <span className="text-gray-400 mr-1">,</span>}
                  {rId ? (
                    <Link
                      to={`/pesquisadores/${rId}`}
                      className="text-emerald-700 hover:text-emerald-800 hover:underline font-semibold"
                    >
                      {r.name}
                    </Link>
                  ) : (
                    <span>{r.name}</span>
                  )}
                </span>
              )
            })}
          </span>
        ) : item.researcherName ? (
          <span className="inline-flex items-center gap-1 font-medium line-clamp-1">
            <User className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            {researcherProfileId ? (
              <Link
                to={`/pesquisadores/${researcherProfileId}`}
                className="text-emerald-700 hover:text-emerald-800 hover:underline font-semibold truncate"
              >
                {item.researcherName}
              </Link>
            ) : (
              <span className="truncate">{item.researcherName}</span>
            )}
          </span>
        ) : null}

        {item.magazine && (
          <span className="inline-flex items-center gap-1 font-medium text-gray-700 line-clamp-1">
            <BookOpen className="h-3.5 w-3.5 text-sky-600 shrink-0" />
            <span className="truncate">{item.magazine}</span>
          </span>
        )}

        {item.publishing_company && (
          <span className="text-gray-600 truncate">
            Editora: <strong className="font-medium">{item.publishing_company}</strong>
          </span>
        )}

        {formattedIssn && (
          <span className="text-gray-500">
            ISSN: <strong className="font-medium text-gray-700">{formattedIssn}</strong>
          </span>
        )}

        {item.isbn && (
          <span className="text-gray-500">
            ISBN: <strong className="font-medium text-gray-700">{item.isbn}</strong>
          </span>
        )}

        {item.code && (
          <span className="text-gray-500">
            Código: <strong className="font-medium text-gray-700">{item.code}</strong>
          </span>
        )}

        {item.category && (
          <span className="text-gray-500">
            Categoria: <strong className="font-medium text-gray-700">{item.category}</strong>
          </span>
        )}

        {item.platform && (
          <span className="text-gray-500">
            Plataforma: <strong className="font-medium text-gray-700">{item.platform}</strong>
          </span>
        )}

        {item.environment && (
          <span className="text-gray-500">
            Ambiente: <strong className="font-medium text-gray-700">{item.environment}</strong>
          </span>
        )}
      </div>
    </li>
  )
}

export default function Productions() {
  const [tipo, setTipo] = useState('artigos')
  const [anoInicial, setAnoInicial] = useState(2016)
  const [filtroQualis, setFiltroQualis] = useState([])
  const [filtroSubtipo, setFiltroSubtipo] = useState('')
  const [query, setQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(20)

  const { items, loading, error } = useProductions({
    tipo,
    filtroAno: [anoInicial],
    filtroQualis,
  })

  const toggleQualis = (q) => {
    setVisibleCount(20)
    setFiltroQualis((prev) =>
      prev.includes(q) ? prev.filter((item) => item !== q) : [...prev, q],
    )
  }

  const handleTabChange = (newTipo) => {
    setTipo(newTipo)
    setFiltroSubtipo('')
    setVisibleCount(20)
  }

  const filteredItems = useMemo(() => {
    const q = normalizeText(query.trim())

    return items.filter((item) => {
      if (filtroSubtipo && item.categoriaGrafico !== filtroSubtipo) {
        return false
      }
      if (!q) return true

      const titleMatch = normalizeText(item.cleanTitle || item.title || '').includes(q)
      const authorMatch =
        normalizeText(item.researcherName || '').includes(q) ||
        (Array.isArray(item.researchers) &&
          item.researchers.some((r) => normalizeText(r.name || '').includes(q)))
      const magMatch = normalizeText(
        item.magazine || item.publishing_company || item.project_name || '',
      ).includes(q)
      const codeMatch = normalizeText(item.doi || item.isbn || item.code || '').includes(q)
      const typeMatch = normalizeText(item.subtipo || item.category || '').includes(q)
      return titleMatch || authorMatch || magMatch || codeMatch || typeMatch
    })
  }, [items, query, filtroSubtipo])

  // Contadores separados por subtipo (Softwares, Patentes, Marcas, Relatórios / Livros, Capítulos)
  const subtypeCounts = useMemo(() => {
    const counts = {
      Software: 0,
      Patente: 0,
      Marca: 0,
      Relatorio: 0,
      Livro: 0,
      Capitulo: 0,
    }
    items.forEach((item) => {
      if (item.categoriaGrafico && counts[item.categoriaGrafico] !== undefined) {
        counts[item.categoriaGrafico] += 1
      }
    })
    return counts
  }, [items])

  const stats = useMemo(() => {
    const total = filteredItems.length
    const qualisA = filteredItems.filter((i) =>
      ['A1', 'A2', 'A3', 'A4'].includes(String(i.qualis || '').toUpperCase()),
    ).length
    const researchersCount = new Set(
      filteredItems
        .flatMap((i) =>
          Array.isArray(i.researchers) && i.researchers.length > 0
            ? i.researchers.map((r) => r.id || r.lattes_id || r.name)
            : [i.researcher_id || i.lattes_id || i.researcherName],
        )
        .filter(Boolean),
    ).size
    const years = filteredItems.map((i) => Number(i.year)).filter(Boolean)
    const maxYear = years.length > 0 ? Math.max(...years) : '—'

    return { total, qualisA, researchersCount, maxYear }
  }, [filteredItems])

  const visibleItems = useMemo(
    () => filteredItems.slice(0, visibleCount),
    [filteredItems, visibleCount],
  )

  // Agrupamentos separados para Produção Técnica e Livros e Capítulos
  const groupedSections = useMemo(() => {
    if (tipo === 'producaoTecnica' && !filtroSubtipo) {
      return [
        {
          id: 'Software',
          title: 'Todos os Softwares',
          icon: Code,
          color: CoresQualis.Software,
          list: filteredItems.filter((i) => i.categoriaGrafico === 'Software'),
        },
        {
          id: 'Patente',
          title: 'Todas as Patentes',
          icon: Copyright,
          color: CoresQualis.Patente,
          list: filteredItems.filter((i) => i.categoriaGrafico === 'Patente'),
        },
        {
          id: 'Marca',
          title: 'Todas as Marcas',
          icon: Tag,
          color: CoresQualis.Marca,
          list: filteredItems.filter((i) => i.categoriaGrafico === 'Marca'),
        },
        {
          id: 'Relatorio',
          title: 'Todos os Relatórios Técnicos',
          icon: FileCheck,
          color: CoresQualis.Relatorio,
          list: filteredItems.filter((i) => i.categoriaGrafico === 'Relatorio'),
        },
      ]
    }

    if (tipo === 'livrosECapitulos' && !filtroSubtipo) {
      return [
        {
          id: 'Capitulo',
          title: 'Todos os Capítulos de Livros',
          icon: BookOpen,
          color: CoresQualis.Capitulo,
          list: filteredItems.filter((i) => i.categoriaGrafico === 'Capitulo'),
        },
        {
          id: 'Livro',
          title: 'Todos os Livros',
          icon: BookOpen,
          color: CoresQualis.Livro,
          list: filteredItems.filter((i) => i.categoriaGrafico === 'Livro'),
        },
      ]
    }

    return null
  }, [tipo, filtroSubtipo, filteredItems])

  return (
    <main className="max-w-7xl mx-auto px-6 lg:px-16 py-12 text-gray-800">
      {/* Cabeçalho */}
      <header className="mb-8">
        <p className="mb-3 text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-widest">
          Produção Científica e Tecnológica
        </p>
        <h1 className="text-4xl font-bold tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-lime-500 to-sky-400">
            Produções
          </span>          
        </h1>
        <p className="mt-3 text-sm text-gray-600">
          Acompanhe a evolução anual e consulte artigos, livros, capítulos, softwares, patentes,
          marcas e relatórios técnicos dos pesquisadores do INCITE.
        </p>
      </header>

      {/* Abas de Tipo de Produção */}
      <div className="flex flex-wrap gap-2 mb-8">
        {PRODUCTION_TABS.map((tab) => {
          const Icon = tab.icon
          const active = tipo === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all shadow-sm ${
                active
                  ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                  : 'bg-white/90 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 border border-gray-200/80'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Filtros de Ano Inicial, Qualis / Subtipo e Busca */}
      <section className="bg-white/90 rounded-[2rem] p-6 shadow-sm border border-gray-100 mb-8 space-y-5">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Busca por texto */}
          <label className="relative flex-1">
            <span className="sr-only">Buscar produção</span>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setVisibleCount(20)
              }}
              placeholder="Buscar por título, pesquisador, periódico, DOI, código ou ISBN..."
              className="w-full rounded-full border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </label>

          {/* Filtro a partir do ano */}
          <label className="flex items-center gap-3 md:w-64">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 whitespace-nowrap flex items-center gap-1">
              <Calendar className="h-4 w-4 text-emerald-600" />
              A partir de:
            </span>
            <select
              value={anoInicial}
              onChange={(e) => {
                setAnoInicial(Number(e.target.value))
                setVisibleCount(20)
              }}
              className="w-full rounded-full border border-gray-200 bg-white py-3 px-4 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {YEAR_OPTIONS.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Filtro de Qualis (somente para Artigos) */}
        {tipo === 'artigos' && (
          <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 mr-2 flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5 text-emerald-600" />
              Estrato Qualis:
            </span>

            <button
              type="button"
              onClick={() => setFiltroQualis([])}
              className={`rounded-full px-3.5 py-1 text-xs font-semibold border transition-all ${
                filtroQualis.length === 0
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              Todos
            </button>

            {QUALIS_OPTIONS.map((q) => {
              const selected = filtroQualis.includes(q)
              return (
                <button
                  key={q}
                  type="button"
                  onClick={() => toggleQualis(q)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold border transition-all ${
                    selected
                      ? 'ring-2 ring-offset-1 ring-emerald-600 bg-emerald-50 text-emerald-950 border-emerald-400'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: CoresQualis[q] }}
                  />
                  {q === 'SQ' ? 'Sem Qualis' : q}
                </button>
              )
            })}
          </div>
        )}

        {/* Filtro separado por Software, Patente e Marca (Produção Técnica) */}
        {tipo === 'producaoTecnica' && (
          <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 mr-2 flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5 text-emerald-600" />
              Tipo de Produção Técnica:
            </span>

            <button
              type="button"
              onClick={() => setFiltroSubtipo('')}
              className={`rounded-full px-3.5 py-1 text-xs font-semibold border transition-all ${
                !filtroSubtipo
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              Todos ({items.length})
            </button>

            {TECNICA_SUBTYPES.map((sub) => {
              const selected = filtroSubtipo === sub.id
              const count = subtypeCounts[sub.id] || 0
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setFiltroSubtipo(selected ? '' : sub.id)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold border transition-all ${
                    selected
                      ? 'ring-2 ring-offset-1 ring-emerald-600 bg-emerald-50 text-emerald-950 border-emerald-400'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: sub.color }}
                  />
                  {sub.label} ({count})
                </button>
              )
            })}
          </div>
        )}

        {/* Filtro separado por Capítulos de Livros e Livros */}
        {tipo === 'livrosECapitulos' && (
          <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 mr-2 flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5 text-emerald-600" />
              Modalidade:
            </span>

            <button
              type="button"
              onClick={() => setFiltroSubtipo('')}
              className={`rounded-full px-3.5 py-1 text-xs font-semibold border transition-all ${
                !filtroSubtipo
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              Todos ({items.length})
            </button>

            {LIVROS_SUBTYPES.map((sub) => {
              const selected = filtroSubtipo === sub.id
              const count = subtypeCounts[sub.id] || 0
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setFiltroSubtipo(selected ? '' : sub.id)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold border transition-all ${
                    selected
                      ? 'ring-2 ring-offset-1 ring-emerald-600 bg-emerald-50 text-emerald-950 border-emerald-400'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: sub.color }}
                  />
                  {sub.label} ({count})
                </button>
              )
            })}
          </div>
        )}
      </section>

      {/* Indicadores Rápidos */}
      {tipo === 'producaoTecnica' ? (
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white/90 rounded-[2rem] p-5 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Total Técnico
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? '...' : stats.total}
              </p>
            </div>
          </div>

          <div className="bg-white/90 rounded-[2rem] p-5 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
              <Code className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Softwares
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? '...' : subtypeCounts.Software}
              </p>
            </div>
          </div>

          <div className="bg-white/90 rounded-[2rem] p-5 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Copyright className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Patentes
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? '...' : subtypeCounts.Patente}
              </p>
            </div>
          </div>

          <div className="bg-white/90 rounded-[2rem] p-5 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Tag className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Marcas
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? '...' : subtypeCounts.Marca}
              </p>
            </div>
          </div>

          <div className="bg-white/90 rounded-[2rem] p-5 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
              <FileCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Relatórios
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? '...' : subtypeCounts.Relatorio}
              </p>
            </div>
          </div>
        </section>
      ) : tipo === 'livrosECapitulos' ? (
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/90 rounded-[2rem] p-5 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Total listado
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? '...' : stats.total}
              </p>
            </div>
          </div>

          <div className="bg-white/90 rounded-[2rem] p-5 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center shrink-0">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Capítulos
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? '...' : subtypeCounts.Capitulo}
              </p>
            </div>
          </div>

          <div className="bg-white/90 rounded-[2rem] p-5 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Livros
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? '...' : subtypeCounts.Livro}
              </p>
            </div>
          </div>

          <div className="bg-white/90 rounded-[2rem] p-5 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
              <User className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Pesquisadores
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? '...' : stats.researchersCount}
              </p>
            </div>
          </div>
        </section>
      ) : (
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/90 rounded-[2rem] p-5 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Total listado
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? '...' : stats.total}
              </p>
            </div>
          </div>

          {tipo === 'artigos' ? (
            <div className="bg-white/90 rounded-[2rem] p-5 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Qualis A (A1–A4)
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : stats.qualisA}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white/90 rounded-[2rem] p-5 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Modalidade
                </p>
                <p className="text-base font-bold text-gray-900 line-clamp-1">
                  {PRODUCTION_TABS.find((t) => t.id === tipo)?.label}
                </p>
              </div>
            </div>
          )}

          <div className="bg-white/90 rounded-[2rem] p-5 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
              <User className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Pesquisadores
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? '...' : stats.researchersCount}
              </p>
            </div>
          </div>

          <div className="bg-white/90 rounded-[2rem] p-5 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-lime-100 text-lime-700 flex items-center justify-center shrink-0">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Período
              </p>
              <p className="text-lg font-bold text-gray-900">
                {anoInicial} – {loading ? '...' : stats.maxYear}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Gráfico de Evolução por Ano (GraficoChart) */}
      <section className="mb-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">
            Gráfico — {PRODUCTION_TABS.find((t) => t.id === tipo)?.label} por ano
          </h2>
          <span className="text-xs text-gray-500">
            Passe o mouse sobre as barras para ver os detalhes por ano
          </span>
        </div>

        <GraficoChart
          tipo={tipo}
          filtroAno={[anoInicial]}
          filtroQualis={filtroQualis}
          items={filteredItems}
        />
      </section>

      {/* Listagem de Produções */}
      <section>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" aria-busy="true">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-36 rounded-2xl bg-white/80 shadow-sm border border-gray-100 animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div className="bg-white/90 rounded-[2rem] p-12 text-center shadow-sm border border-red-100">
            <p className="text-gray-700 font-medium">
              Não foi possível carregar as produções no momento.
            </p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white/90 rounded-[2rem] p-12 text-center shadow-sm border border-gray-100">
            <p className="text-gray-600">
              Nenhuma produção encontrada para os filtros selecionados.
            </p>
          </div>
        ) : groupedSections ? (
          <div className="space-y-12">
            {groupedSections.map((sec) => {
              const SecIcon = sec.icon
              return (
                <div key={sec.id}>
                  <div className="flex items-center gap-2.5 mb-5">
                    <span
                      className="h-8 w-8 rounded-xl flex items-center justify-center text-white shadow-sm"
                      style={{ backgroundColor: sec.color }}
                    >
                      <SecIcon className="h-4 w-4" />
                    </span>
                    <h2 className="text-xl font-bold text-gray-900">
                      {sec.title} ({sec.list.length})
                    </h2>
                  </div>

                  {sec.list.length === 0 ? (
                    <div className="bg-white/80 rounded-2xl p-8 text-center text-sm text-gray-500 border border-gray-100">
                      Nenhum registro encontrado nesta categoria para o período selecionado.
                    </div>
                  ) : (
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {sec.list.map((item, idx) => (
                        <ProductionItemCard
                          key={item.id || `${item.cleanTitle}-${item.year}-${idx}`}
                          item={item}
                          tipo={tipo}
                        />
                      ))}
                    </ul>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Registros encontrados ({filteredItems.length})
              </h2>
            </div>

            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleItems.map((item, idx) => (
                <ProductionItemCard
                  key={item.id || `${item.cleanTitle}-${item.year}-${idx}`}
                  item={item}
                  tipo={tipo}
                />
              ))}
            </ul>

            {visibleCount < filteredItems.length && (
              <div className="mt-8 text-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + 24)}
                  className="inline-flex items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 text-sm font-semibold shadow-md transition-all"
                >
                  Mostrar mais ({filteredItems.length - visibleCount} restantes)
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  )
}
