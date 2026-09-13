import { getAllTickets } from '@/lib/actions/tickets'
import { getTeamMembers } from '@/lib/actions/equipo'
import { unwrapEmbed } from '@/lib/supabase/embed'
import { FiltrosTicket } from '@/components/equipo/filtros-ticket'
import { TicketListEquipo } from '@/components/equipo/ticket-list-equipo'
import { PaginacionEquipo } from '@/components/equipo/paginacion-equipo'

interface PageProps {
  searchParams: Promise<{
    estado?: string
    prioridad?: string
    area?: string
    responsable?: string
    tipo?: string
    category?: string
    q?: string
    page?: string
    nueva?: string
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
      category: params.category,
      q: params.q,
      page,
    }),
    getTeamMembers(),
  ])

  const teamMemberOptions = teamMembers.map((m) => ({
    id: m.id,
    nombre: unwrapEmbed(m.profiles)?.full_name ?? 'Sin nombre',
  }))

  function buildPageHref(targetPage: number) {
    const sp = new URLSearchParams()
    if (params.estado) sp.set('estado', params.estado)
    if (params.prioridad) sp.set('prioridad', params.prioridad)
    if (params.area) sp.set('area', params.area)
    if (params.responsable) sp.set('responsable', params.responsable)
    if (params.tipo) sp.set('tipo', params.tipo)
    if (params.category) sp.set('category', params.category)
    if (params.q) sp.set('q', params.q)
    sp.set('page', String(targetPage))
    return `/equipo/tickets?${sp.toString()}`
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-bold text-gray-900">Tickets</h2>
        <a
          href="/equipo/exportar-contactos"
          download
          className="rounded-lg border border-green-500 bg-white px-3 py-1.5 text-sm font-medium text-green-700 hover:bg-green-50"
        >
          Exportar contactos (.csv)
        </a>
      </div>

      {params.nueva === 'true' && (
        <div className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
          Consulta registrada con éxito. Se envió el acuse de recibo al vecino.
        </div>
      )}

      <FiltrosTicket teamMembers={teamMemberOptions} />

      {tickets.length === 0 ? (
        <div className="rounded-lg bg-white p-8 text-center text-sm text-gray-500 shadow-sm">
          No se encontraron tickets con estos filtros.
        </div>
      ) : (
        <>
          <TicketListEquipo tickets={tickets} />

          <PaginacionEquipo
            page={page}
            total={total}
            pageSize={pageSize}
            buildHref={buildPageHref}
          />
        </>
      )}
    </div>
  )
}
