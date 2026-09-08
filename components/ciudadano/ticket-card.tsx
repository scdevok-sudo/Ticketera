'use client'

import Link from 'next/link'
import {
  CATEGORIA_BG,
  CATEGORIA_ICON_COLOR,
  CATEGORY_ICONS,
  CATEGORY_LABELS,
  TIPO_TRAMITE_LABELS,
} from '@/lib/constants/tickets'
import { formatFecha } from '@/lib/utils/fecha'
import { Icon } from '@/components/ui/icon'
import { StatusBadge } from './status-badge'

interface TicketCardProps {
  ticket: {
    id: string
    title: string
    category: string
    status: string | null
    created_at: string | null
    type?: string | null
    likes_count?: number | null
    contact_name?: string | null
  }
  /** Muestra el chip de adhesiones (consultas de vecinos) en lugar de la flecha */
  showLikes?: boolean
  hasLiked?: boolean
  onLike?: () => void
  likePending?: boolean
  /** true = card no navegable (consultas de vecinos) */
  disableLink?: boolean
}

export function TicketCard({
  ticket,
  showLikes = false,
  hasLiked = false,
  onLike,
  likePending = false,
  disableLink = false,
}: TicketCardProps) {
  const status = ticket.status ?? 'nuevo'
  const bg = CATEGORIA_BG[ticket.category] ?? '#F4F4F5'
  const iconColor = CATEGORIA_ICON_COLOR[ticket.category] ?? '#6b7280'
  const fecha = ticket.created_at ? formatFecha(ticket.created_at) : ''

  const cardContent = (
    <div
      style={{ backgroundColor: bg }}
      className={`flex min-h-[210px] flex-col gap-3 rounded-xl border border-black/5 p-6 transition-all ${
        disableLink ? '' : 'cursor-pointer hover:brightness-95'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-lg"
          style={{ backgroundColor: 'rgba(255,255,255,0.6)' }}
        >
          <Icon name={CATEGORY_ICONS[ticket.category] ?? 'help'} size={20} style={{ color: iconColor }} />
        </div>
        <div className="whitespace-nowrap">
          <StatusBadge status={status} />
        </div>
      </div>

      <p
        className="flex-1 text-sm font-medium leading-snug text-zinc-800"
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {ticket.title}
      </p>

      <p className="text-xs text-zinc-500">
        {CATEGORY_LABELS[ticket.category] ?? ticket.category}
        {ticket.type ? ` · ${TIPO_TRAMITE_LABELS[ticket.type] ?? ticket.type}` : ''}
      </p>

      <div className="mt-auto flex items-center justify-between">
        <span className="text-xs text-zinc-400">{fecha}</span>
        {showLikes ? (
          <button
            type="button"
            disabled={likePending}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onLike?.()
            }}
            className={`flex min-h-[36px] min-w-[56px] items-center justify-center gap-1 rounded-full border px-3 py-1.5 text-sm transition-colors ${
              hasLiked
                ? 'border-brand-naranja bg-white text-brand-naranja'
                : 'border-zinc-200 bg-white/60 text-zinc-500 hover:border-brand-naranja hover:text-brand-naranja'
            }`}
          >
            <Icon name={hasLiked ? 'thumb-up-filled' : 'thumb-up'} size={16} />
            {ticket.likes_count ?? 0}
          </button>
        ) : (
          <Icon name="chevron-down" size={16} className="-rotate-90 text-zinc-400" />
        )}
      </div>
    </div>
  )

  if (disableLink) {
    return cardContent
  }

  return <Link href={`/ciudadano/mis-reclamos/${ticket.id}`}>{cardContent}</Link>
}
