import Link from 'next/link'
import { getMyTickets } from '@/lib/actions/tickets'
import { TicketCard } from '@/components/ciudadano/ticket-card'

export default async function MisReclamosPage() {
  const tickets = await getMyTickets()

  if (tickets.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <ClipboardIcon />
        <h1 className="mt-6 text-lg font-bold text-zinc-800">
          Todavía no registraste ninguna consulta
        </h1>
        <p className="mt-2 max-w-xs text-sm text-zinc-500">
          Cuando hagas tu primera consulta, vas a poder seguir el estado acá.
        </p>
        <Link
          href="/ciudadano/nuevo-reclamo"
          className="mt-6 rounded-lg bg-brand-naranja px-5 py-3 font-semibold text-white transition-colors hover:bg-[#e66800]"
        >
          Registrar mi primera consulta
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

function ClipboardIcon() {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#FF7402"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="opacity-60"
      aria-hidden="true"
    >
      <rect x="6" y="4" width="12" height="17" rx="2" />
      <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
      <path d="M9 10h6M9 14h6M9 18h3" />
    </svg>
  )
}
