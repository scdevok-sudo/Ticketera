import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTicketById } from '@/lib/actions/tickets'
import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/supabase/auth-cache'
import { StatusBadge } from '@/components/ciudadano/status-badge'
import { TicketTimeline } from '@/components/ciudadano/ticket-timeline'
import { AdhesionBtn } from '@/components/ciudadano/adhesion-btn'
import { CATEGORY_LABELS, TIPO_TRAMITE_LABELS } from '@/lib/constants/tickets'
import { SuccessBanner } from './success-banner'

export default async function TicketDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ nuevo?: string }>
}) {
  const [{ id }, { nuevo }] = await Promise.all([params, searchParams])
  const supabase = await createClient()
  const user = await getUser()

  const [ticket, myLike] = await Promise.all([
    getTicketById(id),
    user
      ? supabase
          .from('ticket_likes')
          .select('id')
          .eq('ticket_id', id)
          .eq('citizen_id', user.id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ])

  if (!ticket) notFound()

  const hasLiked = !!myLike.data

  const attachment = ticket.ticket_attachments?.[0]
  let photoUrl: string | null = null
  if (attachment) {
    const { data } = await supabase.storage
      .from('attachments')
      .createSignedUrl(attachment.storage_path, 3600)
    photoUrl = data?.signedUrl ?? null
  }

  const status = ticket.status ?? 'nuevo'
  const ticketNum = ticket.id.slice(0, 8).toUpperCase()
  const fecha = ticket.created_at
    ? new Date(ticket.created_at).toLocaleDateString('es-AR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : ''

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
      {nuevo === 'true' && <SuccessBanner />}

      <Link
        href="/ciudadano/mis-reclamos"
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-brand-naranja"
      >
        ← Mis consultas
      </Link>

      <div className="rounded-lg bg-white p-5 shadow-sm">
        <div className="mb-2 flex items-center justify-between gap-2">
          <StatusBadge status={status} />
          <span className="text-xs font-semibold text-zinc-400">#UH-{ticketNum}</span>
        </div>
        <h1 className="text-lg font-bold text-zinc-800">{ticket.title}</h1>
        <p className="mt-1 text-xs text-zinc-500">
          {CATEGORY_LABELS[ticket.category] ?? ticket.category} ·{' '}
          {TIPO_TRAMITE_LABELS[ticket.type] ?? ticket.type} · {fecha}
        </p>
        <div className="mt-4">
          <AdhesionBtn ticketId={ticket.id} hasLiked={hasLiked} likesCount={ticket.likes_count ?? 0} />
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-white p-5 shadow-sm">
        <h2 className="mb-2 text-sm font-bold text-zinc-800">Descripción</h2>
        <p className="whitespace-pre-line text-sm text-zinc-600">{ticket.description}</p>
        {photoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoUrl}
            alt="Foto adjunta de la consulta"
            className="mt-3 max-h-80 w-full rounded-lg object-cover"
          />
        )}
      </div>

      <div className="mt-4 rounded-lg bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-bold text-zinc-800">Seguimiento</h2>
        <TicketTimeline status={status} events={ticket.ticket_events ?? []} />
      </div>
    </div>
  )
}
