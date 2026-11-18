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

async function fetchBibliographicProduction(params, signal) {
  const endpoints = [
    'bibliographic_production_researcher',
    'bibliographic_production_article',
    'bibliographic_production',
  ]

  let lastError = null
  for (const endpoint of endpoints) {
    try {
      const response = await api.get(endpoint, { params, signal })
      const data = response.data
      if (Array.isArray(data)) return data
      if (Array.isArray(data?.data)) return data.data
      if (Array.isArray(data?.items)) return data.items
      return []
    } catch (err) {
      if (signal?.aborted) throw err
      lastError = err
      const status = err?.response?.status
      // Se for 404, tenta o próximo alias do endpoint de produção bibliográfica
      if (status && status !== 404) {
        break
      }
    }
  }

  throw lastError || new Error('Não foi possível carregar a produção bibliográfica.')
}

// Busca os artigos de um pesquisador na API (bibliographic_production)
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

    const params = {
      terms: '',
      type,
    }
    if (researcherId) params.researcher_id = researcherId
    if (lattesId && !researcherId) params.lattes_id = lattesId

    fetchBibliographicProduction(params, controller.signal)
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
