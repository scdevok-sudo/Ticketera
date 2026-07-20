'use client'

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts'

interface GraficoEstadosProps {
  datos: { status: string; label: string; count: number }[]
}

// Paleta de Paul Tol (KNMI) — distinguible en deuteranopia, protanopia y tritanopia
const ESTADO_COLORS: Record<string, string> = {
  nuevo: '#0077BB',
  en_revision: '#EE7733',
  derivado: '#AA3377',
  en_gestion: '#009988',
  requiere_info: '#BBBBBB',
  resuelto: '#33BB44',
}

// Formas geométricas distintas por estado para no depender solo del color
const ESTADO_FORMAS: Record<string, string> = {
  nuevo: '●',
  en_revision: '■',
  derivado: '▲',
  en_gestion: '◆',
  requiere_info: '✕',
  resuelto: '★',
}

interface LabelProps {
  cx: number
  cy: number
  midAngle: number
  innerRadius: number
  outerRadius: number
  percent: number
}

function renderCustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }: LabelProps) {
  if (percent < 0.05) return null

  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={11}
      fontWeight={700}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

interface LegendPayloadEntry {
  value: string
  color: string
  payload: { status: string; label: string; count: number }
}

function renderLegend(props: { payload?: LegendPayloadEntry[] }) {
  const { payload } = props
  return (
    <ul className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-2 p-0 text-xs text-gray-600">
      {(payload ?? []).map((entry) => (
        <li key={entry.payload.status} className="flex items-center gap-1.5">
          <span style={{ color: entry.color, fontSize: 14, lineHeight: 1 }}>
            {ESTADO_FORMAS[entry.payload.status] ?? '●'}
          </span>
          <span>{entry.value}</span>
        </li>
      ))}
    </ul>
  )
}

export function GraficoEstados({ datos }: GraficoEstadosProps) {
  if (datos.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-gray-400">
        Todavía no hay datos públicos disponibles.
      </p>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={datos}
          dataKey="count"
          nameKey="label"
          cx="50%"
          cy="50%"
          outerRadius={90}
          labelLine={false}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label={renderCustomLabel as any}
          stroke="white"
          strokeWidth={2}
        >
          {datos.map((entry) => (
            <Cell key={entry.status} fill={ESTADO_COLORS[entry.status] ?? '#9CA3AF'} />
          ))}
        </Pie>
        <Tooltip />
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <Legend content={renderLegend as any} />
      </PieChart>
    </ResponsiveContainer>
  )
}
