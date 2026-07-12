'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { unwrapEmbed } from '@/lib/supabase/embed'
import { CATEGORY_LABELS, TIPO_TRAMITE_LABELS } from '@/lib/constants/tickets'
import { StatusBadgeEquipo, PriorityBadge } from '@/components/equipo/badges'

interface Citizen {
  full_name: string | null
}

interface AssigneeProfile {
  full_name: string | null
}

interface Assignee {
  profiles: AssigneeProfile | AssigneeProfile[] | null
}

export interface EquipoTicketRow {
  id: string
  type: string
  category: string
  title: string
  localidad: string | null
  status: string | null
  priority: string | null
  created_at: string | null
  citizen: Citizen | Citizen[] | null
  assignee: Assignee | Assignee[] | null
}

function diasDesde(fecha: string) {
  const dias = Math.floor((Date.now() - new Date(fecha).getTime()) / (1000 * 60 * 60 * 24))
  if (dias <= 0) return 'Hoy'
  if (dias === 1) return 'Hace 1 día'
  return `Hace ${dias} días`
}

export function TicketListEquipo({ tickets }: { tickets: EquipoTicketRow[] }) {
  const router = useRouter()

  return (
    <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
      <table className="w-full min-w-[900px] text-left text-sm">
        <thead className="border-b border-gray-200 text-xs uppercase text-gray-500">
          <tr>
            <th className="px-4 py-3 font-medium">#</th>
            <th className="px-4 py-3 font-medium">Tipo</th>
            <th className="px-4 py-3 font-medium">Título</th>
            <th className="px-4 py-3 font-medium">Ciudadano</th>
            <th className="px-4 py-3 font-medium">Localidad</th>
            <th className="px-4 py-3 font-medium">Estado</th>
            <th className="px-4 py-3 font-medium">Prioridad</th>
            <th className="px-4 py-3 font-medium">Asignado a</th>
            <th className="px-4 py-3 font-medium">Fecha</th>
            <th className="px-4 py-3 font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {tickets.map((ticket) => {
            const citizen = unwrapEmbed(ticket.citizen)
            const assignee = unwrapEmbed(ticket.assignee)
            const assigneeProfile = assignee ? unwrapEmbed(assignee.profiles) : null
            const status = ticket.status ?? 'nuevo'
            const priority = ticket.priority ?? 'media'
            const href = `/equipo/tickets/${ticket.id}`

            return (
              <tr
                key={ticket.id}
                onClick={() => router.push(href)}
                className="cursor-pointer hover:bg-gray-50"
              >
                <td className="px-4 py-3 font-mono text-xs text-gray-400">{ticket.id.slice(0, 8)}</td>
                <td className="px-4 py-3 text-gray-700">{TIPO_TRAMITE_LABELS[ticket.type] ?? ticket.type}</td>
                <td className="px-4 py-3">
                  <p className="max-w-[220px] truncate font-medium text-gray-900">{ticket.title}</p>
                  <p className="text-xs text-gray-400">{CATEGORY_LABELS[ticket.category] ?? ticket.category}</p>
                </td>
                <td className="px-4 py-3 text-gray-700">{citizen?.full_name ?? '—'}</td>
                <td className="px-4 py-3 text-gray-700">{ticket.localidad ?? '—'}</td>
                <td className="px-4 py-3">
                  <StatusBadgeEquipo status={status} />
                </td>
                <td className="px-4 py-3">
                  <PriorityBadge priority={priority} />
                </td>
                <td className="px-4 py-3 text-gray-700">{assigneeProfile?.full_name ?? 'Sin asignar'}</td>
                <td className="px-4 py-3 text-gray-500">
                  {ticket.created_at ? diasDesde(ticket.created_at) : '—'}
                </td>
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <Link href={href} className="font-medium text-brand-azul hover:underline">
                    Ver
                  </Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
