'use server'

import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { sendAcuseRecibo } from '@/lib/actions/email'
import { getUser, getTeamMember } from '@/lib/supabase/auth-cache'

const TicketSchema = z.object({
  type: z.enum(['reclamo', 'pedido', 'pregunta']),
  category: z.string().min(2).max(100),
  title: z.string().min(5).max(200).trim(),
  description: z.string().min(10).max(2000).trim(),
  localidad: z.string().min(2).max(200).trim(),
})

export type TicketFormState = {
  error?: string
}

export async function createTicket(
  _prevState: TicketFormState,
  formData: FormData
): Promise<TicketFormState> {
  const supabase = await createClient()

  const user = await getUser()
  if (!user) return { error: 'No autenticado' }

  const parsed = TicketSchema.safeParse({
    type: formData.get('type'),
    category: formData.get('category'),
    title: formData.get('title'),
    description: formData.get('description'),
    localidad: formData.get('localidad'),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const { count } = await supabase
    .from('tickets')
    .select('*', { count: 'exact', head: true })
    .eq('citizen_id', user.id)
    .gte('created_at', yesterday)

  if (count && count >= 5) {
    return { error: 'Podés registrar hasta 5 consultas por día. Intentá mañana.' }
  }

  const { data: ticket, error } = await supabase
    .from('tickets')
    .insert({
      citizen_id: user.id,
      type: parsed.data.type,
      category: parsed.data.category,
      title: parsed.data.title,
      description: parsed.data.description,
      localidad: parsed.data.localidad,
      status: 'nuevo',
      priority: 'media',
    })
    .select('id, title, type')
    .single()

  if (error || !ticket) return { error: 'Error al registrar la consulta' }

  await supabase.from('ticket_events').insert({
    ticket_id: ticket.id,
    author_id: user.id,
    type: 'status_change',
    content: 'Consulta recibida y registrada en el sistema.',
    new_status: 'nuevo',
    is_internal: false,
  })

  const rawPhoto = formData.get('photo') as File | null
  const photo =
    rawPhoto && rawPhoto.size > 0 && rawPhoto.type !== 'application/octet-stream' ? rawPhoto : null

  if (photo) {
    const allowedTypes = ['image/jpeg', 'image/png']
    if (!allowedTypes.includes(photo.type)) {
      console.error('Tipo de archivo no permitido')
    } else if (photo.size > 5 * 1024 * 1024) {
      console.error('Archivo demasiado grande')
    } else {
      const fileExt = photo.type === 'image/jpeg' ? 'jpg' : 'png'
      const fileName = `${crypto.randomUUID()}.${fileExt}`
      const storagePath = `tickets/${ticket.id}/${fileName}`

      const arrayBuffer = await photo.arrayBuffer()
      const { error: uploadError } = await supabase.storage
        .from('attachments')
        .upload(storagePath, arrayBuffer, {
          contentType: photo.type,
          upsert: false,
        })

      if (!uploadError) {
        await supabase.from('ticket_attachments').insert({
          ticket_id: ticket.id,
          storage_path: storagePath,
          file_name: fileName,
          file_size: photo.size,
        })
      }
    }
  }

  try {
    await sendAcuseRecibo({
      to: user.email!,
      ticketId: ticket.id,
      title: ticket.title,
      type: ticket.type,
    })
  } catch (e) {
    console.error('Error enviando email:', e)
  }

  redirect(`/ciudadano/mis-reclamos/${ticket.id}?nuevo=true`)
}

export async function getMyTickets() {
  const supabase = await createClient()
  const user = await getUser()
  if (!user) return []

  const { data } = await supabase
    .from('tickets')
    .select('id, title, category, type, status, priority, localidad, created_at, updated_at, likes_count')
    .eq('citizen_id', user.id)
    .order('created_at', { ascending: false })

  return data || []
}

export async function getTicketById(id: string) {
  const supabase = await createClient()
  const user = await getUser()
  if (!user) return null

  const { data: ticket } = await supabase
    .from('tickets')
    .select(
      `
      id, title, category, type, status, priority, description, localidad, created_at, updated_at, likes_count,
      ticket_events(id, type, content, is_internal, old_status, new_status, created_at, author_id),
      ticket_attachments(id, storage_path, file_name)
    `
    )
    .eq('id', id)
    .eq('citizen_id', user.id)
    .single()

  return ticket
}

export async function addLike(ticketId: string) {
  const supabase = await createClient()
  const user = await getUser()
  if (!user) return { error: 'No autenticado' }

  const parsed = z.string().uuid().safeParse(ticketId)
  if (!parsed.success) return { error: 'ID inválido' }

  const { error } = await supabase
    .from('ticket_likes')
    .insert({ ticket_id: parsed.data, citizen_id: user.id })

  if (error?.code === '23505') return { error: 'Ya diste adhesión a esta consulta' }
  if (error) return { error: 'Error al registrar adhesión' }

  revalidatePath(`/ciudadano/mis-reclamos/${parsed.data}`)
  return { success: true }
}

export async function removeLike(ticketId: string) {
  const supabase = await createClient()
  const user = await getUser()
  if (!user) return { error: 'No autenticado' }

  const parsed = z.string().uuid().safeParse(ticketId)
  if (!parsed.success) return { error: 'ID inválido' }

  await supabase
    .from('ticket_likes')
    .delete()
    .eq('ticket_id', parsed.data)
    .eq('citizen_id', user.id)

  revalidatePath(`/ciudadano/mis-reclamos/${parsed.data}`)
  return { success: true }
}

export async function getConsultasPublicas(page = 1, pageSize = 20) {
  const supabase = await createClient()
  const user = await getUser()
  if (!user) return { consultas: [], total: 0 }

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, count } = await supabase
    .from('tickets')
    .select(
      `
      id,
      title,
      category,
      type,
      localidad,
      status,
      likes_count,
      created_at,
      citizen_id
    `,
      { count: 'exact' }
    )
    .eq('is_public', true)
    .neq('citizen_id', user.id)
    .order('likes_count', { ascending: false })
    .order('created_at', { ascending: false })
    .range(from, to)

  // Para cada ticket, verificar si el usuario ya dio adhesión
  const ticketIds = (data ?? []).map((t) => t.id)
  let likedIds: string[] = []
  if (ticketIds.length > 0) {
    const { data: likes } = await supabase
      .from('ticket_likes')
      .select('ticket_id')
      .eq('citizen_id', user.id)
      .in('ticket_id', ticketIds)
    likedIds = (likes ?? []).map((l) => l.ticket_id)
  }

  const consultas = (data ?? []).map((t) => ({
    ...t,
    status: t.status ?? 'nuevo',
    likes_count: t.likes_count ?? 0,
    hasLiked: likedIds.includes(t.id),
  }))

  return { consultas, total: count ?? 0 }
}

// ---- Equipo (dashboard interno) ----

export interface TicketFilters {
  estado?: string
  prioridad?: string
  area?: string
  responsable?: string
  tipo?: string
  q?: string
  page?: number
}

const PAGE_SIZE = 20

const EQUIPO_TICKET_SELECT = `
  id, title, category, type, status, priority, localidad, created_at, assigned_to, citizen_id,
  citizen:profiles!tickets_citizen_id_fkey(full_name),
  assignee:team_members!tickets_assigned_to_fkey(profiles(full_name))
`

export async function getAllTickets(filters: TicketFilters) {
  const supabase = await createClient()
  const teamMember = await getTeamMember()
  if (!teamMember) return { tickets: [], total: 0, page: 1, pageSize: PAGE_SIZE }

  const page = filters.page && filters.page > 0 ? filters.page : 1
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let query = supabase
    .from('tickets')
    .select(EQUIPO_TICKET_SELECT, { count: 'exact' })
    .order('created_at', { ascending: false })

  if (filters.estado) query = query.eq('status', filters.estado)
  if (filters.prioridad) query = query.eq('priority', filters.prioridad)
  if (filters.area) query = query.ilike('area', `%${filters.area}%`)
  if (filters.responsable) query = query.eq('assigned_to', filters.responsable)
  if (filters.tipo) query = query.eq('type', filters.tipo)
  if (filters.q) query = query.or(`title.ilike.%${filters.q}%,description.ilike.%${filters.q}%`)

  const { data, count } = await query.range(from, to)

  return {
    tickets: data ?? [],
    total: count ?? 0,
    page,
    pageSize: PAGE_SIZE,
  }
}

export async function getTicketByIdEquipo(id: string) {
  const supabase = await createClient()
  const teamMember = await getTeamMember()
  if (!teamMember) return null

  const { data: ticket } = await supabase
    .from('tickets')
    .select(
      `
      id, type, category, title, description, localidad, status, priority, likes_count, is_public, created_at, updated_at,
      citizen:profiles!tickets_citizen_id_fkey(full_name, email, phone, localidad, barrio, departamento, sexo),
      assignee:team_members!tickets_assigned_to_fkey(id, role, area, profiles(full_name, email)),
      ticket_events(id, type, content, is_internal, created_at, author:profiles(full_name)),
      ticket_attachments(id, storage_path, file_name)
    `
    )
    .eq('id', id)
    .single()

  return ticket
}
