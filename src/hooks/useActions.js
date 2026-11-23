import { useMemo } from 'react'
import actionsData from '@/data/actions.json'

const BASE_URL = import.meta.env.BASE_URL || '/'

const LOCAL_ACTION_FILES = {
  ACAO_01: 'ACAO_01.jpeg',
  ACAO_02: 'ACAO_02.jpg',
  ACAO_03: 'ACAO_03.jpg',
  ACAO_04: 'ACAO_04.jpg',
  ACAO_05: 'ACAO_05.jpg',
  ACAO_06: 'ACAO_06.jpg',
  ACAO_07: 'ACAO_07.jpeg',
  ACAO_08: 'ACAO_08.jpg',
}

export function resolveActionImage(item, index = 0) {
  if (item?.image) {
    if (/^https?:\/\//i.test(item.image)) return item.image
    const cleanPath = String(item.image).replace(/^\/+/, '')
    return `${BASE_URL}${cleanPath}`
  }

  const rawCode = String(item?.code || '').trim().toUpperCase()
  if (rawCode && LOCAL_ACTION_FILES[rawCode]) {
    return `${BASE_URL}actions/${LOCAL_ACTION_FILES[rawCode]}`
  }

  const key = item?.code || item?.action_id
  if (key) {
    return `${BASE_URL}actions/${key}.jpg`
  }

  const fallbackFiles = Object.values(LOCAL_ACTION_FILES)
  return `${BASE_URL}actions/${fallbackFiles[index % fallbackFiles.length]}`
}

function normalizeAction(item, index) {
  return {
    action_id: item.action_id ?? item.id ?? index + 1,
    // code: item.code || '',
    title: item.title || item.name || `Ação ${index + 1}`,
    description: item.description || '',
    // created_at: item.created_at || null,
    image: resolveActionImage(item, index),
  }
}

export function useActions() {
  const actions = useMemo(() => {
    const rawList = Array.isArray(actionsData)
      ? actionsData
      : Array.isArray(actionsData?.actions)
        ? actionsData.actions
        : Array.isArray(actionsData?.data)
          ? actionsData.data
          : []

    return rawList.map(normalizeAction)
  }, [])

  return {
    actions,
    loading: false,
    error: null,
    refetch: () => {},
  }
}
