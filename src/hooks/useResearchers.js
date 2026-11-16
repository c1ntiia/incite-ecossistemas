import { useEffect, useState } from 'react'
import { api } from '@/api'
import { researchers as localResearchers } from '@/data/researchers'

// A API ainda não devolve a instituição; completa com o JSON local (pelo lattes_id)
const localByLattes = new Map(localResearchers.map((r) => [r.lattes_id, r]))

function withInstitution(researcher) {
  if (researcher.institution?.acronym) return researcher
  const local = localByLattes.get(researcher.lattes_id)
  return { ...researcher, institution: local?.institution ?? null }
}

// Busca os pesquisadores na API (GET /researcher)
export function useResearchers() {
  const [researchers, setResearchers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    api
      .get('researcher', { signal: controller.signal })
      .then(({ data }) => {
        const list = (Array.isArray(data) ? data : [])
          .filter((r) => r.status !== false)
          .map(withInstitution)
          .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
        setResearchers(list)
      })
      .catch((err) => {
        if (controller.signal.aborted) return
        console.error('Erro ao carregar pesquisadores:', err)
        setError(err)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [])

  return { researchers, loading, error }
}
