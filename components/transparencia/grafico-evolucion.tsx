'use client'

import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts'

interface GraficoEvolucionProps {
  datos: { mes: string; count: number }[]
}

export function GraficoEvolucion({ datos }: GraficoEvolucionProps) {
  if (datos.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-gray-400">
        Todavía no hay datos públicos disponibles.
      </p>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={datos}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
        <XAxis dataKey="mes" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="#9CA3AF" />
        <Tooltip />
        <Line type="monotone" dataKey="count" stroke="#FF7402" strokeWidth={2} dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}
