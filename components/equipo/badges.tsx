import {
  EQUIPO_STATUS_BADGE_CLASSES,
  STATUS_LABELS,
  PRIORITY_BADGE_CLASSES,
  PRIORITY_LABELS,
} from '@/lib/constants/tickets'

export function StatusBadgeEquipo({ status }: { status: string }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
        EQUIPO_STATUS_BADGE_CLASSES[status] ?? EQUIPO_STATUS_BADGE_CLASSES.nuevo
      }`}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  )
}

export function PriorityBadge({ priority }: { priority: string }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
        PRIORITY_BADGE_CLASSES[priority] ?? PRIORITY_BADGE_CLASSES.media
      }`}
    >
      {PRIORITY_LABELS[priority] ?? priority}
    </span>
  )
}
