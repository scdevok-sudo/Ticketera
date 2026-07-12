import { STATUS_BADGE_COLORS, STATUS_LABELS } from '@/lib/constants/tickets'

export function StatusBadge({ status }: { status: string }) {
  const colors = STATUS_BADGE_COLORS[status] ?? STATUS_BADGE_COLORS.nuevo
  const label = STATUS_LABELS[status] ?? status

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
