'use server'

import { createClient } from '@/lib/supabase/server'
import { STATUS_LABELS } from '@/lib/constants/tickets'

export interface StatsPublicas {
  total: number
  resueltos: number
  tasaResolucion: number
  promedioDias: number
}

export async function getStatsPublicas(): Promise<StatsPublicas> {
  const supabase = await createClient()

  const { count: total } = await supabase
    .from('tickets')
    .select('*', { count: 'exact', head: true })
    .eq('is_public', true)

  const { count: resueltos } = await supabase
    .from('tickets')
    .select('*', { count: 'exact', head: true })
    .eq('is_public', true)
    .eq('status', 'resuelto')

  const { data: ticketsResueltos } = await supabase
    .from('tickets')
    .select('created_at, updated_at')
    .eq('is_public', true)
    .eq('status', 'resuelto')

  let promedioDias = 0
  if (ticketsResueltos && ticketsResueltos.length > 0) {
    const suma = ticketsResueltos.reduce((acc, t) => {
      const diff = new Date(t.updated_at!).getTime() - new Date(t.created_at!).getTime()
      return acc + diff / (1000 * 60 * 60 * 24)
    }, 0)
    promedioDias = Math.round((suma / ticketsResueltos.length) * 10) / 10
  }

  return {
    total: total ?? 0,
    resueltos: resueltos ?? 0,
    tasaResolucion: total ? Math.round(((resueltos ?? 0) / total) * 1000) / 10 : 0,
    promedioDias,
  }
}

export interface TicketsPorCategoria {
  category: string
  count: number
}

export async function getTicketsPorCategoria(): Promise<TicketsPorCategoria[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('public_tickets_stats').select('category')

  if (!data) return []

  const counts: Record<string, number> = {}
  data.forEach((t) => {
    if (!t.category) return
    counts[t.category] = (counts[t.category] || 0) + 1
  })

  return Object.entries(counts)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
}

export interface TicketsPorEstado {
  status: string
  label: string
  count: number
}

export async function getTicketsPorEstado(): Promise<TicketsPorEstado[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('public_tickets_stats').select('status')

  if (!data) return []

  const counts: Record<string, number> = {}
  data.forEach((t) => {
    if (!t.status) return
    counts[t.status] = (counts[t.status] || 0) + 1
  })

  return Object.entries(counts).map(([status, count]) => ({
    status,
    label: STATUS_LABELS[status] ?? status,
    count,
  }))
}

export interface EvolucionMensual {
  mes: string
  count: number
}

export async function getEvolucionMensual(): Promise<EvolucionMensual[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('public_tickets_stats')
    .select('month')
    .order('month', { ascending: true })

  if (!data) return []

  const counts: Record<string, number> = {}
  data.forEach((t) => {
    const mes = t.month?.toString().slice(0, 7) || ''
    if (mes) counts[mes] = (counts[mes] || 0) + 1
  })

  return Object.entries(counts)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([mes, count]) => {
      const date = new Date(`${mes}-01`)
      const label = date.toLocaleDateString('es-AR', { month: 'short' }).replace('.', '')
      return { mes: label.charAt(0).toUpperCase() + label.slice(1), count }
    })
}

export interface CasoResuelto {
  id: string
  title: string
  category: string
  area: string | null
  localidad: string | null
  updated_at: string
}

export async function getUltimosCasosResueltos(): Promise<CasoResuelto[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('tickets')
    .select('id, title, category, area, localidad, updated_at')
    .eq('is_public', true)
    .eq('status', 'resuelto')
    .order('updated_at', { ascending: false })
    .limit(10)

  return data ?? []
}
