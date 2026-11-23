import { useEffect, useState } from 'react'
import { api } from '@/api'

// Busca os pesquisadores e instituições diretamente na API
export function useResearchers() {
  const [researchers, setResearchers] = useState([])
  const [institutions, setInstitutions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    Promise.resolve()
      .then(() => {
        if (!controller.signal.aborted) {
          setLoading(true)
          setError(null)
        }
        return Promise.allSettled([
          api.get('researcher', { signal: controller.signal }),
          api.get('v2/institution', { signal: controller.signal }),
        ])
      })
      .then(([researchersRes, institutionsRes]) => {
        if (controller.signal.aborted) return

        let researcherList = []
        if (researchersRes.status === 'fulfilled') {
          const raw = researchersRes.value.data
          researcherList = (Array.isArray(raw) ? raw : Array.isArray(raw?.data) ? raw.data : [])
            .filter((r) => r.status !== false)
            .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
        }

        let institutionList = []
        if (institutionsRes.status === 'fulfilled') {
          const rawInst = institutionsRes.value.data
          institutionList = (Array.isArray(rawInst) ? rawInst : Array.isArray(rawInst?.data) ? rawInst.data : [])
            .map((inst) => ({
              ...inst,
              institution_id: inst.id || inst.institution_id,
              acronym: inst.acronym || inst.name,
            }))
            .sort((a, b) => (a.acronym || a.name).localeCompare(b.acronym || b.name, 'pt-BR'))
        }

        setResearchers(researcherList)
        setInstitutions(institutionList)
      })
      .catch((err) => {
        if (controller.signal.aborted) return
        console.error('Erro ao carregar dados dos pesquisadores:', err)
        setError(err)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [])

  return { researchers, institutions, loading, error }
}
