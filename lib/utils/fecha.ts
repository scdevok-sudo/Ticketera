/**
 * Helpers de fecha. Supabase guarda todo en UTC; el usuario final está en
 * Argentina (UTC-3), así que TODO lo que se muestra en pantalla se formatea
 * con la zona horaria de Argentina explícita.
 *
 * Estas funciones son solo para MOSTRAR. Lo que se guarda en la DB sigue
 * yendo en UTC (`toISOString()`), no usar estos helpers para persistir.
 */

export const TIMEZONE_AR = 'America/Argentina/Buenos_Aires'
export const LOCALE_AR = 'es-AR'

/** Argentina no aplica horario de verano desde 2009: offset fijo UTC-3. */
const OFFSET_AR_MS = 3 * 60 * 60 * 1000

export const MS_POR_DIA = 24 * 60 * 60 * 1000

type FechaInput = string | number | Date

function toDate(fecha: FechaInput): Date {
  return fecha instanceof Date ? fecha : new Date(fecha)
}

/** "8 de septiembre de 2026" */
export function formatFecha(fecha: FechaInput): string {
  return toDate(fecha).toLocaleDateString(LOCALE_AR, {
    timeZone: TIMEZONE_AR,
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/** "8 de septiembre de 2026, 14:35" */
export function formatFechaHora(fecha: FechaInput): string {
  return toDate(fecha).toLocaleString(LOCALE_AR, {
    timeZone: TIMEZONE_AR,
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

/** "08/09/2026" */
export function formatFechaCorta(fecha: FechaInput): string {
  return toDate(fecha).toLocaleDateString(LOCALE_AR, { timeZone: TIMEZONE_AR })
}

/** "8 sept" — etiquetas de ejes en gráficos */
export function formatDiaMes(fecha: FechaInput): string {
  return toDate(fecha).toLocaleDateString(LOCALE_AR, {
    timeZone: TIMEZONE_AR,
    day: 'numeric',
    month: 'short',
  })
}

/** "Sep" — mes abreviado, capitalizado y sin punto final */
export function formatMesCorto(fecha: FechaInput): string {
  const label = toDate(fecha)
    .toLocaleDateString(LOCALE_AR, { timeZone: TIMEZONE_AR, month: 'short' })
    .replace('.', '')
  return label.charAt(0).toUpperCase() + label.slice(1)
}

/**
 * Fecha (Date en UTC) que representa las 00:00 de Argentina del mes al que
 * pertenece `fecha`. Sirve para agrupar métricas por "este mes" según el
 * calendario argentino y no según el del servidor (Vercel corre en UTC).
 */
export function inicioDeMesAR(fecha: FechaInput = new Date()): Date {
  const { year, month } = partesAR(toDate(fecha))
  return new Date(Date.UTC(year, month - 1, 1) + OFFSET_AR_MS)
}

/** 00:00 de Argentina del día al que pertenece `fecha`. */
export function inicioDeDiaAR(fecha: FechaInput = new Date()): Date {
  const { year, month, day } = partesAR(toDate(fecha))
  return new Date(Date.UTC(year, month - 1, day) + OFFSET_AR_MS)
}

/** Día de la semana según el calendario argentino (0 = domingo). */
export function diaDeSemanaAR(fecha: FechaInput = new Date()): number {
  const { year, month, day } = partesAR(toDate(fecha))
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay()
}

/** Año, mes (1-12) y día del calendario argentino para un instante dado. */
function partesAR(fecha: Date): { year: number; month: number; day: number } {
  // 'en-CA' devuelve YYYY-MM-DD, el formato más simple de parsear.
  const [year, month, day] = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIMEZONE_AR,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .format(fecha)
    .split('-')
    .map(Number)

  return { year, month, day }
}
