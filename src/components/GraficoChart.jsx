import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import {
  CoresQualis,
  formatoChartArtigo,
  formatoChartCapituloLivros,
  formatoChartOrientacoes,
  formatoChartProducaoTecnica,
  getProducoesPorTipo,
} from '@/hooks/useProductions'

const QUALIS_KEYS = ['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'B3', 'B4', 'C', 'SQ']
const LIVROS_KEYS = ['Livro', 'Capitulo']
const TECNICA_KEYS = ['Software', 'Patente', 'Marca']
const ORIENTACOES_KEYS = [
  'IniciacaoCientifica',
  'DissertacaoDeMestrado',
  'TeseDeDoutorado',
  'TCCGraduacao',
  'Monografia',
  'SupervisaoPos',
]

export function GraficoChart({
  idPesquisador = '',
  filtroAno = [new Date().getFullYear() - 10],
  filtroQualis = [],
  className = '',
  tipo = 'artigos',
  items = null,
}) {
  const [, setFormatoChart] = useState(formatoChartArtigo)
  const [qualisPorAno, setQualisPorAno] = useState([])
  const [dadosQualis, setDadosQualis] = useState([])
  const [hoveredYear, setHoveredYear] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    switch (tipo) {
      case 'artigos':
        setFormatoChart(formatoChartArtigo)
        break
      case 'livrosECapitulos':
        setFormatoChart(formatoChartCapituloLivros)
        break
      case 'producaoTecnica':
        setFormatoChart(formatoChartProducaoTecnica)
        break
      case 'orientacoes':
        setFormatoChart(formatoChartOrientacoes)
        break
      case 'relatorioTecnico':
      default:
        setFormatoChart(formatoChartArtigo)
        break
    }
  }, [tipo])

  const buildQualisPorAno = (lista) => {
    const dadosGraficoQualis = []

    lista.forEach((artigo) => {
      const year = Number(artigo.year) || artigo.year
      if (!year) return

      const rawQualis = String(artigo.qualis || 'SQ').toUpperCase().trim()
      const qualis = QUALIS_KEYS.includes(rawQualis) ? rawQualis : 'SQ'

      let anoData = dadosGraficoQualis.find((item) => item.ano === year)
      if (!anoData) {
        anoData = { ano: year }
        dadosGraficoQualis.push(anoData)
      }

      if (qualis) {
        anoData[qualis] = (anoData[qualis] || 0) + 1
      }

      if (artigo.categoriaGrafico) {
        anoData[artigo.categoriaGrafico] = (anoData[artigo.categoriaGrafico] || 0) + 1
      }
    })

    dadosGraficoQualis.sort((a, b) => Number(a.ano) - Number(b.ano))
    return dadosGraficoQualis
  }

  useEffect(() => {
    if (Array.isArray(items)) {
      const agrupado = buildQualisPorAno(items)
      setQualisPorAno(agrupado)
      return
    }

    const controller = new AbortController()
    const anoStr =
      Array.isArray(filtroAno) && filtroAno.length > 0 ? String(filtroAno[0]) : '2016'

    setLoading(true)
    getProducoesPorTipo(tipo, anoStr, filtroQualis, idPesquisador, controller.signal)
      .then((artigos) => {
        const agrupado = buildQualisPorAno(artigos)
        setQualisPorAno(agrupado)
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          console.error('Erro ao buscar dados:', error)
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [items, filtroAno, filtroQualis, tipo, idPesquisador])

  useEffect(() => {
    if (qualisPorAno !== undefined && qualisPorAno !== null) {
      setDadosQualis(qualisPorAno)
    }
  }, [qualisPorAno])

  const seriesKeys = useMemo(() => {
    if (tipo === 'artigos') return QUALIS_KEYS
    if (tipo === 'livrosECapitulos') return LIVROS_KEYS
    if (tipo === 'producaoTecnica') return TECNICA_KEYS
    if (tipo === 'orientacoes') return ORIENTACOES_KEYS
    return ['A1']
  }, [tipo])

  const { maxTotal, yTicks } = useMemo(() => {
    let max = 0
    dadosQualis.forEach((row) => {
      const sum = seriesKeys.reduce((acc, k) => acc + (Number(row[k]) || 0), 0)
      if (sum > max) max = sum
    })
    if (max === 0) max = 4
    const step = Math.max(1, Math.ceil(max / 4))
    const niceMax = step * 4
    return {
      maxTotal: niceMax,
      yTicks: [niceMax, step * 3, step * 2, step, 0],
    }
  }, [dadosQualis, seriesKeys])

  const getSeriesLabel = (key) => {
    if (tipo === 'artigos') return formatoChartArtigo[key]?.label || key
    if (tipo === 'livrosECapitulos') return formatoChartCapituloLivros[key]?.label || key
    if (tipo === 'producaoTecnica') return formatoChartProducaoTecnica[key]?.label || key
    if (tipo === 'orientacoes') return formatoChartOrientacoes[key]?.label || key
    return 'Relatórios Técnicos'
  }

  const getSeriesColor = (key) => {
    return CoresQualis[key] || CoresQualis.A1
  }

  return (
    <Card className={`relative overflow-visible py-7 px-2 sm:px-6 ${className}`}>
      <CardContent className="p-2 sm:p-4 overflow-visible">
        {loading ? (
          <div className="h-64 w-full flex items-center justify-center text-sm text-gray-400 animate-pulse">
            Carregando gráfico de produções...
          </div>
        ) : dadosQualis.length === 0 ? (
          <div className="h-64 w-full flex items-center justify-center text-sm text-gray-400">
            Nenhum dado disponível para o período selecionado.
          </div>
        ) : (
          <div className="w-full overflow-visible">
            {/* Área do Gráfico de Barras Empilhadas */}
            <div className="relative h-64 flex overflow-visible">
              {/* Eixo Y */}
              <div className="flex flex-col justify-between pr-3 pb-7 text-xs text-gray-400 font-medium select-none w-10 text-right">
                {yTicks.map((tick) => (
                  <span key={tick} className="leading-none">
                    {tick}
                  </span>
                ))}
              </div>

              {/* Área de plotagem + Grid + Barras */}
              <div className="relative flex-1 flex flex-col overflow-visible">
                {/* Linhas horizontais do CartesianGrid */}
                <div className="absolute inset-0 bottom-7 flex flex-col justify-between pointer-events-none">
                  {yTicks.map((tick) => (
                    <div
                      key={tick}
                      className="w-full border-b border-dashed border-gray-200/80"
                    />
                  ))}
                </div>

                {/* Colunas por Ano (sem overflow-x-auto para não cortar o tooltip verticalmente) */}
                <div className="relative z-10 flex-1 flex items-end justify-around gap-1 sm:gap-2.5 px-1 sm:px-2 pb-7 overflow-visible">
                  {dadosQualis.map((row, idx) => {
                    const totalAno = seriesKeys.reduce(
                      (acc, k) => acc + (Number(row[k]) || 0),
                      0,
                    )
                    const isHovered = hoveredYear === row.ano
                    const isFirstCols = idx < 2
                    const isLastCols = idx >= dadosQualis.length - 2 && dadosQualis.length > 3

                    const tooltipAlignClass = isFirstCols
                      ? 'left-0'
                      : isLastCols
                        ? 'right-0'
                        : 'left-1/2 -translate-x-1/2'

                    return (
                      <div
                        key={row.ano}
                        className="relative flex-1 min-w-[20px] max-w-[56px] h-full flex flex-col justify-end items-center group cursor-pointer rounded-t-lg hover:bg-emerald-50/50 transition-colors"
                        onMouseEnter={() => setHoveredYear(row.ano)}
                        onMouseLeave={() => setHoveredYear(null)}
                      >
                        {/* Tooltip Flutuante */}
                        {isHovered && totalAno > 0 && (
                          <div
                            className={`absolute -top-3 -translate-y-full ${tooltipAlignClass} z-50 w-56 rounded-2xl bg-slate-900/95 text-white p-3.5 text-xs shadow-2xl border border-slate-700 pointer-events-none`}
                          >
                            <p className="font-bold text-emerald-300 border-b border-slate-700 pb-1.5 mb-2 flex justify-between items-center">
                              <span>Ano {row.ano}</span>
                              <span className="bg-emerald-500/20 text-emerald-200 px-2 py-0.5 rounded-full text-[11px]">
                                Total: {totalAno}
                              </span>
                            </p>
                            <div className="space-y-1.5">
                              {seriesKeys.map((k) => {
                                const val = Number(row[k]) || 0
                                if (!val) return null
                                return (
                                  <div key={k} className="flex items-center justify-between gap-2">
                                    <span className="flex items-center gap-1.5">
                                      <span
                                        className="h-2.5 w-2.5 rounded-sm shrink-0"
                                        style={{ backgroundColor: getSeriesColor(k) }}
                                      />
                                      <span className="text-slate-200">{getSeriesLabel(k)}</span>
                                    </span>
                                    <span className="font-bold text-white">{val}</span>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}

                        {/* Barra Empilhada */}
                        <div
                          className="w-full flex flex-col-reverse rounded-t-md overflow-hidden transition-all duration-300 group-hover:brightness-110 group-hover:shadow-md"
                          style={{
                            height: `${Math.max((totalAno / maxTotal) * 100, totalAno > 0 ? 4 : 0)}%`,
                          }}
                        >
                          {seriesKeys.map((k) => {
                            const val = Number(row[k]) || 0
                            if (!val) return null
                            const heightPct = (val / totalAno) * 100
                            return (
                              <div
                                key={k}
                                style={{
                                  height: `${heightPct}%`,
                                  backgroundColor: getSeriesColor(k),
                                }}
                                className="w-full transition-all duration-300 first:rounded-b-[2px] last:rounded-t-[4px]"
                              />
                            )
                          })}
                        </div>

                        {/* Rótulo do Eixo X (Ano) */}
                        <span className="absolute -bottom-6 text-[10px] sm:text-xs font-medium text-gray-500 group-hover:text-emerald-700 group-hover:font-bold transition-colors">
                          {row.ano}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Legenda (ChartLegend) */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-4 pt-3 border-t border-gray-100 text-xs text-gray-600">
              {seriesKeys.map((k) => (
                <div key={k} className="flex items-center gap-1.5">
                  <span
                    className="h-3 w-3 rounded-[4px] shrink-0"
                    style={{ backgroundColor: getSeriesColor(k) }}
                  />
                  <span className="font-medium">{getSeriesLabel(k)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default GraficoChart
