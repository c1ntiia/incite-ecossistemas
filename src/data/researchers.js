import { API_URL } from '@/constants'

// Exportações para retrocompatibilidade com consumo 100% via API
export const researchers = []
export const institutions = []

export function getLattesUrl(researcher) {
  if (!researcher?.lattes_id) return '#'
  return `https://lattes.cnpq.br/${researcher.lattes_id}`
}

// Foto do pesquisador vinda da API (GET /v2/researcher/{id}/image ou /researcher/image)
export function getPhotoUrl(researcher) {
  if (!researcher) return null
  if (researcher.photo_url) return researcher.photo_url

  const base = API_URL.replace(/\/+$/, '')
  if (researcher.id) {
    return `${base}/v2/researcher/${encodeURIComponent(researcher.id)}/image`
  }
  if (researcher.lattes_id) {
    return `${base}/researcher/image?lattes_id=${encodeURIComponent(researcher.lattes_id)}`
  }
  return null
}

export function getInitials(name) {
  if (!name) return ''
  const parts = name.trim().split(/\s+/)
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase()
}

// Remove acentos para a busca ("joao" encontra "João")
export function normalizeText(text) {
  if (!text) return ''
  return String(text).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}
