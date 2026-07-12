import { CATEGORY_LABELS, CATEGORY_ICONS } from '@/lib/constants/tickets'
import { Icon } from '@/components/ui/icon'
import type { CasoResuelto } from '@/lib/actions/transparencia'

function truncar(texto: string, max: number) {
  return texto.length > max ? `${texto.slice(0, max).trimEnd()}…` : texto
}

function formatFecha(fecha: string) {
  return new Date(fecha).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function CasoResueltoCard({ caso }: { caso: CasoResuelto }) {
  return (
    <div className="flex flex-col gap-2 border-b border-gray-100 py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-50">
          <Icon name={CATEGORY_ICONS[caso.category] ?? 'tag'} size={16} className="text-brand-naranja" />
        </span>
        <div>
          <p className="text-sm font-semibold text-gray-800">{truncar(caso.title, 80)}</p>
          <p className="mt-0.5 text-xs text-gray-500">
            {CATEGORY_LABELS[caso.category] ?? caso.category}
            {caso.area ? ` · ${caso.area}` : ''}
            {caso.localidad ? ` · ${caso.localidad}` : ''}
          </p>
          <p className="mt-0.5 text-xs text-gray-400">Resuelto el {formatFecha(caso.updated_at)}</p>
        </div>
      </div>
      <span className="w-fit rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
        Resuelto
      </span>
    </div>
  )
}
