import { describe, it, expect, vi } from 'vitest'

vi.mock('server-only', () => ({}))

import { computeDarkness, daysOverdue, nextDueAfterPayment, type BillingRow } from '@/lib/billing'

const base: BillingRow = {
  enabled: true,
  next_due_date: '2026-11-10',
  ramp_days: 14,
  override_darkness: null,
}

// Mediodía en Buenos Aires (UTC-3) del día dado
const ar = (iso: string) => new Date(`${iso}T12:00:00-03:00`)

describe('computeDarkness', () => {
  it('enabled=false → 0', () => {
    expect(computeDarkness({ ...base, enabled: false }, ar('2026-12-30'))).toBe(0)
  })

  it('antes del vencimiento y el día del vencimiento → 0', () => {
    expect(computeDarkness(base, ar('2026-11-09'))).toBe(0)
    expect(computeDarkness(base, ar('2026-11-10'))).toBe(0)
  })

  it('día 10 a las 23:59 de Buenos Aires (11/11 02:59 UTC) sigue siendo 0', () => {
    expect(computeDarkness(base, new Date('2026-11-11T02:59:00Z'))).toBe(0)
  })

  it('un minuto después (00:00 del 11/11 en Buenos Aires) ya es 1/14', () => {
    expect(computeDarkness(base, new Date('2026-11-11T03:00:00Z'))).toBeCloseTo(1 / 14, 10)
  })

  it('11/11 con ramp_days=14 → 1/14', () => {
    expect(computeDarkness(base, ar('2026-11-11'))).toBeCloseTo(1 / 14, 10)
  })

  it('borde de la rampa: 23/11 = 13/14, 24/11 = 1 (14 días), 25/11 = 1', () => {
    expect(computeDarkness(base, ar('2026-11-23'))).toBeCloseTo(13 / 14, 10)
    expect(computeDarkness(base, ar('2026-11-24'))).toBe(1)
    expect(computeDarkness(base, ar('2026-11-25'))).toBe(1)
  })

  it('pasada la rampa nunca supera 1', () => {
    expect(computeDarkness(base, ar('2027-03-01'))).toBe(1)
  })

  it('override_darkness gana sobre el cálculo', () => {
    expect(computeDarkness({ ...base, override_darkness: 0.5 }, ar('2026-11-01'))).toBe(0.5)
    expect(computeDarkness({ ...base, override_darkness: 0 }, ar('2026-12-30'))).toBe(0)
  })

  it('override fuera de rango → 0', () => {
    expect(computeDarkness({ ...base, override_darkness: 1.5 }, ar('2026-12-30'))).toBe(0)
  })

  it('datos inválidos → 0', () => {
    expect(computeDarkness({ ...base, next_due_date: 'no-es-fecha' }, ar('2026-12-30'))).toBe(0)
    expect(computeDarkness({ ...base, next_due_date: '2026-02-31' }, ar('2026-12-30'))).toBe(0)
    expect(computeDarkness({ ...base, ramp_days: 0 }, ar('2026-12-30'))).toBe(0)
    expect(computeDarkness({ ...base, ramp_days: -5 }, ar('2026-12-30'))).toBe(0)
    expect(computeDarkness(null, ar('2026-12-30'))).toBe(0)
    expect(computeDarkness(undefined, ar('2026-12-30'))).toBe(0)
  })
})

describe('daysOverdue', () => {
  it('cuenta días enteros en horario de Buenos Aires', () => {
    expect(daysOverdue('2026-11-10', new Date('2026-11-11T02:59:00Z'))).toBe(0)
    expect(daysOverdue('2026-11-10', new Date('2026-11-11T03:00:00Z'))).toBe(1)
  })
})

describe('nextDueAfterPayment', () => {
  it('lleva el vencimiento al día 10 del mes siguiente', () => {
    expect(nextDueAfterPayment('2026-11-10')).toBe('2026-12-10')
    expect(nextDueAfterPayment('2026-12-10')).toBe('2027-01-10')
  })

  it('fecha inválida → null', () => {
    expect(nextDueAfterPayment('xx')).toBeNull()
  })
})
