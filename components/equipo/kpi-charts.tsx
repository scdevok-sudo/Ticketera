'use client'

import {
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts'
import { STATUS_LABELS, STATUS_CHART_COLORS } from '@/lib/constants/tickets'

interface KpiChartsProps {
  serieSemanal: { semana: string; cantidad: number }[]
  porEstado: { estado: string; cantidad: number }[]
}

export function KpiCharts({ serieSemanal, porEstado }: KpiChartsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="rounded-lg bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-bold text-gray-900">Tickets creados (últimas 8 semanas)</h2>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={serieSemanal}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="semana" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="#9CA3AF" />
            <Tooltip />
            <Line type="monotone" dataKey="cantidad" stroke="#FF7402" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-lg bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-bold text-gray-900">Distribución por estado</h2>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={porEstado}
              dataKey="cantidad"
              nameKey="estado"
              cx="50%"
              cy="50%"
              outerRadius={90}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              label={(entry: any) => STATUS_LABELS[entry.estado] ?? entry.estado}
            >
              {porEstado.map((entry) => (
                <Cell
                  key={entry.estado}
                  fill={STATUS_CHART_COLORS[entry.estado] ?? '#9CA3AF'}
                  stroke="white"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={((value: number, _name: string, entry: any) => [
                value,
                STATUS_LABELS[entry.payload.estado] ?? entry.payload.estado,
              ]) as never}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
