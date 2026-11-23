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

export const QUALIS_PRIORITY = {
  A1: 10,
  A2: 9,
  A3: 8,
  A4: 7,
  B1: 6,
  B2: 5,
  B3: 4,
  B4: 3,
  C: 2,
  SQ: 1,
}

export function normalizeTitleForDedup(title = '') {
  return String(title || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function normalizeDoi(doi = '') {
  if (!doi) return ''
  return String(doi)
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\/(dx\.)?doi\.org\//, '')
    .replace(/[/?#]+$/, '')
    .trim()
}

export function normalizeMagazine(mag = '') {
  return String(mag || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w]/g, '')
}

// Unifica produções idênticas registradas por múltiplos coautores da rede ou duplicadas no Lattes
export function deduplicateProductions(items) {
  if (!Array.isArray(items) || items.length === 0) return []

  const result = []
  const doiIndex = new Map()
  const codeIndex = new Map()
  const titleTypeYearIndex = new Map()
  const titleTypeIndex = new Map()

  for (const rawItem of items) {
    const cleanTitle = rawItem.cleanTitle || cleanArticleTitle(rawItem.title)
    const normTitle = normalizeTitleForDedup(cleanTitle)
    const cleanDoi = normalizeDoi(rawItem.doi)
    const cleanCode = rawItem.code ? String(rawItem.code).trim().toLowerCase() : ''
    const cleanIsbn = rawItem.isbn
      ? String(rawItem.isbn).replace(/[^0-9X]/gi, '').toUpperCase()
      : ''
    const type = rawItem.categoriaGrafico || rawItem.subtipo || ''
    const year = Number(rawItem.year) || (rawItem.year ? String(rawItem.year).trim() : '')
    const itemMag = normalizeMagazine(rawItem.magazine)

    let matchIdx = -1

    // 1. Match por DOI
    if (cleanDoi && doiIndex.has(cleanDoi)) {
      matchIdx = doiIndex.get(cleanDoi)
    }

    // 2. Match por Código / Patente / ISBN
    if (matchIdx === -1 && cleanCode && codeIndex.has(`code:${cleanCode}`)) {
      matchIdx = codeIndex.get(`code:${cleanCode}`)
    }
    if (
      matchIdx === -1 &&
      cleanIsbn &&
      cleanIsbn.length >= 8 &&
      codeIndex.has(`isbn:${cleanIsbn}`)
    ) {
      matchIdx = codeIndex.get(`isbn:${cleanIsbn}`)
    }

    // 3. Match por título normalizado + tipo + ano
    if (matchIdx === -1 && normTitle.length >= 8) {
      const typeYearKey = `${type}|${normTitle}|${year}`
      if (titleTypeYearIndex.has(typeYearKey)) {
        const potentialIdx = titleTypeYearIndex.get(typeYearKey)
        const existing = result[potentialIdx]
        const existingMag = normalizeMagazine(existing.magazine)

        // Se título for curto (< 25 caracteres) e ambas revistas forem conhecidas e diferentes, não agrupa
        if (normTitle.length < 25 && itemMag && existingMag && itemMag !== existingMag) {
          // Publicações distintas
        } else {
          matchIdx = potentialIdx
        }
      }
    }

    // 4. Fallback: títulos longos e específicos (>= 25 caracteres) com diferença de até 1 ano (ex.: online vs impresso)
    if (matchIdx === -1 && normTitle.length >= 25) {
      const typeKey = `${type}|${normTitle}`
      if (titleTypeIndex.has(typeKey)) {
        const potentialIdx = titleTypeIndex.get(typeKey)
        const existing = result[potentialIdx]
        const existingYear =
          Number(existing.year) || (existing.year ? String(existing.year).trim() : '')

        if (!year || !existingYear || Math.abs(Number(year) - Number(existingYear)) <= 1) {
          matchIdx = potentialIdx
        }
      }
    }

    const item = {
      ...rawItem,
      cleanTitle,
      year: year || rawItem.year,
    }

    if (matchIdx === -1) {
      const newIdx = result.length
      const researcherName = item.researcherName || item.name || item.researcher || ''
      const researcherId = item.researcher_id || item.lattes_id || ''

      let researchers = []
      if (Array.isArray(item.researchers) && item.researchers.length > 0) {
        researchers = [...item.researchers]
      } else if (researcherName || researcherId) {
        researchers = [
          {
            id: researcherId,
            name: researcherName,
            lattes_id: item.lattes_id || '',
          },
        ]
      }

      const entry = {
        ...item,
        researchers,
        researcherName: researcherName || researchers.map((r) => r.name).join(', '),
      }

      result.push(entry)

      if (cleanDoi) doiIndex.set(cleanDoi, newIdx)
      if (cleanCode) codeIndex.set(`code:${cleanCode}`, newIdx)
      if (cleanIsbn && cleanIsbn.length >= 8) codeIndex.set(`isbn:${cleanIsbn}`, newIdx)
      if (normTitle.length >= 8) titleTypeYearIndex.set(`${type}|${normTitle}|${year}`, newIdx)
      if (normTitle.length >= 25) titleTypeIndex.set(`${type}|${normTitle}`, newIdx)
    } else {
      const existing = result[matchIdx]

      // Agrupa pesquisadores coautores
      const incomingResearchers =
        Array.isArray(item.researchers) && item.researchers.length > 0
          ? item.researchers
          : item.researcherName || item.name || item.researcher || item.researcher_id || item.lattes_id
            ? [
                {
                  id: item.researcher_id || item.lattes_id || '',
                  name: item.researcherName || item.name || item.researcher || '',
                  lattes_id: item.lattes_id || '',
                },
              ]
            : []

      existing.researchers = existing.researchers || []
      for (const inc of incomingResearchers) {
        if (!inc.name && !inc.id) continue
        const exists = existing.researchers.some(
          (r) =>
            (inc.id && r.id && String(r.id).toLowerCase() === String(inc.id).toLowerCase()) ||
            (inc.name && r.name && r.name.trim().toLowerCase() === inc.name.trim().toLowerCase()),
        )
        if (!exists) {
          existing.researchers.push(inc)
        }
      }

      if (existing.researchers.length > 0) {
        existing.researcherName = existing.researchers
          .map((r) => r.name)
          .filter(Boolean)
          .join(', ')
      }

      // Preserva o melhor Qualis conhecido
      const existingPrio =
        QUALIS_PRIORITY[String(existing.qualis || 'SQ').toUpperCase()] || 0
      const itemPrio =
        QUALIS_PRIORITY[String(item.qualis || 'SQ').toUpperCase()] || 0
      if (itemPrio > existingPrio) {
        existing.qualis = item.qualis
      }

      // Preenche metadados faltantes
      if (!existing.doi && cleanDoi) existing.doi = item.doi
      if (!existing.magazine && item.magazine) existing.magazine = item.magazine
      if (!existing.issn && item.issn) existing.issn = item.issn
      if (!existing.isbn && item.isbn) existing.isbn = item.isbn
      if (!existing.code && item.code) existing.code = item.code
      if (!existing.publishing_company && item.publishing_company) {
        existing.publishing_company = item.publishing_company
      }
      if (!existing.relevance && item.relevance) existing.relevance = item.relevance
      if (!existing.jif && item.jif && item.jif !== 'None') existing.jif = item.jif
      if (!existing.year && item.year) existing.year = item.year
      if (!existing.researcher_id && item.researcher_id) {
        existing.researcher_id = item.researcher_id
      }
      if (!existing.lattes_id && item.lattes_id) {
        existing.lattes_id = item.lattes_id
      }

      if (cleanDoi && !doiIndex.has(cleanDoi)) {
        doiIndex.set(cleanDoi, matchIdx)
      }
      if (cleanCode && !codeIndex.has(`code:${cleanCode}`)) {
        codeIndex.set(`code:${cleanCode}`, matchIdx)
      }
    }
  }

  return result
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
      return
    }

    const controller = new AbortController()

    Promise.resolve()
      .then(() => {
        if (!controller.signal.aborted) {
          setLoading(true)
          setError(null)
        }
        return getQualisPorPesquisadorNosAnos(researcherId || '', '', [], controller.signal)
      })
      .then((list) => {
        const normalized = list.map((item) => ({
          ...item,
          cleanTitle: cleanArticleTitle(item.title),
          yearNum: Number(item.year) || 0,
        }))

        const deduplicated = deduplicateProductions(normalized).sort(
          (a, b) =>
            (Number(b.year) || 0) - (Number(a.year) || 0) ||
            String(a.cleanTitle || '').localeCompare(String(b.cleanTitle || ''), 'pt-BR'),
        )

        setArticles(deduplicated)
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

  return {
    articles: researcherId || lattesId ? articles : [],
    loading: researcherId || lattesId ? loading : false,
    error: researcherId || lattesId ? error : null,
  }
}
