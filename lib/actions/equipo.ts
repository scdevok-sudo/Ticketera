'use server'

import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { STATUS_LABELS, PRIORITY_LABELS, TICKET_STAGES } from '@/lib/constants/tickets'
import { getUser, getTeamMember } from '@/lib/supabase/auth-cache'
import { unwrapEmbed } from '@/lib/supabase/embed'

export type EquipoActionState = {
  error?: string
}

const NotaInternaSchema = z.object({
  ticket_id: z.string().uuid(),
  content: z.string().min(1).max(1000),
})

export async function addNotaInterna(ticketId: string, content: string): Promise<EquipoActionState> {
  const supabase = await createClient()
  const user = await getUser()
  if (!user) return { error: 'No autorizado' }
  const teamMember = await getTeamMember()
  if (!teamMember) return { error: 'No autorizado' }

  const parsed = NotaInternaSchema.safeParse({ ticket_id: ticketId, content })
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const { error } = await supabase.from('ticket_events').insert({
    ticket_id: parsed.data.ticket_id,
    author_id: user.id,
    type: 'internal_note',
    content: parsed.data.content,
    is_internal: true,
  })

  if (error) return { error: 'No se pudo guardar la nota' }

  revalidatePath(`/equipo/tickets/${parsed.data.ticket_id}`)
  return {}
}

const RespuestaSchema = z.object({
  ticket_id: z.string().uuid(),
  content: z.string().min(1).max(1000),
})

export async function addRespuestaCiudadano(ticketId: string, content: string): Promise<EquipoActionState> {
  const supabase = await createClient()
  const user = await getUser()
  if (!user) return { error: 'No autorizado' }
  const teamMember = await getTeamMember()
  if (!teamMember) return { error: 'No autorizado' }

  const parsed = RespuestaSchema.safeParse({ ticket_id: ticketId, content })
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const { error } = await supabase.from('ticket_events').insert({
    ticket_id: parsed.data.ticket_id,
    author_id: user.id,
    type: 'response',
    content: parsed.data.content,
    is_internal: false,
  })

  if (error) return { error: 'No se pudo enviar la respuesta' }

  revalidatePath(`/equipo/tickets/${parsed.data.ticket_id}`)
  return {}
}

const CambiarEstadoSchema = z.object({
  ticket_id: z.string().uuid(),
  new_status: z.enum(['nuevo', 'en_revision', 'derivado', 'en_gestion', 'requiere_info', 'resuelto']),
})

export async function cambiarEstado(ticketId: string, newStatus: string): Promise<EquipoActionState> {
  const supabase = await createClient()
  const user = await getUser()
  if (!user) return { error: 'No autorizado' }
  const teamMember = await getTeamMember()
  if (!teamMember) return { error: 'No autorizado' }

  const parsed = CambiarEstadoSchema.safeParse({ ticket_id: ticketId, new_status: newStatus })
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const { data: current } = await supabase
    .from('tickets')
    .select('status')
    .eq('id', parsed.data.ticket_id)
    .single()

  if (!current) return { error: 'Ticket no encontrado' }

  const oldStatus = current.status ?? 'nuevo'

  const { error } = await supabase
    .from('tickets')
    .update({ status: parsed.data.new_status, updated_at: new Date().toISOString() })
    .eq('id', parsed.data.ticket_id)

  if (error) return { error: 'No se pudo cambiar el estado' }

  await supabase.from('ticket_events').insert({
    ticket_id: parsed.data.ticket_id,
    author_id: user.id,
    type: 'status_change',
    content: `Estado cambiado de ${STATUS_LABELS[oldStatus] ?? oldStatus} a ${STATUS_LABELS[parsed.data.new_status]}`,
    is_internal: false,
    old_status: oldStatus,
    new_status: parsed.data.new_status,
  })

  revalidatePath(`/equipo/tickets/${parsed.data.ticket_id}`)
  revalidatePath('/equipo/tickets')
  return {}
}

const AsignarSchema = z.object({
  ticket_id: z.string().uuid(),
  assignee_id: z.string().uuid().nullable(),
  nota: z.string().max(500).optional(),
})

export async function asignarTicket(
  ticketId: string,
  assigneeId: string | null,
  nota?: string
): Promise<EquipoActionState> {
  const supabase = await createClient()
  const user = await getUser()
  if (!user) return { error: 'No autorizado' }
  const teamMember = await getTeamMember()
  if (!teamMember) return { error: 'No autorizado' }

  const parsed = AsignarSchema.safeParse({ ticket_id: ticketId, assignee_id: assigneeId, nota })
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const { error } = await supabase
    .from('tickets')
    .update({ assigned_to: parsed.data.assignee_id, updated_at: new Date().toISOString() })
    .eq('id', parsed.data.ticket_id)

  if (error) return { error: 'No se pudo asignar el ticket' }

  let assigneeName = 'nadie (sin asignar)'
  if (parsed.data.assignee_id) {
    // tickets.assigned_to referencia team_members.id, no profiles.id:
    // hay que resolver el nombre pasando por team_members.
    const { data: assigneeMember } = await supabase
      .from('team_members')
      .select('profiles(full_name)')
      .eq('id', parsed.data.assignee_id)
      .single()
    assigneeName = unwrapEmbed(assigneeMember?.profiles)?.full_name ?? 'un operador'
  }

  await supabase.from('ticket_events').insert({
    ticket_id: parsed.data.ticket_id,
    author_id: user.id,
    type: 'assignment',
    content: parsed.data.nota?.trim() || `Ticket asignado a ${assigneeName}`,
    is_internal: true,
  })

  revalidatePath(`/equipo/tickets/${parsed.data.ticket_id}`)
  revalidatePath('/equipo/tickets')
  return {}
}

const PrioridadSchema = z.object({
  ticket_id: z.string().uuid(),
  priority: z.enum(['alta', 'media', 'baja']),
})

export async function cambiarPrioridad(ticketId: string, priority: string): Promise<EquipoActionState> {
  const supabase = await createClient()
  const user = await getUser()
  if (!user) return { error: 'No autorizado' }
  const teamMember = await getTeamMember()
  if (!teamMember) return { error: 'No autorizado' }

  const parsed = PrioridadSchema.safeParse({ ticket_id: ticketId, priority })
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const { error } = await supabase
    .from('tickets')
    .update({ priority: parsed.data.priority, updated_at: new Date().toISOString() })
    .eq('id', parsed.data.ticket_id)

  if (error) return { error: 'No se pudo cambiar la prioridad' }

  await supabase.from('ticket_events').insert({
    ticket_id: parsed.data.ticket_id,
    author_id: user.id,
    type: 'internal_note',
    content: `Prioridad cambiada a ${PRIORITY_LABELS[parsed.data.priority]}`,
    is_internal: true,
  })

  revalidatePath(`/equipo/tickets/${parsed.data.ticket_id}`)
  revalidatePath('/equipo/tickets')
  return {}
}

const TogglePublicoSchema = z.object({
  ticket_id: z.string().uuid(),
  is_public: z.boolean(),
})

export async function toggleTicketPublico(ticketId: string, isPublic: boolean): Promise<EquipoActionState> {
  const supabase = await createClient()
  const user = await getUser()
  if (!user) return { error: 'No autorizado' }
  const teamMember = await getTeamMember()
  if (!teamMember) return { error: 'No autorizado' }

  const parsed = TogglePublicoSchema.safeParse({ ticket_id: ticketId, is_public: isPublic })
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const { error } = await supabase
    .from('tickets')
    .update({ is_public: parsed.data.is_public })
    .eq('id', parsed.data.ticket_id)

  if (error) return { error: 'No se pudo actualizar la visibilidad' }

  await supabase.from('ticket_events').insert({
    ticket_id: parsed.data.ticket_id,
    author_id: user.id,
    type: 'internal_note',
    content: parsed.data.is_public
      ? 'Caso marcado como visible en el portal de transparencia'
      : 'Caso retirado del portal de transparencia',
    is_internal: true,
  })

  revalidatePath(`/equipo/tickets/${parsed.data.ticket_id}`)
  revalidatePath('/transparencia')
  return {}
}

export async function getTeamMembers() {
  const supabase = await createClient()
  const teamMember = await getTeamMember()
  if (!teamMember) return []

  const { data } = await supabase
    .from('team_members')
    .select('id, user_id, role, area, created_at, profiles(full_name, email)')
    .eq('active', true)
    .order('created_at', { ascending: true })

  return data ?? []
}

export interface KPIData {
  totalTickets: number
  nuevos: number
  enGestion: number
  resueltosEsteMes: number
  tiempoPromedioResolucionDias: number | null
  altaPrioridadSinAsignar: number
  serieSemanal: { semana: string; cantidad: number }[]
  porEstado: { estado: string; cantidad: number }[]
  porOperador: {
    id: string
    nombre: string
    ticketsActivos: number
    resueltosEsteMes: number
    porcentajeResolucion: number
  }[]
}

const EMPTY_KPIS: KPIData = {
  totalTickets: 0,
  nuevos: 0,
  enGestion: 0,
  resueltosEsteMes: 0,
  tiempoPromedioResolucionDias: null,
  altaPrioridadSinAsignar: 0,
  serieSemanal: [],
  porEstado: [],
  porOperador: [],
}

export async function getKPIs(): Promise<KPIData> {
  const supabase = await createClient()
  const teamMember = await getTeamMember()
  if (!teamMember) return EMPTY_KPIS

  const { data: ticketsData } = await supabase
    .from('tickets')
    .select('id, status, priority, assigned_to, created_at, updated_at')

  const allTickets = ticketsData ?? []

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const porEstadoMap: Record<string, number> = {}
  for (const stage of TICKET_STAGES) porEstadoMap[stage.key] = 0
  for (const t of allTickets) {
    const status = t.status ?? 'nuevo'
    porEstadoMap[status] = (porEstadoMap[status] ?? 0) + 1
  }

  const resueltos = allTickets.filter((t) => t.status === 'resuelto')
  const resueltosEsteMes = resueltos.filter(
    (t) => t.updated_at && new Date(t.updated_at) >= startOfMonth
  ).length

  const tiemposResolucion = resueltos
    .filter((t) => t.created_at && t.updated_at)
    .map(
      (t) =>
        (new Date(t.updated_at as string).getTime() - new Date(t.created_at as string).getTime()) /
        (1000 * 60 * 60 * 24)
    )

  const tiempoPromedioResolucionDias =
    tiemposResolucion.length > 0
      ? tiemposResolucion.reduce((sum, d) => sum + d, 0) / tiemposResolucion.length
      : null

  const altaPrioridadSinAsignar = allTickets.filter(
    (t) => t.priority === 'alta' && !t.assigned_to
  ).length

  const serieSemanal: { semana: string; cantidad: number }[] = []
  for (let i = 7; i >= 0; i--) {
    const weekStart = new Date(now)
    weekStart.setHours(0, 0, 0, 0)
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() - i * 7)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 7)

    const cantidad = allTickets.filter((t) => {
      if (!t.created_at) return false
      const created = new Date(t.created_at)
      return created >= weekStart && created < weekEnd
    }).length

    serieSemanal.push({
      semana: weekStart.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' }),
      cantidad,
    })
  }

  const { data: members } = await supabase
    .from('team_members')
    .select('id, profiles(full_name)')
    .eq('active', true)

  const porOperador = (members ?? []).map((m) => {
    const nombre = unwrapEmbed(m.profiles)?.full_name ?? 'Sin nombre'
    // tickets.assigned_to referencia team_members.id, no el user_id del operador.
    const ticketsDelOperador = allTickets.filter((t) => t.assigned_to === m.id)
    const ticketsActivos = ticketsDelOperador.filter((t) => t.status !== 'resuelto').length
    const resueltosOperador = ticketsDelOperador.filter((t) => t.status === 'resuelto')
    const resueltosEsteMesOperador = resueltosOperador.filter(
      (t) => t.updated_at && new Date(t.updated_at) >= startOfMonth
    ).length
    const porcentajeResolucion =
      ticketsDelOperador.length > 0
        ? Math.round((resueltosOperador.length / ticketsDelOperador.length) * 100)
        : 0

    return {
      id: m.id,
      nombre,
      ticketsActivos,
      resueltosEsteMes: resueltosEsteMesOperador,
      porcentajeResolucion,
    }
  })

  return {
    totalTickets: allTickets.length,
    nuevos: porEstadoMap.nuevo ?? 0,
    enGestion: porEstadoMap.en_gestion ?? 0,
    resueltosEsteMes,
    tiempoPromedioResolucionDias,
    altaPrioridadSinAsignar,
    serieSemanal,
    porEstado: TICKET_STAGES.map((s) => ({ estado: s.key, cantidad: porEstadoMap[s.key] ?? 0 })),
    porOperador,
  }
}

const AgregarMiembroSchema = z.object({
  email: z.string().email(),
  role: z.enum(['admin', 'operator']),
  area: z.string().min(1),
})

export async function agregarMiembro(email: string, role: string, area: string): Promise<EquipoActionState> {
  const supabase = await createClient()
  const teamMember = await getTeamMember()
  if (!teamMember) return { error: 'No autorizado' }
  if (teamMember.role !== 'admin') return { error: 'Solo un admin puede agregar miembros' }

  const parsed = AgregarMiembroSchema.safeParse({ email, role, area })
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', parsed.data.email)
    .single()

  if (!profile) {
    return { error: 'El usuario debe haber iniciado sesión al menos una vez' }
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) return { error: 'Falta configurar SUPABASE_SERVICE_ROLE_KEY' }

  const serviceClient = createServiceClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey)

  const { error } = await serviceClient.from('team_members').insert({
    user_id: profile.id,
    role: parsed.data.role,
    area: parsed.data.area,
    active: true,
  })

  if (error) return { error: 'No se pudo agregar el miembro' }

  revalidatePath('/equipo/equipo')
  return {}
}

export async function desactivarMiembro(memberId: string): Promise<EquipoActionState> {
  const supabase = await createClient()
  const teamMember = await getTeamMember()
  if (!teamMember) return { error: 'No autorizado' }
  if (teamMember.role !== 'admin') return { error: 'Solo un admin puede desactivar miembros' }

  const parsed = z.string().uuid().safeParse(memberId)
  if (!parsed.success) return { error: 'ID de miembro inválido' }

  const { error } = await supabase
    .from('team_members')
    .update({ active: false })
    .eq('id', parsed.data)

  if (error) return { error: 'No se pudo desactivar el miembro' }

  revalidatePath('/equipo/equipo')
  return {}
}
