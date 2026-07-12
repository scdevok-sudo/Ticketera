import Link from 'next/link'
import { getAllTickets } from '@/lib/actions/tickets'
import { getTeamMembers } from '@/lib/actions/equipo'
import { unwrapEmbed } from '@/lib/supabase/embed'
import { FiltrosTicket } from '@/components/equipo/filtros-ticket'
import { TicketListEquipo } from '@/components/equipo/ticket-list-equipo'

interface PageProps {
  searchParams: Promise<{
    estado?: string
    prioridad?: string
    area?: string
    responsable?: string
    tipo?: string
    q?: string
    page?: string
  }>
}

export default async function TicketsEquipoPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = params.page ? parseInt(params.page, 10) : 1

  const [{ tickets, total, pageSize }, teamMembers] = await Promise.all([
    getAllTickets({
      estado: params.estado,
      prioridad: params.prioridad,
      area: params.area,
      responsable: params.responsable,
      tipo: params.tipo,
      q: params.q,
      page,
    }),
    getTeamMembers(),
  ])

  const teamMemberOptions = teamMembers.map((m) => ({
    id: m.id,
    nombre: unwrapEmbed(m.profiles)?.full_name ?? 'Sin nombre',
  }))

  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  function buildPageHref(targetPage: number) {
    const sp = new URLSearchParams()
    if (params.estado) sp.set('estado', params.estado)
    if (params.prioridad) sp.set('prioridad', params.prioridad)
    if (params.area) sp.set('area', params.area)
    if (params.responsable) sp.set('responsable', params.responsable)
    if (params.tipo) sp.set('tipo', params.tipo)
    if (params.q) sp.set('q', params.q)
    sp.set('page', String(targetPage))
    return `/equipo/tickets?${sp.toString()}`
  }

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold text-gray-900">Tickets</h2>

      <FiltrosTicket teamMembers={teamMemberOptions} />

      {tickets.length === 0 ? (
        <div className="rounded-lg bg-white p-8 text-center text-sm text-gray-500 shadow-sm">
          No se encontraron tickets con estos filtros.
        </div>
      ) : (
        <>
          <TicketListEquipo tickets={tickets} />

          <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
            <span>
              Mostrando {from}–{to} de {total}
            </span>
            <div className="flex gap-2">
              <Link
                href={buildPageHref(Math.max(1, page - 1))}
                aria-disabled={page <= 1}
                className={`rounded-lg border border-gray-300 bg-white px-3 py-1.5 ${
                  page <= 1 ? 'pointer-events-none opacity-40' : 'hover:bg-gray-50'
                }`}
              >
                Anterior
              </Link>
              <Link
                href={buildPageHref(Math.min(totalPages, page + 1))}
                aria-disabled={page >= totalPages}
                className={`rounded-lg border border-gray-300 bg-white px-3 py-1.5 ${
                  page >= totalPages ? 'pointer-events-none opacity-40' : 'hover:bg-gray-50'
                }`}
              >
                Siguiente
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
