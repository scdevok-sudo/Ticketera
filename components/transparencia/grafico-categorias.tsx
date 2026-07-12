'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts'
import { CATEGORY_LABELS } from '@/lib/constants/tickets'

interface GraficoCategoriasProps {
  datos: { category: string; count: number }[]
}

export function GraficoCategorias({ datos }: GraficoCategoriasProps) {
  if (datos.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-gray-400">
        Todavía no hay datos públicos disponibles.
      </p>
    )
  }

  const data = datos.map((d) => ({ ...d, label: CATEGORY_LABELS[d.category] ?? d.category }))

  return (
    <ResponsiveContainer width="100%" height={Math.max(220, data.length * 48)}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 24, bottom: 0, left: 0 }}>
        <XAxis type="number" allowDecimals={false} hide />
        <YAxis
          type="category"
          dataKey="label"
          width={140}
          tick={{ fontSize: 13, fill: '#374151' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip />
        <Bar dataKey="count" fill="#FF7402" radius={[0, 6, 6, 0]} barSize={22}>
          <LabelList dataKey="count" position="right" style={{ fill: '#374151', fontSize: 13, fontWeight: 600 }} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
