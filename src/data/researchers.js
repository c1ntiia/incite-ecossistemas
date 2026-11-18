import data from './instituicoes_pesquisadores.json'
import { API_URL } from '@/constants'

// Dados provisórios (JSON local). Quando a API estiver pronta, troque a origem aqui.

// UUIDs no JSON estão com maiúsculas/minúsculas misturadas; normaliza para comparar
const normalizeId = (id) => String(id).toLowerCase()

const institutionsById = new Map(
  data.institution.map((inst) => [normalizeId(inst.institution_id), inst]),
)

export const researchers = data.researcher
  .map((r) => ({
    ...r,
    institution: institutionsById.get(normalizeId(r.institution_id)) ?? null,
  }))
  .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))

// Só as instituições que têm ao menos um pesquisador, ordenadas pela sigla
const idsWithResearchers = new Set(researchers.map((r) => normalizeId(r.institution_id)))

export const institutions = data.institution
  .filter((inst) => idsWithResearchers.has(normalizeId(inst.institution_id)))
  .sort((a, b) => a.acronym.localeCompare(b.acronym, 'pt-BR'))

export function getLattesUrl(researcher) {
  return `https://lattes.cnpq.br/${researcher.lattes_id}`
}

// Foto do pesquisador vinda da API (GET /researcher/image).
// Usa o id da API quando existir; senão o lattes_id (dados do JSON local).
// Se a imagem falhar, o ResearcherAvatar mostra as iniciais.
export function getPhotoUrl(researcher) {
  if (researcher.photo_url) return researcher.photo_url

  const base = API_URL.replace(/\/+$/, '')
  // Mesmo caminho que a API devolve no campo "image" de GET /v2/researcher/{id}
  if (researcher.id) {
    return `${base}/v2/researcher/${encodeURIComponent(researcher.id)}/image`
  }
  if (researcher.lattes_id) {
    return `${base}/researcher/image?lattes_id=${encodeURIComponent(researcher.lattes_id)}`
  }
  return null
}

export function getInitials(name) {
  const parts = name.trim().split(/\s+/)
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase()
}

// Remove acentos para a busca ("joao" encontra "João")
export function normalizeText(text) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}
