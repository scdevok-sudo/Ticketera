import Link from 'next/link'
import { getMyTickets } from '@/lib/actions/tickets'
import { TicketCard } from '@/components/ciudadano/ticket-card'
import { Icon } from '@/components/ui/icon'

export default async function MisReclamosPage() {
  const tickets = await getMyTickets()

  if (tickets.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100">
          <Icon name="message-plus" size={36} className="text-brand-naranja" />
        </div>
        <h1 className="mb-2 text-xl font-bold text-zinc-900">¿En qué te podemos ayudar?</h1>
        <p className="mb-8 max-w-xs text-sm text-zinc-500">
          Registrá tu primera consulta o pedido. El equipo del diputado lo recibe y te da
          seguimiento.
        </p>
        <Link
          href="/ciudadano/nuevo-reclamo"
          className="mb-4 flex items-center gap-2 rounded-xl bg-brand-naranja px-8 py-4 text-lg font-bold text-white shadow-sm transition-colors hover:bg-[#e66800]"
        >
          <Icon name="plus" size={22} />
          NUEVA CONSULTA
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-zinc-800">Mis consultas</h1>
        <Link
          href="/ciudadano/nuevo-reclamo"
          className="rounded-lg bg-brand-naranja px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#e66800]"
        >
          Nueva consulta +
        </Link>
      </div>

      <div className="space-y-3">
        {tickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
      </div>
    </div>
  )
}
