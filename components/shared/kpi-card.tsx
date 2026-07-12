import { Icon } from '@/components/ui/icon'

interface KpiCardProps {
  valor: string | number
  label: string
  icono: string
  sufijo?: string
}

export function KpiCard({ valor, label, icono, sufijo }: KpiCardProps) {
  return (
    <div className="flex items-start justify-between rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div>
        <p className="text-3xl font-extrabold text-brand-naranja">
          {valor}
          {sufijo && <span className="text-xl">{sufijo}</span>}
        </p>
        <p className="mt-1 text-sm text-gray-500">{label}</p>
      </div>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-50">
        <Icon name={icono} size={18} className="text-brand-naranja" />
      </div>
    </div>
  )
}
