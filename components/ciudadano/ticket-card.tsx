import Link from 'next/link'
import { CATEGORY_ICONS, CATEGORY_LABELS, STATUS_BORDER_COLORS } from '@/lib/constants/tickets'
import { Icon } from '@/components/ui/icon'
import { StatusBadge } from './status-badge'

interface TicketCardProps {
  ticket: {
    id: string
    title: string
    category: string
    status: string | null
    created_at: string | null
  }
}

export function TicketCard({ ticket }: TicketCardProps) {
  const status = ticket.status ?? 'nuevo'
  const borderColor = STATUS_BORDER_COLORS[status] ?? STATUS_BORDER_COLORS.nuevo
  const fecha = ticket.created_at
    ? new Date(ticket.created_at).toLocaleDateString('es-AR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : ''

  return (
    <Link
      href={`/ciudadano/mis-reclamos/${ticket.id}`}
      className="flex items-center gap-3 rounded-lg border-l-4 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
      style={{ borderLeftColor: borderColor }}
    >
      <Icon
        name={CATEGORY_ICONS[ticket.category] ?? 'help'}
        size={24}
        className="text-brand-naranja"
      />
      <div className="min-w-0 flex-1">
        <div className="mb-1">
          <StatusBadge status={status} />
        </div>
        <p className="truncate font-semibold text-zinc-800">{ticket.title}</p>
        <p className="text-xs text-zinc-500">
          {CATEGORY_LABELS[ticket.category] ?? ticket.category} · {fecha}
        </p>
      </div>
      <span className="shrink-0 text-zinc-400" aria-hidden="true">
        →
      </span>
    </Link>
  )
}
