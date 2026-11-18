import { useEffect, useState } from 'react'
import { api } from '@/api'

// Remove tags HTML vindas do XML do Lattes (ex.: <p>, <em>, </strong>)
export function cleanArticleTitle(raw) {
  if (!raw) return ''
  return String(raw)
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

export function formatIssn(issn) {
  if (!issn) return null
  const clean = String(issn).replace(/[^0-9X]/gi, '').toUpperCase()
  if (clean.length === 8) {
    return `${clean.slice(0, 4)}-${clean.slice(4)}`
  }
  return issn
}

export async function getQualisPorPesquisadorNosAnos(
  id,
  ano = '',
  qualis = [],
  signal,
) {
  const listaQualis = Array.isArray(qualis) && qualis.length > 0 ? qualis.join(';') : ''
  let todosOsDados = []
  let paginaAtual = 1
  let temMaisDados = true

  while (temMaisDados) {
    const url =
      `bibliographic_production_researcher?terms=&researcher_id=${id || ''}` +
      `&type=ARTICLE&qualis=${listaQualis}&year=${ano || ''}&page=${paginaAtual}`

    const { data } = await api.get(url, { signal })
    const arrayDados = Array.isArray(data) ? data : []

    if (arrayDados.length === 0) {
      temMaisDados = false
    } else {
      todosOsDados = [...todosOsDados, ...arrayDados]
      if (arrayDados.length < 100) {
        temMaisDados = false
      }
      paginaAtual++
    }
  }

  return todosOsDados
}

// Busca todos os artigos de um pesquisador na API paginando até o fim
export function useBibliographicProduction(researcherId, lattesId, type = 'ARTICLE') {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(Boolean(researcherId || lattesId))
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!researcherId && !lattesId) {
      setArticles([])
      setLoading(false)
      return
    }

    const controller = new AbortController()
    setLoading(true)
    setError(null)

    getQualisPorPesquisadorNosAnos(researcherId || '', '', [], controller.signal)
      .then((list) => {
        const normalized = list
          .map((item) => ({
            ...item,
            cleanTitle: cleanArticleTitle(item.title),
            yearNum: Number(item.year) || 0,
          }))
          .sort((a, b) => b.yearNum - a.yearNum || a.cleanTitle.localeCompare(b.cleanTitle, 'pt-BR'))

        setArticles(normalized)
      })
      .catch((err) => {
        if (controller.signal.aborted) return
        console.error('Erro ao carregar produção bibliográfica:', err)
        setError(err)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [researcherId, lattesId, type])

  return { articles, loading, error }
}
