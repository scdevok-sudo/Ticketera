import { describe, it, expect } from 'vitest'
import {
  TIMEZONE_AR,
  diaDeSemanaAR,
  formatDiaMes,
  formatFecha,
  formatFechaCorta,
  formatFechaHora,
  formatMesCorto,
  inicioDeDiaAR,
  inicioDeMesAR,
} from '@/lib/utils/fecha'

// Supabase guarda en UTC. Argentina es UTC-3: un timestamp de las 01:00 UTC
// corresponde a las 22:00 del día anterior en Santa Fe.
const UTC_MADRUGADA = '2026-09-08T01:30:00.000Z'
const UTC_MEDIODIA = '2026-09-08T15:00:00.000Z'

describe('zona horaria', () => {
  it('usa la zona horaria de Argentina', () => {
    expect(TIMEZONE_AR).toBe('America/Argentina/Buenos_Aires')
  })

  it('formatFecha resta las 3 horas de diferencia y muestra el día real', () => {
    expect(formatFecha(UTC_MADRUGADA)).toBe('7 de septiembre de 2026')
  })

  it('formatFechaHora muestra la hora local argentina en formato 24 horas', () => {
    // 01:30 UTC son las 22:30 del día anterior en Argentina.
    const madrugada = formatFechaHora(UTC_MADRUGADA)
    expect(madrugada).toContain('7 de septiembre de 2026')
    expect(madrugada).toContain('22:30')
    expect(madrugada).not.toMatch(/[ap]\.\s?m\./)

    expect(formatFechaHora(UTC_MEDIODIA)).toContain('12:00')
  })

  it('formatFechaCorta usa dd/mm/aaaa en hora argentina', () => {
    expect(formatFechaCorta(UTC_MADRUGADA)).toBe('7/9/2026')
  })

  it('formatDiaMes usa el día argentino', () => {
    expect(formatDiaMes(UTC_MADRUGADA)).toContain('7')
  })

  it('formatMesCorto capitaliza y saca el punto', () => {
    const label = formatMesCorto('2026-09-01T00:00:00-03:00')
    expect(label).not.toContain('.')
    expect(label.charAt(0)).toBe(label.charAt(0).toUpperCase())
  })
})

describe('cortes de calendario argentino', () => {
  it('inicioDeDiaAR devuelve las 03:00 UTC (00:00 en Argentina)', () => {
    expect(inicioDeDiaAR(UTC_MEDIODIA).toISOString()).toBe('2026-09-08T03:00:00.000Z')
  })

  it('inicioDeDiaAR de la madrugada UTC cae en el día anterior argentino', () => {
    expect(inicioDeDiaAR(UTC_MADRUGADA).toISOString()).toBe('2026-09-07T03:00:00.000Z')
  })

  it('inicioDeMesAR devuelve el primero del mes a las 00:00 argentinas', () => {
    expect(inicioDeMesAR(UTC_MEDIODIA).toISOString()).toBe('2026-09-01T03:00:00.000Z')
  })

  it('inicioDeMesAR del 1° a la madrugada UTC cae en el mes anterior', () => {
    // 2026-09-01T01:00Z son las 22:00 del 31 de agosto en Argentina.
    expect(inicioDeMesAR('2026-09-01T01:00:00.000Z').toISOString()).toBe(
      '2026-08-01T03:00:00.000Z'
    )
  })

  it('diaDeSemanaAR usa el día argentino (0 = domingo)', () => {
    // 2026-09-08 es martes en Argentina.
    expect(diaDeSemanaAR(UTC_MEDIODIA)).toBe(2)
    // 2026-09-08T01:30Z es lunes 7 en Argentina.
    expect(diaDeSemanaAR(UTC_MADRUGADA)).toBe(1)
  })
})
