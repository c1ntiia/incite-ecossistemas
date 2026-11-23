import { useEffect, useState } from 'react'
import { api } from '@/api'
import {
  cleanArticleTitle,
  deduplicateProductions,
} from '@/hooks/useBibliographicProduction'

export const CoresQualis = {
  A1: '#006837',
  A2: '#8fc53e',
  A3: '#acc483',
  A4: '#bdc4b1',
  B1: '#f15a24',
  B2: '#f5831f',
  B3: '#f4ad78',
  B4: '#f4a992',
  C: '#ec1c22',
  SQ: '#560b11',
  Livro: '#059669',
  Capitulo: '#89274d',
  Software: '#0ea5e9',
  Patente: '#059669',
  Marca: '#f59e0b',
  Relatorio: '#6366f1',
  IniciacaoCientifica: '#10b981',
  DissertacaoDeMestrado: '#0284c7',
  TeseDeDoutorado: '#0f766e',
  TCCGraduacao: '#38bdf8',
  Monografia: '#f59e0b',
  SupervisaoPos: '#6366f1',
}

export const formatoChartArtigo = {
  A1: { label: 'Qualis A1', color: CoresQualis.A1 },
  A2: { label: 'Qualis A2', color: CoresQualis.A2 },
  A3: { label: 'Qualis A3', color: CoresQualis.A3 },
  A4: { label: 'Qualis A4', color: CoresQualis.A4 },
  B1: { label: 'Qualis B1', color: CoresQualis.B1 },
  B2: { label: 'Qualis B2', color: CoresQualis.B2 },
  B3: { label: 'Qualis B3', color: CoresQualis.B3 },
  B4: { label: 'Qualis B4', color: CoresQualis.B4 },
  C: { label: 'Qualis C', color: CoresQualis.C },
  SQ: { label: 'Sem Qualis', color: CoresQualis.SQ },
}

export const formatoChartCapituloLivros = {
  Livro: { label: 'Livros', color: CoresQualis.Livro },
  Capitulo: { label: 'Capítulos de Livros', color: CoresQualis.Capitulo },
}

export const formatoChartProducaoTecnica = {
  Software: { label: 'Softwares', color: CoresQualis.Software },
  Patente: { label: 'Patentes', color: CoresQualis.Patente },
  Marca: { label: 'Marcas', color: CoresQualis.Marca },
  Relatorio: { label: 'Relatórios Técnicos', color: CoresQualis.Relatorio },
}

export const formatoChartOrientacoes = {
  IniciacaoCientifica: { label: 'Iniciação Científica', color: CoresQualis.IniciacaoCientifica },
  DissertacaoDeMestrado: { label: 'Dissertação de Mestrado', color: CoresQualis.DissertacaoDeMestrado },
  TeseDeDoutorado: { label: 'Tese de Doutorado', color: CoresQualis.TeseDeDoutorado },
  TCCGraduacao: { label: 'TCC - Graduação', color: CoresQualis.TCCGraduacao },
  Monografia: { label: 'Monografia / Especialização', color: CoresQualis.Monografia },
  SupervisaoPos: { label: 'Pós-Doutorado', color: CoresQualis.SupervisaoPos },
}

function classifyGuidanceNature(nature = '') {
  const n = String(nature)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
  if (n.includes('iniciacao')) return 'IniciacaoCientifica'
  if (n.includes('mestrado') || n.includes('dissertacao')) return 'DissertacaoDeMestrado'
  if (n.includes('doutorado') && n.includes('pos')) return 'SupervisaoPos'
  if (n.includes('doutorado') || n.includes('tese')) return 'TeseDeDoutorado'
  if (n.includes('conclusao') || n.includes('graduacao') || n.includes('tcc')) return 'TCCGraduacao'
  return 'Monografia'
}

function extractArray(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.data)) return data.data
  if (Array.isArray(data?.items)) return data.items
  return []
}

// Busca todas as páginas (100 itens por página) de qualquer endpoint paginado da API
async function fetchAllPages(buildRequest, signal) {
  let todosOsDados = []
  let paginaAtual = 1
  let temMaisDados = true
  const seenKeys = new Set()

  while (temMaisDados) {
    const { url, params } = buildRequest(paginaAtual)
    const { data } = await api.get(url, { params, signal })
    const arrayDados = extractArray(data)

    if (!arrayDados || arrayDados.length === 0) {
      break
    }

    // Evita repetição caso algum endpoint ignore o parâmetro page
    const firstItem = arrayDados[0]
    const firstKey =
      firstItem?.id || `${firstItem?.title || ''}-${firstItem?.year || ''}-${firstItem?.name || ''}`
    if (paginaAtual > 1 && firstKey && seenKeys.has(firstKey)) {
      break
    }
    if (firstKey) seenKeys.add(firstKey)

    todosOsDados = [...todosOsDados, ...arrayDados]

    if (arrayDados.length < 100) {
      temMaisDados = false
    } else {
      paginaAtual++
    }
  }

  return todosOsDados
}

// Busca todas as páginas de artigos (100 por página) para todos os pesquisadores ou para um pesquisador
export async function getQualisTodosPesquisadoresNosAnos(
  ano = '2016',
  filtroQualis = [],
  idPesquisador = '',
  signal,
) {
  const listaQualis =
    Array.isArray(filtroQualis) && filtroQualis.length > 0
      ? filtroQualis.join(';')
      : ''

  const todosOsDados = await fetchAllPages(
    (paginaAtual) => ({
      url:
        `bibliographic_production_researcher?terms=&researcher_id=${idPesquisador || ''}` +
        `&type=ARTICLE&qualis=${listaQualis}&year=${ano || ''}&page=${paginaAtual}`,
    }),
    signal,
  )

  const mapped = todosOsDados.map((item) => {
    const rawQualis = String(item.qualis || 'SQ').toUpperCase().trim()
    const normalizedQualis = formatoChartArtigo[rawQualis] ? rawQualis : 'SQ'
    return {
      ...item,
      qualis: normalizedQualis,
      year: Number(item.year) || item.year,
      cleanTitle: cleanArticleTitle(item.title),
      researcherName: item.researcher || item.name || '',
      subtipo: 'Artigo Científico',
    }
  })

  return deduplicateProductions(mapped)
}

// Busca produções de acordo com a aba selecionada (paginando todos os registros)
export async function getProducoesPorTipo(
  tipo = 'artigos',
  ano = '2016',
  filtroQualis = [],
  idPesquisador = '',
  signal,
) {
  if (tipo === 'artigos') {
    return getQualisTodosPesquisadoresNosAnos(ano, filtroQualis, idPesquisador, signal)
  }

  const anoParam = ano || '2014'
  const rId = idPesquisador || ''

  const buildBaseParams = (page) => {
    const p = { terms: '', year: anoParam, page }
    if (idPesquisador) p.researcher_id = idPesquisador
    return p
  }

  if (tipo === 'livrosECapitulos') {
    const [booksRes, chaptersRes] = await Promise.allSettled([
      fetchAllPages(
        (page) => ({
          url: `book_production_researcher?researcher_id=${rId}&year=${anoParam}&term=&page=${page}`,
        }),
        signal,
      ),
      fetchAllPages(
        (page) => ({
          url: `book_chapter_production_researcher?researcher_id=${rId}&year=${anoParam}&term=&distinct=0&page=${page}`,
        }),
        signal,
      ),
    ])

    const books =
      booksRes.status === 'fulfilled'
        ? booksRes.value.map((item) => ({
            ...item,
            year: Number(item.year) || item.year,
            cleanTitle: cleanArticleTitle(item.title),
            researcherName: item.name || item.researcher || '',
            subtipo: 'Livro',
            qualis: 'A1',
            categoriaGrafico: 'Livro',
          }))
        : []

    const chapters =
      chaptersRes.status === 'fulfilled'
        ? chaptersRes.value.map((item) => ({
            ...item,
            year: Number(item.year) || item.year,
            cleanTitle: cleanArticleTitle(item.title),
            researcherName: item.name || item.researcher || '',
            subtipo: 'Capítulo de Livro',
            qualis: 'A1',
            categoriaGrafico: 'Capitulo',
          }))
        : []

    const list = [...books, ...chapters].filter(
      (item) => !ano || !Number(item.year) || Number(item.year) >= Number(ano),
    )
    return deduplicateProductions(list)
  }

  if (tipo === 'producaoTecnica') {
    const [patentsRes, softwareRes, brandRes, reportRes] = await Promise.allSettled([
      fetchAllPages(
        (page) => {
          const params = { per_page: 100, page }
          if (anoParam) params.year_start = anoParam
          if (idPesquisador) params.researcher_id = idPesquisador
          return { url: 'v2/production/patent', params }
        },
        signal,
      ),
      fetchAllPages((page) => ({ url: 'production/software', params: buildBaseParams(page) }), signal),
      fetchAllPages((page) => ({ url: 'production/brand', params: buildBaseParams(page) }), signal),
      fetchAllPages((page) => ({ url: 'production/report', params: buildBaseParams(page) }), signal),
    ])

    const patents =
      patentsRes.status === 'fulfilled'
        ? patentsRes.value.map((item) => {
            const platformAuthors = Array.isArray(item.platform_authors)
              ? item.platform_authors
              : []
            const firstAuthor = platformAuthors[0] || null
            const researchers = platformAuthors.map((a) => ({
              id: a.id || a.researcher_id || '',
              name: a.name || '',
              lattes_id: a.lattes_id || '',
            }))
            return {
              ...item,
              year: Number(item.year) || item.year,
              cleanTitle: cleanArticleTitle(item.title),
              researchers: researchers.length > 0 ? researchers : undefined,
              researcherName:
                researchers.map((r) => r.name).filter(Boolean).join(', ') ||
                item.name ||
                firstAuthor?.name ||
                item.researcher ||
                '',
              researcher_id: item.researcher_id || firstAuthor?.id || item.researcher || '',
              lattes_id: item.lattes_id || firstAuthor?.lattes_id || '',
              subtipo: 'Patente',
              qualis: 'A1',
              categoriaGrafico: 'Patente',
            }
          })
        : []

    const softwares =
      softwareRes.status === 'fulfilled'
        ? softwareRes.value.map((item) => ({
            ...item,
            year: Number(item.year) || item.year,
            cleanTitle: cleanArticleTitle(item.title),
            researcherName: item.name || item.researcher || '',
            subtipo: 'Software',
            qualis: 'A1',
            categoriaGrafico: 'Software',
          }))
        : []

    const brands =
      brandRes.status === 'fulfilled'
        ? brandRes.value.map((item) => ({
            ...item,
            year: Number(item.year) || item.year,
            cleanTitle: cleanArticleTitle(item.title),
            researcherName: item.name || item.researcher || '',
            subtipo: 'Marca',
            qualis: 'A1',
            categoriaGrafico: 'Marca',
          }))
        : []

    const reports =
      reportRes.status === 'fulfilled'
        ? reportRes.value.map((item) => ({
            ...item,
            year: Number(item.year) || item.year,
            cleanTitle: cleanArticleTitle(item.title),
            researcherName: item.name || item.researcher || '',
            subtipo: 'Relatório Técnico',
            qualis: 'A1',
            categoriaGrafico: 'Relatorio',
          }))
        : []

    const list = [...softwares, ...patents, ...brands, ...reports].filter(
      (item) => !ano || !Number(item.year) || Number(item.year) >= Number(ano),
    )
    return deduplicateProductions(list)
  }

  if (tipo === 'relatorioTecnico') {
    const list = await fetchAllPages(
      (page) => ({ url: 'production/report', params: buildBaseParams(page) }),
      signal,
    )
    const mapped = list
      .map((item) => ({
        ...item,
        year: Number(item.year) || item.year,
        cleanTitle: cleanArticleTitle(item.title),
        researcherName: item.name || item.researcher || '',
        subtipo: 'Relatório Técnico',
        qualis: 'A1',
      }))
      .filter((item) => !ano || !Number(item.year) || Number(item.year) >= Number(ano))
    return deduplicateProductions(mapped)
  }

  if (tipo === 'orientacoes') {
    const list = await fetchAllPages(
      (page) => ({ url: 'production/guidance', params: buildBaseParams(page) }),
      signal,
    )
    const mapped = list
      .map((item) => ({
        ...item,
        year: Number(item.year) || item.year,
        cleanTitle: cleanArticleTitle(item.title),
        researcherName: item.name || item.researcher || '',
        subtipo: item.nature || 'Orientação',
        qualis: 'A1',
        categoriaGrafico: classifyGuidanceNature(item.nature),
      }))
      .filter((item) => !ano || !Number(item.year) || Number(item.year) >= Number(ano))
    return deduplicateProductions(mapped)
  }

  return []
}

export function useProductions({
  tipo = 'artigos',
  filtroAno = [new Date().getFullYear() - 10],
  filtroQualis = [],
  idPesquisador = '',
  enabled = true,
}) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(Boolean(enabled))
  const [error, setError] = useState(null)

  const anoInicial =
    Array.isArray(filtroAno) && filtroAno.length > 0
      ? String(filtroAno[0])
      : String(new Date().getFullYear() - 10)
  const qualisKey = Array.isArray(filtroQualis) ? filtroQualis.join(';') : ''

  useEffect(() => {
    if (!enabled) {
      return
    }

    const controller = new AbortController()
    const qualisList = qualisKey ? qualisKey.split(';') : []

    Promise.resolve()
      .then(() => {
        if (!controller.signal.aborted) {
          setLoading(true)
          setError(null)
        }
        return getProducoesPorTipo(tipo, anoInicial, qualisList, idPesquisador, controller.signal)
      })
      .then((list) => {
        const sorted = [...list].sort(
          (a, b) =>
            (Number(b.year) || 0) - (Number(a.year) || 0) ||
            String(a.cleanTitle || '').localeCompare(String(b.cleanTitle || ''), 'pt-BR'),
        )
        setItems(sorted)
      })
      .catch((err) => {
        if (controller.signal.aborted) return
        console.error('Erro ao buscar produções:', err)
        setError(err)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [enabled, tipo, anoInicial, qualisKey, idPesquisador])

  return {
    items: enabled ? items : [],
    loading: enabled ? loading : false,
    error: enabled ? error : null,
  }
}
