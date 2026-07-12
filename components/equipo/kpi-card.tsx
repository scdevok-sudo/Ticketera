import { Icon } from '@/components/ui/icon'

interface KpiCardProps {
  titulo: string
  valor: number | string
  subtitulo?: string
  icono: string
  color: 'naranja' | 'azul' | 'verde' | 'rojo' | 'amarillo'
  tendencia?: 'sube' | 'baja' | 'igual'
}

const COLOR_CLASSES: Record<KpiCardProps['color'], string> = {
  naranja: 'bg-orange-100 text-brand-naranja',
  azul: 'bg-blue-100 text-brand-azul',
  verde: 'bg-green-100 text-green-700',
  rojo: 'bg-red-100 text-red-700',
  amarillo: 'bg-yellow-100 text-yellow-700',
}

const TENDENCIA: Record<NonNullable<KpiCardProps['tendencia']>, { icon: string; color: string }> = {
  sube: { icon: 'trending-up', color: 'text-green-600' },
  baja: { icon: 'trending-down', color: 'text-red-600' },
  igual: { icon: 'minus', color: 'text-gray-400' },
}

export function KpiCard({ titulo, valor, subtitulo, icono, color, tendencia }: KpiCardProps) {
  return (
    <div className="rounded-lg bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full ${COLOR_CLASSES[color]}`}
        >
          <Icon name={icono} size={18} />
        </div>
        {tendencia && (
          <Icon name={TENDENCIA[tendencia].icon} size={18} className={TENDENCIA[tendencia].color} />
        )}
      </div>
      <p className="mt-3 text-2xl font-bold text-gray-900">{valor}</p>
      <p className="text-sm font-medium text-gray-600">{titulo}</p>
      {subtitulo && <p className="mt-0.5 text-xs text-gray-400">{subtitulo}</p>}
    </div>
  )
}
