import { API_URL } from '@/constants'

// Cliente simples para falar com a API do back-end
export async function api(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  })

  if (!res.ok) {
    throw new Error(`Erro ${res.status}: ${await res.text()}`)
  }

  return res.json()
}
