'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

interface GraficoEstadosProps {
  datos: { status: string; label: string; count: number }[]
}

const ESTADO_COLORS: Record<string, string> = {
  nuevo: '#FF7402',
  en_revision: '#2D3077',
  derivado: '#902682',
  en_gestion: '#0C447C',
  resuelto: '#1A6B40',
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
    <div>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie data={datos} dataKey="count" nameKey="label" cx="50%" cy="50%" outerRadius={90}>
            {datos.map((entry) => (
              <Cell key={entry.status} fill={ESTADO_COLORS[entry.status] ?? '#9CA3AF'} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-2">
        {datos.map((entry) => (
          <div key={entry.status} className="flex items-center gap-1.5 text-xs text-gray-600">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: ESTADO_COLORS[entry.status] ?? '#9CA3AF' }}
            />
            {entry.label}
          </div>
        ))}
      </div>
    </div>
  )
}
