import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  BookOpen,
  Building2,
  Calendar,
  Code,
  Copyright,
  Cpu,
  ExternalLink,
  FileText,
  GraduationCap,
  Search,
  Sparkles,
  Star,
  Tag,
} from 'lucide-react'
import ResearcherAvatar from '@/components/ResearcherAvatar'
import GraficoChart from '@/components/GraficoChart'
import { Button } from '@/components/ui/button'
import { getLattesUrl, normalizeText, researchers as localResearchers } from '@/data/researchers'
import { useResearchers } from '@/hooks/useResearchers'
import { formatIssn, useBibliographicProduction } from '@/hooks/useBibliographicProduction'
import { CoresQualis, useProductions } from '@/hooks/useProductions'

const QUALIS_STYLES = {
  A1: 'bg-emerald-600 text-white border-emerald-700',
  A2: 'bg-emerald-500 text-white border-emerald-600',
  A3: 'bg-teal-500 text-white border-teal-600',
  A4: 'bg-teal-400 text-teal-950 border-teal-500',
  B1: 'bg-sky-500 text-white border-sky-600',
  B2: 'bg-sky-400 text-sky-950 border-sky-500',
  B3: 'bg-amber-400 text-amber-950 border-amber-500',
  B4: 'bg-amber-300 text-amber-950 border-amber-400',
  C: 'bg-gray-300 text-gray-800 border-gray-400',
  SQ: 'bg-gray-200 text-gray-700 border-gray-300',
}

function getQualisBadgeClass(qualis) {
  const key = String(qualis || '').toUpperCase().trim()
  return QUALIS_STYLES[key] || 'bg-gray-100 text-gray-700 border-gray-200'
}

function formatDatePtBr(dateStr) {
  if (!dateStr) return null
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function ResearcherPanel() {
  const { id } = useParams()
  const { researchers: apiResearchers, loading: loadingResearcher } = useResearchers()

  const [activeTab, setActiveTab] = useState('artigos')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedQualis, setSelectedQualis] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [expandAbstract, setExpandAbstract] = useState(false)

  // Procura na lista da API (que tem id UUID + resumo + titulação) e faz fallback para a lista local
  const researcher = useMemo(() => {
    const normalizedParam = String(id || '').toLowerCase()
    const fromApi = apiResearchers.find(
      (r) =>
        String(r.id || '').toLowerCase() === normalizedParam ||
        String(r.lattes_id || '').toLowerCase() === normalizedParam,
    )
    if (fromApi) return fromApi

    return (
      localResearchers.find(
        (r) =>
          String(r.id || '').toLowerCase() === normalizedParam ||
          String(r.lattes_id || '').toLowerCase() === normalizedParam,
      ) || null
    )
  }, [id, apiResearchers])

  const {
    articles,
    loading: loadingArticles,
    error: articlesError,
  } = useBibliographicProduction(researcher?.id, researcher?.lattes_id, 'ARTICLE')

  const { items: booksAndChapters, loading: loadingBooks } = useProductions({
    tipo: 'livrosECapitulos',
    filtroAno: [2014],
    idPesquisador: researcher?.id || '',
  })

  const { items: techProductions, loading: loadingTech } = useProductions({
    tipo: 'producaoTecnica',
    filtroAno: [2014],
    idPesquisador: researcher?.id || '',
  })

  // Opções únicas de Qualis e Ano para os filtros de artigos
  const availableQualis = useMemo(() => {
    const set = new Set()
    articles.forEach((a) => {
      if (a.qualis) set.add(String(a.qualis).toUpperCase().trim())
    })
    return Array.from(set).sort()
  }, [articles])

  const availableYears = useMemo(() => {
    const set = new Set()
    articles.forEach((a) => {
      if (a.year) set.add(String(a.year))
    })
    return Array.from(set).sort((a, b) => Number(b) - Number(a))
  }, [articles])

  // Lista filtrada de artigos
  const filteredArticles = useMemo(() => {
    const q = normalizeText(searchQuery.trim())
    return articles.filter((article) => {
      const matchesQuery =
        !q ||
        normalizeText(article.cleanTitle || '').includes(q) ||
        normalizeText(article.magazine || '').includes(q) ||
        normalizeText(article.doi || '').includes(q)

      const matchesQualis =
        !selectedQualis ||
        String(article.qualis || '').toUpperCase().trim() === selectedQualis

      const matchesYear = !selectedYear || String(article.year || '') === selectedYear

      return matchesQuery && matchesQualis && matchesYear
    })
  }, [articles, searchQuery, selectedQualis, selectedYear])

  // Contadores de livros, capítulos e produção técnica (softwares, patentes, marcas)
  const counts = useMemo(() => {
    const livros = booksAndChapters.filter((i) => i.categoriaGrafico === 'Livro')
    const capitulos = booksAndChapters.filter((i) => i.categoriaGrafico === 'Capitulo')
    const softwares = techProductions.filter((i) => i.categoriaGrafico === 'Software')
    const patentes = techProductions.filter((i) => i.categoriaGrafico === 'Patente')
    const marcas = techProductions.filter((i) => i.categoriaGrafico === 'Marca')
    return { livros, capitulos, softwares, patentes, marcas }
  }, [booksAndChapters, techProductions])

  // Estatísticas rápidas dos artigos do pesquisador
  const stats = useMemo(() => {
    const total = articles.length
    const magazines = new Set(
      articles.map((a) => (a.magazine ? a.magazine.trim().toLowerCase() : null)).filter(Boolean),
    ).size
    const latestYear = availableYears[0] || '—'

    return { total, magazines, latestYear }
  }, [articles, availableYears])

  if (loadingResearcher && !researcher) {
    return (
      <main className="max-w-7xl mx-auto px-6 lg:px-16 py-12 text-gray-800">
        <div className="h-64 rounded-[2.5rem] bg-white/80 shadow-md animate-pulse mb-8" />
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 rounded-[2rem] bg-white/80 shadow-sm animate-pulse" />
          ))}
        </div>
      </main>
    )
  }

  if (!researcher) {
    return (
      <main className="max-w-7xl mx-auto px-6 lg:px-16 py-16 text-center text-gray-800">
        <div className="bg-white/90 rounded-[2.5rem] p-12 shadow-md max-w-xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">Pesquisador não encontrado</h1>
          <p className="mt-2 text-gray-600">
            Não encontramos um pesquisador correspondente ao identificador informado.
          </p>
          <Button asChild className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6">
            <Link to="/Home">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para pesquisadores
            </Link>
          </Button>
        </div>
      </main>
    )
  }

  const lattesUpdatedFormatted = formatDatePtBr(researcher.lattes_update)
  const abstractText = researcher.abstract || researcher.abstract_ai || ''
  const isLongAbstract = abstractText.length > 420

  return (
    <main className="max-w-7xl mx-auto px-6 lg:px-16 py-10 text-gray-800">
      {/* Navegação superior */}
      <div className="mb-6">
        <Link
          to="/pesquisadores"
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800 bg-white/80 hover:bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200/80 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para pesquisadores
        </Link>
      </div>

      {/* Cabeçalho do Painel do Pesquisador */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-white/95 border border-emerald-100 p-8 sm:p-10 shadow-lg mb-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gradient-to-br from-emerald-300/25 to-sky-300/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-lime-300/20 blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
          <ResearcherAvatar
            researcher={researcher}
            className="h-28 w-28 sm:h-36 sm:w-36 text-3xl sm:text-4xl shrink-0 shadow-xl ring-4 ring-emerald-50"
          />

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-3">
              {researcher.institution && (
                <span
                  className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1 rounded-full text-xs font-semibold"
                  title={researcher.institution.name}
                >
                  <Building2 className="h-3.5 w-3.5 text-emerald-600" />
                  {researcher.institution.acronym}
                  {researcher.institution.name ? ` — ${researcher.institution.name}` : ''}
                </span>
              )}

              {researcher.graduation && (
                <span className="inline-flex items-center gap-1.5 bg-sky-50 text-sky-800 border border-sky-200 px-3.5 py-1 rounded-full text-xs font-semibold">
                  <GraduationCap className="h-3.5 w-3.5 text-sky-600" />
                  {researcher.graduation}
                </span>
              )}

              {lattesUpdatedFormatted && (
                <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">
                  <Calendar className="h-3.5 w-3.5 text-gray-500" />
                  Atualizado em {lattesUpdatedFormatted}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              {researcher.name}
            </h1>

            {researcher.area && (
              <p className="mt-1.5 text-sm text-gray-600 font-medium">
                Área: {researcher.area.replaceAll('_', ' ')}
              </p>
            )}

            {/* Links externos (Lattes / ORCID) */}
            <div className="mt-5 flex flex-wrap items-center justify-center md:justify-start gap-3">
              {researcher.lattes_id && (
                <a
                  href={getLattesUrl(researcher)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 text-sm font-semibold shadow-sm transition-all"
                >
                  Currículo Lattes
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}

              {researcher.orcid && (
                <a
                  href={`https://orcid.org/${researcher.orcid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-5 py-2.5 text-sm font-semibold shadow-sm transition-all"
                >
                  ORCID: {researcher.orcid}
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Resumo do Pesquisador */}
        {abstractText && (
          <div className="relative z-10 mt-8 pt-6 border-t border-gray-100">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-emerald-700 mb-2">
              Resumo Profissional
            </h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed text-justify">
              {isLongAbstract && !expandAbstract
                ? `${abstractText.slice(0, 420).trim()}...`
                : abstractText}
            </p>
            {isLongAbstract && (
              <button
                type="button"
                onClick={() => setExpandAbstract((prev) => !prev)}
                className="mt-2 text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
              >
                {expandAbstract ? 'Mostrar menos' : 'Ler resumo completo'}
              </button>
            )}
          </div>
        )}
      </section>

      {/* Total de produções técnicas e científicas (igual ao projeto npai) */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
        <div className="bg-white/90 rounded-[2rem] p-5 shadow-sm border border-gray-100 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              Artigos
            </p>
            <p className="text-xl font-bold text-gray-900">
              {loadingArticles ? '...' : stats.total}
            </p>
          </div>
        </div>

        <div className="bg-white/90 rounded-[2rem] p-5 shadow-sm border border-gray-100 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              Livros
            </p>
            <p className="text-xl font-bold text-gray-900">
              {loadingBooks ? '...' : counts.livros.length}
            </p>
          </div>
        </div>

        <div className="bg-white/90 rounded-[2rem] p-5 shadow-sm border border-gray-100 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center shrink-0">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              Capítulos
            </p>
            <p className="text-xl font-bold text-gray-900">
              {loadingBooks ? '...' : counts.capitulos.length}
            </p>
          </div>
        </div>

        <div className="bg-white/90 rounded-[2rem] p-5 shadow-sm border border-gray-100 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Copyright className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              Patentes
            </p>
            <p className="text-xl font-bold text-gray-900">
              {loadingTech ? '...' : counts.patentes.length}
            </p>
          </div>
        </div>

        <div className="bg-white/90 rounded-[2rem] p-5 shadow-sm border border-gray-100 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Tag className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              Marcas
            </p>
            <p className="text-xl font-bold text-gray-900">
              {loadingTech ? '...' : counts.marcas.length}
            </p>
          </div>
        </div>

        <div className="bg-white/90 rounded-[2rem] p-5 shadow-sm border border-gray-100 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
            <Code className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              Softwares
            </p>
            <p className="text-xl font-bold text-gray-900">
              {loadingTech ? '...' : counts.softwares.length}
            </p>
          </div>
        </div>
      </section>

      {/* Abas do Pesquisador: Artigos | Livros e Capítulos | Produção Técnica */}
      <div className="flex flex-wrap gap-2 mb-8">
        {[
          { id: 'artigos', label: 'Artigos', icon: FileText },
          { id: 'livrosECapitulos', label: 'Livros e Capítulos', icon: BookOpen },
          { id: 'producaoTecnica', label: 'Produção Técnica', icon: Cpu },
        ].map((tab) => {
          const Icon = tab.icon
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
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

      {activeTab === 'artigos' && (
        <>
          {/* Gráfico de Evolução Anual dos Artigos do Pesquisador */}
          {!loadingArticles && articles.length > 0 && (
            <section className="mb-10">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-800">
                  Gráfico — Quantidade de Qualis/Ano
                </h2>
                <span className="text-xs text-gray-500">
                  Passe o mouse sobre as barras para detalhes
                </span>
              </div>
              <GraficoChart tipo="artigos" items={filteredArticles} />
            </section>
          )}

          {/* Seção de Listagem de Artigos */}
          <section>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700 mb-1">
                  Produção Bibliográfica
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
                  Artigos publicados
                </h2>
              </div>

              {!loadingArticles && articles.length > 0 && (
                <p className="text-sm text-gray-500">
                  Exibindo <strong>{filteredArticles.length}</strong> de{' '}
                  <strong>{articles.length}</strong>{' '}
                  {articles.length === 1 ? 'artigo' : 'artigos'}
                </p>
              )}
            </div>

            {/* Barra de busca e filtros de artigos */}
            {articles.length > 0 && (
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                <label className="relative flex-1">
                  <span className="sr-only">Buscar artigo por título, revista ou DOI</span>
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por título, periódico ou DOI..."
                    className="w-full rounded-full border border-gray-200 bg-white/90 py-3 pl-12 pr-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </label>

                {availableQualis.length > 0 && (
                  <label className="md:w-48">
                    <span className="sr-only">Filtrar por Qualis</span>
                    <select
                      value={selectedQualis}
                      onChange={(e) => setSelectedQualis(e.target.value)}
                      className="w-full rounded-full border border-gray-200 bg-white/90 py-3 px-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">Todos os Qualis</option>
                      {availableQualis.map((q) => (
                        <option key={q} value={q}>
                          Qualis {q}
                        </option>
                      ))}
                    </select>
                  </label>
                )}

                {availableYears.length > 0 && (
                  <label className="md:w-44">
                    <span className="sr-only">Filtrar por ano</span>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="w-full rounded-full border border-gray-200 bg-white/90 py-3 px-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">Todos os anos</option>
                      {availableYears.map((year) => (
                        <option key={year} value={year}>
                          Ano {year}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
              </div>
            )}

            {/* Estados de Carregamento / Erro / Vazio / Lista */}
            {loadingArticles ? (
              <div className="space-y-4" aria-busy="true">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-36 rounded-[2rem] bg-white/80 shadow-sm border border-gray-100 animate-pulse p-6"
                  />
                ))}
              </div>
            ) : articlesError ? (
              <div className="bg-white/90 rounded-[2rem] p-10 text-center shadow-sm border border-red-100">
                <p className="text-gray-700 font-medium">
                  Não foi possível carregar os artigos deste pesquisador no momento.
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Verifique a conexão com a API de produção bibliográfica.
                </p>
              </div>
            ) : !researcher.id ? (
              <div className="bg-white/90 rounded-[2rem] p-10 text-center shadow-sm border border-gray-100">
                <p className="text-gray-600">
                  Sincronizando dados do pesquisador com a base científica...
                </p>
              </div>
            ) : articles.length === 0 ? (
              <div className="bg-white/90 rounded-[2rem] p-12 text-center shadow-sm border border-gray-100">
                <FileText className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">
                  Nenhum artigo registrado na base para este pesquisador.
                </p>
              </div>
            ) : filteredArticles.length === 0 ? (
              <div className="bg-white/90 rounded-[2rem] p-12 text-center shadow-sm border border-gray-100">
                <p className="text-gray-600">
                  Nenhum artigo corresponde aos filtros selecionados.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedQualis('')
                    setSelectedYear('')
                  }}
                  className="mt-3 text-sm font-semibold text-emerald-700 hover:underline"
                >
                  Limpar filtros
                </button>
              </div>
            ) : (
              <ul className="space-y-4">
                {filteredArticles.map((article) => {
                  const formattedIssn = formatIssn(article.issn)
                  const doiUrl = article.doi
                    ? article.doi.startsWith('http')
                      ? article.doi
                      : `https://doi.org/${article.doi}`
                    : null

                  return (
                    <li
                      key={article.id || `${article.cleanTitle}-${article.year}`}
                      className="bg-white/95 rounded-[2rem] p-6 sm:p-7 shadow-sm border border-gray-100 hover:shadow-md hover:border-emerald-200/80 transition-all duration-200"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <div className="flex flex-wrap items-center gap-2">
                          {article.year && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-0.5 text-xs font-bold">
                              <Calendar className="h-3 w-3" />
                              {article.year}
                            </span>
                          )}

                          {article.qualis && (
                            <span
                              className={`inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-bold ${getQualisBadgeClass(
                                article.qualis,
                              )}`}
                            >
                              Qualis {article.qualis}
                            </span>
                          )}

                          {article.relevance && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 px-3 py-0.5 text-xs font-semibold">
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
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50/70 hover:bg-emerald-100/80 px-3.5 py-1.5 rounded-full transition-colors"
                          >
                            DOI: {article.doi}
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
                        {article.cleanTitle || article.title}
                      </h3>

                      <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-gray-600">
                        {article.magazine && (
                          <span className="inline-flex items-center gap-1.5 font-medium text-gray-700">
                            <BookOpen className="h-4 w-4 text-emerald-600 shrink-0" />
                            {article.magazine}
                          </span>
                        )}

                        {formattedIssn && (
                          <span className="text-gray-500">
                            ISSN:{' '}
                            <strong className="font-medium text-gray-700">{formattedIssn}</strong>
                          </span>
                        )}

                        {article.jif && article.jif !== 'None' && (
                          <span className="text-gray-500">
                            Fator de Impacto (JIF):{' '}
                            <strong className="font-medium text-gray-700">{article.jif}</strong>
                          </span>
                        )}

                        {article.authors && (
                          <span className="text-gray-500 line-clamp-1">
                            Autores: {article.authors}
                          </span>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>
        </>
      )}

      {activeTab === 'livrosECapitulos' && (
        <section className="space-y-10">
          {booksAndChapters.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-3">
                Gráfico detalhado — Quantidade de Livros e Capítulos/Ano
              </h2>
              <GraficoChart tipo="livrosECapitulos" items={booksAndChapters} />
            </div>
          )}

          {/* Capítulos de Livros */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-rose-700" />
              Todos os Capítulos de Livros ({counts.capitulos.length})
            </h3>
            {counts.capitulos.length === 0 ? (
              <div className="bg-white/90 rounded-[2rem] p-8 text-center text-gray-500 border border-gray-100">
                Não há produção de capítulos de livros registrada para este pesquisador.
              </div>
            ) : (
              <ul className="space-y-4">
                {counts.capitulos.map((cap, i) => (
                  <li
                    key={cap.id || i}
                    className="bg-white/95 rounded-[2rem] p-6 shadow-sm border border-gray-100"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {cap.year && (
                        <span className="rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-0.5 text-xs font-bold">
                          {cap.year}
                        </span>
                      )}
                      <span
                        className="rounded-full px-3 py-0.5 text-xs font-bold text-white"
                        style={{ backgroundColor: CoresQualis.Capitulo }}
                      >
                        Capítulo de Livro
                      </span>
                    </div>
                    <h4 className="font-bold text-gray-900">{cap.cleanTitle || cap.title}</h4>
                    <div className="mt-2 flex flex-wrap gap-4 text-xs text-gray-600">
                      {cap.publishing_company && <span>Editora: {cap.publishing_company}</span>}
                      {cap.isbn && <span>ISBN: {cap.isbn}</span>}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Livros */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-emerald-700" />
              Todos os Livros ({counts.livros.length})
            </h3>
            {counts.livros.length === 0 ? (
              <div className="bg-white/90 rounded-[2rem] p-8 text-center text-gray-500 border border-gray-100">
                Não há produção de livros registrada para este pesquisador.
              </div>
            ) : (
              <ul className="space-y-4">
                {counts.livros.map((liv, i) => (
                  <li
                    key={liv.id || i}
                    className="bg-white/95 rounded-[2rem] p-6 shadow-sm border border-gray-100"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {liv.year && (
                        <span className="rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-0.5 text-xs font-bold">
                          {liv.year}
                        </span>
                      )}
                      <span
                        className="rounded-full px-3 py-0.5 text-xs font-bold text-white"
                        style={{ backgroundColor: CoresQualis.Livro }}
                      >
                        Livro
                      </span>
                    </div>
                    <h4 className="font-bold text-gray-900">{liv.cleanTitle || liv.title}</h4>
                    <div className="mt-2 flex flex-wrap gap-4 text-xs text-gray-600">
                      {liv.publishing_company && <span>Editora: {liv.publishing_company}</span>}
                      {liv.isbn && <span>ISBN: {liv.isbn}</span>}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      {activeTab === 'producaoTecnica' && (
        <section className="space-y-10">
          {techProductions.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-3">
                Gráfico detalhado — Softwares, Patentes e Marcas por Ano
              </h2>
              <GraficoChart tipo="producaoTecnica" items={techProductions} />
            </div>
          )}

          {/* Softwares */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Code className="h-5 w-5 text-sky-600" />
              Softwares ({counts.softwares.length})
            </h3>
            {counts.softwares.length === 0 ? (
              <div className="bg-white/90 rounded-[2rem] p-8 text-center text-gray-500 border border-gray-100">
                Nenhum software registrado para este pesquisador.
              </div>
            ) : (
              <ul className="space-y-4">
                {counts.softwares.map((sw, i) => (
                  <li
                    key={sw.id || i}
                    className="bg-white/95 rounded-[2rem] p-6 shadow-sm border border-gray-100"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {sw.year && (
                        <span className="rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-0.5 text-xs font-bold">
                          {sw.year}
                        </span>
                      )}
                      <span
                        className="rounded-full px-3 py-0.5 text-xs font-bold text-white"
                        style={{ backgroundColor: CoresQualis.Software }}
                      >
                        Software
                      </span>
                    </div>
                    <h4 className="font-bold text-gray-900">{sw.cleanTitle || sw.title}</h4>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Patentes */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Copyright className="h-5 w-5 text-emerald-600" />
              Patentes ({counts.patentes.length})
            </h3>
            {counts.patentes.length === 0 ? (
              <div className="bg-white/90 rounded-[2rem] p-8 text-center text-gray-500 border border-gray-100">
                Nenhuma patente registrada para este pesquisador.
              </div>
            ) : (
              <ul className="space-y-4">
                {counts.patentes.map((pat, i) => (
                  <li
                    key={pat.id || i}
                    className="bg-white/95 rounded-[2rem] p-6 shadow-sm border border-gray-100"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {pat.year && (
                        <span className="rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-0.5 text-xs font-bold">
                          {pat.year}
                        </span>
                      )}
                      <span
                        className="rounded-full px-3 py-0.5 text-xs font-bold text-white"
                        style={{ backgroundColor: CoresQualis.Patente }}
                      >
                        Patente
                      </span>
                    </div>
                    <h4 className="font-bold text-gray-900">{pat.cleanTitle || pat.title}</h4>
                    {pat.code && (
                      <p className="mt-1 text-xs text-gray-500">Código: {pat.code}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Marcas */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Tag className="h-5 w-5 text-amber-600" />
              Marcas ({counts.marcas.length})
            </h3>
            {counts.marcas.length === 0 ? (
              <div className="bg-white/90 rounded-[2rem] p-8 text-center text-gray-500 border border-gray-100">
                Nenhuma marca registrada para este pesquisador.
              </div>
            ) : (
              <ul className="space-y-4">
                {counts.marcas.map((brand, i) => (
                  <li
                    key={brand.id || i}
                    className="bg-white/95 rounded-[2rem] p-6 shadow-sm border border-gray-100"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {brand.year && (
                        <span className="rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-0.5 text-xs font-bold">
                          {brand.year}
                        </span>
                      )}
                      <span
                        className="rounded-full px-3 py-0.5 text-xs font-bold text-white"
                        style={{ backgroundColor: CoresQualis.Marca }}
                      >
                        Marca
                      </span>
                    </div>
                    <h4 className="font-bold text-gray-900">{brand.cleanTitle || brand.title}</h4>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}
    </main>
  )
}
