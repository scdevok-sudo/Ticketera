import { STATUS_BADGE_COLORS, STATUS_LABELS } from '@/lib/constants/tickets'
import { estadoParaCiudadano } from '@/lib/utils/estado-ciudadano'

export function StatusBadge({ status }: { status: string }) {
  // El vecino nunca ve 'resuelto': para él el caso sigue en gestión hasta el cierre.
  const visible = estadoParaCiudadano(status)
  const colors = STATUS_BADGE_COLORS[visible] ?? STATUS_BADGE_COLORS.nuevo
  const label = STATUS_LABELS[visible] ?? visible

  return (
    <span
      className="inline-flex items-center rounded-full text-[11px] font-semibold"
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`,
        padding: '3px 10px',
      }}
    >
      {label}
    </span>
  )
}
