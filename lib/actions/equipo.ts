'use server'

import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { STATUS_LABELS, PRIORITY_LABELS, CATEGORY_LABELS, TICKET_STAGES } from '@/lib/constants/tickets'
import { getUser, getTeamMember } from '@/lib/supabase/auth-cache'
import { unwrapEmbed } from '@/lib/supabase/embed'
import {
  MS_POR_DIA,
  diaDeSemanaAR,
  formatDiaMes,
  inicioDeDiaAR,
  inicioDeMesAR,
} from '@/lib/utils/fecha'
import { getAttachmentFromFormData, uploadTicketAttachment } from '@/lib/supabase/attachments'
import { validateAttachment } from '@/lib/constants/attachments'
import { sendRespuestaCiudadano, sendAsignacionOperador, sendAcuseReciboManual } from '@/lib/actions/email'

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
  if (!user) return { error: 'No autorizado — sin usuario' }
  const teamMember = await getTeamMember()
  if (!teamMember) return { error: 'No autorizado — sin team member' }

  const parsed = NotaInternaSchema.safeParse({ ticket_id: ticketId, content })
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const { error } = await supabase.from('ticket_events').insert({
    ticket_id: parsed.data.ticket_id,
    author_id: user.id,
    type: 'internal_note',
    content: parsed.data.content,
    is_internal: true,
  })

  if (error) return { error: `DB Error: ${error.code} - ${error.message}` }

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

  const { data: ticket } = await supabase
    .from('tickets')
    .select('title, citizen:profiles!tickets_citizen_id_fkey(email)')
    .eq('id', parsed.data.ticket_id)
    .single()

  const citizenEmail = ticket ? unwrapEmbed(ticket.citizen)?.email : null
  if (ticket && citizenEmail) {
    await sendRespuestaCiudadano({
      to: citizenEmail,
      ticketId: parsed.data.ticket_id,
      title: ticket.title,
      respuesta: parsed.data.content,
    }).catch(() => {})
  }

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
      .select('user_id, profiles(full_name, email)')
      .eq('id', parsed.data.assignee_id)
      .single()
    const assigneeProfile = unwrapEmbed(assigneeMember?.profiles)
    assigneeName = assigneeProfile?.full_name ?? 'un operador'

    if (assigneeMember && assigneeMember.user_id !== user.id && assigneeProfile?.email) {
      const { data: asignadorProfile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single()

      const { data: ticket } = await supabase
        .from('tickets')
        .select('title')
        .eq('id', parsed.data.ticket_id)
        .single()

      if (ticket) {
        await sendAsignacionOperador({
          to: assigneeProfile.email,
          operadorNombre: assigneeName,
          ticketId: parsed.data.ticket_id,
          title: ticket.title,
          asignadoPor: asignadorProfile?.full_name ?? 'Un operador',
        }).catch(() => {})
      }
    }
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

  const { data: current } = await supabase
    .from('tickets')
    .select('priority')
    .eq('id', parsed.data.ticket_id)
    .single()

  if (!current) return { error: 'Ticket no encontrado' }

  const oldPriority = current.priority ?? 'media'

  const { error } = await supabase
    .from('tickets')
    .update({ priority: parsed.data.priority, updated_at: new Date().toISOString() })
    .eq('id', parsed.data.ticket_id)

  if (error) return { error: 'No se pudo cambiar la prioridad' }

  await supabase.from('ticket_events').insert({
    ticket_id: parsed.data.ticket_id,
    author_id: user.id,
    type: 'priority_change',
    content: `Prioridad cambiada de ${PRIORITY_LABELS[oldPriority] ?? oldPriority} a ${PRIORITY_LABELS[parsed.data.priority]}`,
    is_internal: true,
    old_priority: oldPriority,
    new_priority: parsed.data.priority,
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
  // El servidor corre en UTC; los cortes de mes y semana son los del calendario argentino.
  const startOfMonth = inicioDeMesAR(now)

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

  // Domingo 00:00 (hora AR) de la semana en curso.
  const domingoActual = new Date(
    inicioDeDiaAR(now).getTime() - diaDeSemanaAR(now) * MS_POR_DIA
  )

  const serieSemanal: { semana: string; cantidad: number }[] = []
  for (let i = 7; i >= 0; i--) {
    const weekStart = new Date(domingoActual.getTime() - i * 7 * MS_POR_DIA)
    const weekEnd = new Date(weekStart.getTime() + 7 * MS_POR_DIA)

    const cantidad = allTickets.filter((t) => {
      if (!t.created_at) return false
      const created = new Date(t.created_at)
      return created >= weekStart && created < weekEnd
    }).length

    serieSemanal.push({
      semana: formatDiaMes(weekStart),
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

const CambiarCategoriaSchema = z.object({
  ticket_id: z.string().uuid(),
  category: z.string().min(1),
})

export async function cambiarCategoria(ticketId: string, category: string): Promise<EquipoActionState> {
  const supabase = await createClient()
  const user = await getUser()
  if (!user) return { error: 'No autorizado' }
  const teamMember = await getTeamMember()
  if (!teamMember) return { error: 'No autorizado' }

  const parsed = CambiarCategoriaSchema.safeParse({ ticket_id: ticketId, category })
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const { error } = await supabase
    .from('tickets')
    .update({ category: parsed.data.category, updated_at: new Date().toISOString() })
    .eq('id', parsed.data.ticket_id)

  if (error) return { error: 'No se pudo cambiar la categoría' }

  await supabase.from('ticket_events').insert({
    ticket_id: parsed.data.ticket_id,
    author_id: user.id,
    type: 'internal_note',
    content: `Categoría corregida a: ${CATEGORY_LABELS[parsed.data.category] ?? parsed.data.category}`,
    is_internal: true,
  })

  revalidatePath(`/equipo/tickets/${parsed.data.ticket_id}`)
  revalidatePath('/equipo/tickets')
  return {}
}

const CrearConsultaManualSchema = z.object({
  contact_name: z.string().trim().min(2).max(100),
  contact_email: z.string().trim().email(),
  contact_phone: z.string().trim().max(20).optional(),
  contact_dni: z.string().trim().max(10).optional(),
  contact_localidad: z.string().trim().max(100).optional(),
  type: z.enum(['reclamo', 'pedido']),
  category: z.string().min(2),
  area: z.string().min(2),
  title: z.string().trim().min(5).max(200),
  description: z.string().trim().min(10).max(2000),
  priority: z.enum(['baja', 'media', 'alta']),
  localidad: z.string().trim().max(100).optional(),
})

export async function crearConsultaManual(
  _prevState: EquipoActionState,
  formData: FormData
): Promise<EquipoActionState> {
  const user = await getUser()
  if (!user) return { error: 'No autorizado' }
  const teamMember = await getTeamMember()
  if (!teamMember) return { error: 'No autorizado' }

  const parsed = CrearConsultaManualSchema.safeParse({
    contact_name: formData.get('contact_name'),
    contact_email: formData.get('contact_email'),
    contact_phone: formData.get('contact_phone') || undefined,
    contact_dni: formData.get('contact_dni') || undefined,
    contact_localidad: formData.get('contact_localidad') || undefined,
    type: formData.get('type'),
    category: formData.get('category'),
    area: formData.get('area'),
    title: formData.get('title'),
    description: formData.get('description'),
    priority: formData.get('priority'),
    localidad: formData.get('localidad') || undefined,
  })

  if (!parsed.success) return { error: parsed.error.issues[0].message }

  // El adjunto se valida antes de insertar para no dejar un ticket huérfano.
  const photo = getAttachmentFromFormData(formData)
  if (photo) {
    const photoError = validateAttachment(photo)
    if (photoError) return { error: photoError }
  }

  const supabase = await createClient()
  const localidadDelProblema = parsed.data.localidad || parsed.data.contact_localidad || ''

  const { data: ticket, error } = await supabase
    .from('tickets')
    .insert({
      citizen_id: user.id,
      contact_name: parsed.data.contact_name,
      contact_email: parsed.data.contact_email,
      contact_phone: parsed.data.contact_phone || null,
      contact_dni: parsed.data.contact_dni || null,
      type: parsed.data.type,
      category: parsed.data.category,
      area: parsed.data.area,
      title: parsed.data.title,
      description: parsed.data.description,
      priority: parsed.data.priority,
      localidad: localidadDelProblema,
      status: 'nuevo',
    })
    .select('id, title, type')
    .single()

  if (error || !ticket) return { error: 'Error al registrar la consulta' }

  await supabase.from('ticket_events').insert({
    ticket_id: ticket.id,
    author_id: user.id,
    type: 'status_change',
    content: `Consulta cargada manualmente por el equipo para ${parsed.data.contact_name}.`,
    new_status: 'nuevo',
    is_internal: false,
  })

  if (photo) {
    await uploadTicketAttachment(supabase, ticket.id, photo)
  }

  try {
    await sendAcuseReciboManual({
      to: parsed.data.contact_email,
      contactName: parsed.data.contact_name,
      ticketId: ticket.id,
      title: ticket.title,
      type: ticket.type,
    })
  } catch (e) {
    console.error('Error enviando email:', e)
  }

  revalidatePath('/equipo/tickets')
  redirect(`/equipo/tickets?nueva=true`)
}

export interface ContactoExport {
  nombre: string
  email: string
  telefono: string
  dni: string
  localidad: string
  fecha: string
}

export interface ExportarContactosResult {
  data?: ContactoExport[]
  error?: string
}

export async function exportarContactos(): Promise<ExportarContactosResult> {
  const teamMember = await getTeamMember()
  if (!teamMember) return { error: 'No autorizado' }
  if (teamMember.role !== 'admin') return { error: 'Solo un admin puede exportar contactos' }

  const supabase = await createClient()

  const { data: profiles } = await supabase
    .from('profiles')
    .select('full_name, email, phone, dni, localidad, localidad_tipo, barrio, departamento, created_at')
    .eq('profile_complete', true)

  const { data: manuales } = await supabase
    .from('tickets')
    .select('contact_name, contact_email, contact_phone, contact_dni, created_at')
    .not('contact_email', 'is', null)

  // Combinar y deduplicar por email: si el vecino ya tiene perfil (Google),
  // ese registro prevalece por sobre los datos de contacto cargados manualmente.
  const contactos = new Map<string, ContactoExport>()

  for (const p of profiles ?? []) {
    if (!p.email) continue
    contactos.set(p.email.toLowerCase(), {
      nombre: p.full_name ?? '',
      email: p.email,
      telefono: p.phone ?? '',
      dni: p.dni ?? '',
      localidad: p.localidad || (p.localidad_tipo === 'capital' ? p.barrio : p.departamento) || '',
      fecha: p.created_at ?? '',
    })
  }

  for (const m of manuales ?? []) {
    if (!m.contact_email) continue
    const key = m.contact_email.toLowerCase()
    if (contactos.has(key)) continue
    contactos.set(key, {
      nombre: m.contact_name ?? '',
      email: m.contact_email,
      telefono: m.contact_phone ?? '',
      dni: m.contact_dni ?? '',
      localidad: '',
      fecha: m.created_at ?? '',
    })
  }

  return {
    data: Array.from(contactos.values()).sort((a, b) => a.nombre.localeCompare(b.nombre)),
  }
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
