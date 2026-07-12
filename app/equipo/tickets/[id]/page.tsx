import { notFound } from 'next/navigation'
import { getTicketByIdEquipo } from '@/lib/actions/tickets'
import { getTeamMembers } from '@/lib/actions/equipo'
import { createClient } from '@/lib/supabase/server'
import { unwrapEmbed } from '@/lib/supabase/embed'
import { TicketDetailEquipo, type TicketDetalle } from '@/components/equipo/ticket-detail-equipo'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function TicketDetailEquipoPage({ params }: PageProps) {
  const { id } = await params

  const [ticket, teamMembers] = await Promise.all([getTicketByIdEquipo(id), getTeamMembers()])

  if (!ticket) notFound()

  const attachment = ticket.ticket_attachments?.[0]
  let photoUrl: string | null = null
  if (attachment) {
    const supabase = await createClient()
    const { data } = await supabase.storage
      .from('attachments')
      .createSignedUrl(attachment.storage_path, 3600)
    photoUrl = data?.signedUrl ?? null
  }

  const teamMemberOptions = teamMembers.map((m) => ({
    id: m.id,
    nombre: unwrapEmbed(m.profiles)?.full_name ?? 'Sin nombre',
    area: m.area,
  }))

  return (
    <TicketDetailEquipo
      ticket={ticket as unknown as TicketDetalle}
      teamMembers={teamMemberOptions}
      photoUrl={photoUrl}
    />
  )
}
