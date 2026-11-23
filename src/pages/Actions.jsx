import { useState, useMemo } from 'react'
import {
  AlertCircle,
  ExternalLink,
  Filter,
  ImageOff,
  Search,
  X,
} from 'lucide-react'
import { useActions } from '@/hooks/useActions'
import { Button } from '@/components/ui/button'

function ActionImage({ src, alt, className = '' }) {
  const [currentSrc, setCurrentSrc] = useState(src)
  const [triedAlternate, setTriedAlternate] = useState(false)
  const [failed, setFailed] = useState(false)

  // Sincroniza caso o src da prop mude (ex.: abrir outra ação no modal)
  if (src !== currentSrc && !triedAlternate && !failed) {
    setCurrentSrc(src)
  }

  const handleError = () => {
    if (!triedAlternate && currentSrc) {
      setTriedAlternate(true)
      if (/\.jpg$/i.test(currentSrc)) {
        setCurrentSrc(currentSrc.replace(/\.jpg$/i, '.jpeg'))
        return
      }
      if (/\.jpeg$/i.test(currentSrc)) {
        setCurrentSrc(currentSrc.replace(/\.jpeg$/i, '.jpg'))
        return
      }
    }
    setFailed(true)
  }

  if (failed || !currentSrc) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 to-sky-50 text-gray-400">
        <ImageOff className="h-8 w-8 mb-1.5 opacity-60" />
        <span className="text-xs font-medium">Imagem indisponível</span>
      </div>
    )
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      loading="lazy"
      onError={handleError}
      className={className}
    />
  )
}

function formatDate(dateString) {
  if (!dateString) return null
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return dateString
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function ActionDetailModal({ action, onClose }) {
  if (!action) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-none overflow-hidden shadow-2xl border border-gray-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Imagem de Destaque */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-gray-900 shrink-0">
          <ActionImage
            key={action.action_id || action.code || action.image}
            src={action.image}
            alt={action.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 h-10 w-10 bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 text-white">
            {action.code && (
              <span className="inline-block px-2.5 py-0.5 bg-gradient-to-r from-[#65b32e] via-[#38b29b] to-[#2ea3f2] text-white text-xs font-bold uppercase tracking-wider mb-2">
                {action.code}
              </span>
            )}
            <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
              {action.title}
            </h2>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          <div className="space-y-3">
            <h3 className="text-xl font-bold tracking-wider text-gray-400">
              Sobre a ação
            </h3>
            <p className="text-base text-gray-700 leading-relaxed whitespace-pre-line">
              {action.description}
            </p>
          </div>

          <div className="pt-4 flex justify-end">
            <Button
              onClick={onClose}
              className="rounded-none bg-black text-white hover:opacity-90 px-6 border-1"
            >
              Fechar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ActionCard({ action, index, onSelect }) {
  const formattedDate = formatDate(action.created_at)
  const isEvenColumn = index % 2 === 1

  // Alterna sutilmente a direção do corte diagonal como na imagem de referência
  const diagonalClip =
    index === 2
      ? 'polygon(0 0, 100% 0, 100% 100%, 0 92%)'
      : 'polygon(0 0, 100% 0, 100% 92%, 0 100%)'

  return (
    <article
      onClick={() => onSelect(action)}
      className={`group relative flex flex-col rounded-none overflow-hidden bg-white shadow-sm hover:shadow-xl border border-gray-200 transition-all duration-300 cursor-pointer hover:-translate-y-1 ${
        isEvenColumn ? 'lg:mt-10' : 'lg:mb-10'
      }`}
    >
      {/* Bloco Superior com Degradê e Corte Diagonal */}
      <div
        style={{ clipPath: diagonalClip }}
        className="relative z-10 bg-gradient-to-r from-[#c4ec9f] via-[#a9ece0] to-[#adddfc] p-5 sm:p-6 pb-8 text-white transition-all flex flex-col justify-between h-[235px]"
      >
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-white bg-black/20 px-2 py-0.5">
              {action.code || `#${action.action_id}`}
            </span>
            {formattedDate && (
              <span className="text-xs text-white/90 font-medium">
                {formattedDate}
              </span>
            )}
          </div>

          <h3 className="text-lg font-bold tracking-tight text-gray-800 mb-2 leading-snug line-clamp-2">
            {action.title}
          </h3>

          <p className="text-sm text-gray-800 leading-relaxed line-clamp-3">
            {action.description}
          </p>
        </div>

        <div className="pt-2 flex items-center justify-between text-xs font-semibold text-gray-800">
          <span>Ver detalhes</span>
          <ExternalLink className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>

      {/* Bloco Inferior com Foto */}
      <div className="relative -mt-5 h-60 sm:h-64 w-full overflow-hidden bg-gray-100 shrink-0">
        <ActionImage
          src={action.image}
          alt={action.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </div>
    </article>
  )
}

export default function Actions() {
  const { actions, loading, error, refetch } = useActions()
  const [selectedAction, setSelectedAction] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredActions = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return actions.filter((action) => {
      if (!q) return true
      return (
        (action.title && action.title.toLowerCase().includes(q)) ||
        (action.description && action.description.toLowerCase().includes(q)) ||
        (action.code && action.code.toLowerCase().includes(q))
      )
    })
  }, [actions, searchQuery])

  return (
    <main className="max-w-7xl mx-auto px-12 lg:px-16 py-12 text-gray-800 min-h-screen">
      {/* Cabeçalho da Página */}
      <header className="mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight drop-shadow-sm leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#65b32e] via-[#38b29b] to-[#2ea3f2]">
                Nossas ações
              </span>
            </h1>
            <p className="mt-4 text-base text-gray-600 max-w-5xl leading-relaxed">
              Iniciativas socioambientais, extensão comunitária e atividades de campo desenvolvidas pela rede INCITE Restauração e Conservação de Ecossistemas Terrestres Baianos.
            </p>
          </div>

          <div className="mt-4 md:mt-0 text-sm text-gray-500 font-medium">
            Total:{' '}
            <strong className="text-gray-900 font-bold">
              {filteredActions.length}
            </strong>{' '}
            {filteredActions.length === 1 ? 'ação' : 'ações'}
          </div>
        </div>

        {/* Barra de Busca */}
        <div className="mt-8 flex items-center gap-3">
          <div className="relative flex-1 max-w-6xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por título, código ou descrição..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3 bg-white rounded-full border border-gray-300 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#38b29b] focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-full"
                aria-label="Limpar busca"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Grade de Cards das Ações (4 Colunas Intercaladas) */}
      <section aria-label="Lista de Ações">
        {loading ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start"
            aria-busy="true"
          >
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className={`h-[450px] rounded-none bg-white border border-gray-200 shadow-sm animate-pulse flex flex-col justify-between ${
                  idx % 2 === 1 ? 'lg:mt-10' : 'lg:mb-10'
                }`}
              >
                <div className="h-[225px] bg-gray-200 p-5" />
                <div className="h-56 bg-gray-100" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-white rounded-none p-12 text-center border border-red-200 shadow-sm max-w-lg mx-auto">
            <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-800">
              Erro ao carregar ações
            </h3>
            <p className="text-sm text-gray-500 mt-1">{error}</p>
            <Button
              onClick={refetch}
              variant="outline"
              className="mt-4 rounded-none"
            >
              Tentar novamente
            </Button>
          </div>
        ) : filteredActions.length === 0 ? (
          <div className="bg-white rounded-none p-12 text-center border border-gray-200 shadow-sm max-w-lg mx-auto">
            <Filter className="h-10 w-10 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-800">
              Nenhuma ação encontrada
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Tente alterar os termos da busca.
            </p>
            <Button
              onClick={() => setSearchQuery('')}
              variant="outline"
              className="mt-4 rounded-none"
            >
              Limpar busca
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
            {filteredActions.map((action, index) => (
              <ActionCard
                key={action.action_id || action.code || index}
                action={action}
                index={index}
                onSelect={setSelectedAction}
              />
            ))}
          </div>
        )}
      </section>

      {/* Modal de Detalhes da Ação */}
      <ActionDetailModal
        action={selectedAction}
        onClose={() => setSelectedAction(null)}
      />
    </main>
  )
}