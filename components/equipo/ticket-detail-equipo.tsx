import Link from 'next/link'
import { unwrapEmbed } from '@/lib/supabase/embed'
import {
  CATEGORY_LABELS,
  TIPO_TRAMITE_LABELS,
  EVENT_TYPE_LABELS,
} from '@/lib/constants/tickets'
import { StatusBadgeEquipo, PriorityBadge } from '@/components/equipo/badges'
import { CambiarEstado } from '@/components/equipo/cambiar-estado'
import { AsignarTicket } from '@/components/equipo/asignar-ticket'
import { NotaInterna } from '@/components/equipo/nota-interna'
import { PublicoToggle } from '@/components/equipo/publico-toggle'

interface Citizen {
  full_name: string | null
  email: string | null
  phone: string | null
  localidad: string | null
  barrio: string | null
  departamento: string | null
  sexo: string | null
}

const SEXO_LABELS: Record<string, string> = {
  masculino: 'Masculino',
  femenino: 'Femenino',
  otro: 'Otro',
  prefiero_no_decir: 'Prefiere no decir',
}

interface AssigneeProfile {
  full_name: string | null
  email: string | null
}

interface Assignee {
  id: string
  role: string | null
  area: string | null
  profiles: AssigneeProfile | AssigneeProfile[] | null
}

interface Author {
  full_name: string | null
}

interface TicketEvent {
  id: string
  type: string
  content: string | null
  is_internal: boolean | null
  created_at: string | null
  author: Author | Author[] | null
}

interface Attachment {
  id: string
  storage_path: string
  file_name: string
}

export interface TicketDetalle {
  id: string
  type: string
  category: string
  title: string
  description: string
  localidad: string | null
  status: string | null
  priority: string | null
  likes_count: number | null
  is_public: boolean | null
  created_at: string | null
  updated_at: string | null
  citizen: Citizen | Citizen[] | null
  assignee: Assignee | Assignee[] | null
  ticket_events: TicketEvent[]
  ticket_attachments: Attachment[]
}

interface TeamMemberOption {
  id: string
  nombre: string
  area: string | null
}

interface TicketDetailEquipoProps {
  ticket: TicketDetalle
  teamMembers: TeamMemberOption[]
  photoUrl: string | null
}

function formatFechaHora(fecha: string) {
  return new Date(fecha).toLocaleString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function TicketDetailEquipo({ ticket, teamMembers, photoUrl }: TicketDetailEquipoProps) {
  const citizen = unwrapEmbed(ticket.citizen)
  const assignee = unwrapEmbed(ticket.assignee)
  const assigneeProfile = assignee ? unwrapEmbed(assignee.profiles) : null
  const status = ticket.status ?? 'nuevo'
  const priority = ticket.priority ?? 'media'
  const ticketNum = ticket.id.slice(0, 8).toUpperCase()

  const events = [...ticket.ticket_events].sort(
    (a, b) => new Date(a.created_at ?? 0).getTime() - new Date(b.created_at ?? 0).getTime()
  )

  return (
    <div>
      <Link
        href="/equipo/tickets"
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-brand-azul"
      >
        ← Tickets
      </Link>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
        <div className="space-y-4 md:col-span-3">
          <div className="rounded-lg bg-white p-5 shadow-sm">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <StatusBadgeEquipo status={status} />
              <PriorityBadge priority={priority} />
              <span className="ml-auto text-xs font-semibold text-gray-400">#UH-{ticketNum}</span>
            </div>
            <h1 className="text-lg font-bold text-gray-900">{ticket.title}</h1>
            <p className="mt-1 text-xs text-gray-500">
              {TIPO_TRAMITE_LABELS[ticket.type] ?? ticket.type} ·{' '}
              {CATEGORY_LABELS[ticket.category] ?? ticket.category}
              {ticket.created_at ? ` · ${formatFechaHora(ticket.created_at)}` : ''}
            </p>

            <p className="mt-4 whitespace-pre-line text-sm text-gray-700">{ticket.description}</p>

            {photoUrl && (
              <div className="mt-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoUrl}
                  alt="Foto adjunta de la consulta"
                  className="max-h-72 w-full rounded-lg object-cover"
                />
                <a
                  href={photoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-block text-xs font-medium text-brand-azul hover:underline"
                >
                  Ver imagen en tamaño completo
                </a>
              </div>
            )}
          </div>

          <div className="rounded-lg bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-bold text-gray-900">Línea de tiempo</h2>
            <div className="space-y-3">
              {events.length === 0 && (
                <p className="text-sm text-gray-400">Todavía no hay eventos registrados.</p>
              )}
              {events.map((event) => {
                const author = unwrapEmbed(event.author)
                const isInternal = !!event.is_internal
                return (
                  <div
                    key={event.id}
                    className={`rounded-lg p-3 ${
                      isInternal
                        ? 'border-l-4 border-yellow-400 bg-gray-50'
                        : 'border-l-4 border-brand-azul bg-white'
                    }`}
                  >
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold text-gray-700">
                        {EVENT_TYPE_LABELS[event.type] ?? event.type}
                      </span>
                      {isInternal && (
                        <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-yellow-800">
                          Nota interna
                        </span>
                      )}
                      <span className="ml-auto text-xs text-gray-400">
                        {event.created_at ? formatFechaHora(event.created_at) : ''}
                      </span>
                    </div>
                    {event.content && <p className="text-sm text-gray-700">{event.content}</p>}
                    <p className="mt-1 text-xs text-gray-400">
                      {author?.full_name ?? 'Sistema'}
                    </p>
                  </div>
                )
              })}
              <div id="timeline-end" />
            </div>
          </div>

          <NotaInterna ticketId={ticket.id} />
        </div>

        <div className="space-y-4 md:col-span-2">
          <div className="rounded-lg bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-bold text-gray-900">Datos del ciudadano</h2>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-xs text-gray-400">Nombre</dt>
                <dd className="text-gray-800">{citizen?.full_name ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-400">Email</dt>
                <dd className="text-gray-800">
                  {citizen?.email ? (
                    <a href={`mailto:${citizen.email}`} className="text-brand-azul hover:underline">
                      {citizen.email}
                    </a>
                  ) : (
                    '—'
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-400">Teléfono</dt>
                <dd className="text-gray-800">{citizen?.phone ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-400">Localidad</dt>
                <dd className="text-gray-800">
                  {ticket.localidad ?? citizen?.barrio ?? citizen?.departamento ?? '—'}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-400">Sexo</dt>
                <dd className="text-gray-800">
                  {citizen?.sexo ? SEXO_LABELS[citizen.sexo] ?? citizen.sexo : 'No informado'}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-lg bg-white p-5 shadow-sm">
            <CambiarEstado ticketId={ticket.id} currentStatus={status} />
          </div>

          <div className="rounded-lg bg-white p-5 shadow-sm">
            <AsignarTicket
              ticketId={ticket.id}
              currentAssigneeId={assignee?.id ?? null}
              teamMembers={teamMembers}
            />
            {assigneeProfile?.email && (
              <p className="mt-2 text-xs text-gray-400">{assigneeProfile.email}</p>
            )}
          </div>

          <div className="rounded-lg bg-white p-5 shadow-sm">
            <PublicoToggle ticketId={ticket.id} isPublic={ticket.is_public ?? false} />
          </div>

          <div className="rounded-lg bg-white p-5 shadow-sm">
            <h2 className="mb-2 text-sm font-bold text-gray-900">Adhesiones</h2>
            <p className="text-2xl font-bold text-brand-naranja">{ticket.likes_count ?? 0}</p>
            <p className="text-xs text-gray-400">vecinos adhirieron a esta consulta</p>
          </div>

          <div className="rounded-lg bg-white p-5 shadow-sm text-xs text-gray-500">
            <h2 className="mb-2 text-sm font-bold text-gray-900">Metadata</h2>
            <p>Creado: {ticket.created_at ? formatFechaHora(ticket.created_at) : '—'}</p>
            <p>Actualizado: {ticket.updated_at ? formatFechaHora(ticket.updated_at) : '—'}</p>
            <p className="mt-1 break-all font-mono">{ticket.id}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
