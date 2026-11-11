import 'server-only'
import { createClient } from '@supabase/supabase-js'

/**
 * Velo progresivo por mora de mantenimiento.
 * La fuente de verdad es la tabla billing_status (una sola fila, id = 1), que solo
 * maneja SCdev. Falla abierta: cualquier error devuelve 0 (nunca oscurece por un error nuestro).
 */

export interface BillingRow {
  enabled: boolean
  next_due_date: string // YYYY-MM-DD
  ramp_days: number
  override_darkness: number | null
  updated_at?: string
}

const TIMEZONE = 'America/Argentina/Buenos_Aires'
const DAY_MS = 86_400_000
const CACHE_TTL_MS = 5 * 60 * 1000
const FAILURE_TTL_MS = 30 * 1000
const QUERY_TIMEOUT_MS = 1500

/** Fecha de hoy (YYYY-MM-DD) en horario de Buenos Aires, no UTC. */
export function todayAR(now: Date): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)
}

function parseDateUTC(value: unknown): number | null {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const [y, m, d] = value.split('-').map(Number)
  const ms = Date.UTC(y, m - 1, d)
  const check = new Date(ms)
  if (check.getUTCFullYear() !== y || check.getUTCMonth() !== m - 1 || check.getUTCDate() !== d) {
    return null
  }
  return ms
}

/** Días enteros entre el vencimiento y hoy (horario AR). Null si la fecha es inválida. */
export function daysOverdue(nextDueDate: unknown, now: Date): number | null {
  const due = parseDateUTC(nextDueDate)
  const today = parseDateUTC(todayAR(now))
  if (due === null || today === null) return null
  return Math.round((today - due) / DAY_MS)
}

/** Próximo vencimiento: día 10 del mes siguiente al vencimiento actual. */
export function nextDueAfterPayment(currentDue: string): string | null {
  const ms = parseDateUTC(currentDue)
  if (ms === null) return null
  const d = new Date(ms)
  const next = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 10))
  return next.toISOString().slice(0, 10)
}

/** Función pura. 0 = normal, 1 = negro total. */
export function computeDarkness(row: BillingRow | null | undefined, now: Date = new Date()): number {
  if (!row || row.enabled !== true) return 0

  if (row.override_darkness !== null && row.override_darkness !== undefined) {
    const o = Number(row.override_darkness)
    return Number.isFinite(o) && o >= 0 && o <= 1 ? o : 0
  }

  const ramp = Number(row.ramp_days)
  if (!Number.isFinite(ramp) || ramp <= 0) return 0

  const overdue = daysOverdue(row.next_due_date, now)
  if (overdue === null || overdue <= 0) return 0

  return Math.min(1, overdue / ramp)
}

/** Cliente service role. Solo server-side. */
export function createBillingAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
}

/** Lectura sin cache (la usa el panel del dueño). Null si falla o no existe la fila. */
export async function readBillingRow(timeoutMs = QUERY_TIMEOUT_MS): Promise<BillingRow | null> {
  try {
    const admin = createBillingAdminClient()
    if (!admin) return null
    const { data, error } = await admin
      .from('billing_status')
      .select('enabled, next_due_date, ramp_days, override_darkness, updated_at')
      .eq('id', 1)
      .abortSignal(AbortSignal.timeout(timeoutMs))
      .maybeSingle()
    if (error || !data) return null
    return data as unknown as BillingRow
  } catch {
    return null
  }
}

let cache: { value: number; expiresAt: number } | null = null

export function invalidateBillingCache(): void {
  cache = null
}

/** Oscuridad actual (0..1) con cache de 5 min. Nunca lanza. */
export async function getDarkness(): Promise<number> {
  const nowMs = Date.now()
  if (cache && cache.expiresAt > nowMs) return cache.value

  const row = await readBillingRow()
  if (!row) {
    // Falla abierta; se reintenta pronto en vez de esperar 5 min.
    cache = { value: 0, expiresAt: nowMs + FAILURE_TTL_MS }
    return 0
  }
  const value = computeDarkness(row, new Date(nowMs))
  cache = { value, expiresAt: nowMs + CACHE_TTL_MS }
  return value
}
