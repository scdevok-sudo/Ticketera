import { describe, it, expect } from 'vitest'
import {
  CATEGORIES,
  STATUS_LABELS,
  PRIORITY_LABELS,
  TICKET_STAGES,
} from '@/lib/constants/tickets'

describe('CATEGORIES', () => {
  it('tiene al menos 4 categorías', () => {
    expect(CATEGORIES.length).toBeGreaterThanOrEqual(4)
  })

  it('cada categoría tiene id, label e icon', () => {
    for (const cat of CATEGORIES) {
      expect(cat).toHaveProperty('id')
      expect(cat).toHaveProperty('label')
      expect(cat).toHaveProperty('icon')
      expect(cat.id).toBeTruthy()
      expect(cat.label).toBeTruthy()
    }
  })

  it('no hay ids duplicados', () => {
    const ids = CATEGORIES.map((c) => c.id)
    const unicos = new Set(ids)
    expect(unicos.size).toBe(ids.length)
  })

  it('no contiene la palabra reclamo en los labels', () => {
    for (const cat of CATEGORIES) {
      expect(cat.label.toLowerCase()).not.toContain('reclamo')
    }
  })
})

describe('STATUS_LABELS', () => {
  it('incluye todos los estados del sistema', () => {
    const estadosRequeridos = ['nuevo', 'en_revision', 'derivado', 'en_gestion', 'requiere_info', 'resuelto']
    for (const estado of estadosRequeridos) {
      expect(STATUS_LABELS).toHaveProperty(estado)
      expect(STATUS_LABELS[estado]).toBeTruthy()
    }
  })

  it('no contiene la palabra reclamo en los labels', () => {
    for (const label of Object.values(STATUS_LABELS)) {
      expect(label.toLowerCase()).not.toContain('reclamo')
    }
  })
})

describe('PRIORITY_LABELS', () => {
  it('incluye alta, media y baja', () => {
    expect(PRIORITY_LABELS).toHaveProperty('alta')
    expect(PRIORITY_LABELS).toHaveProperty('media')
    expect(PRIORITY_LABELS).toHaveProperty('baja')
  })
})

describe('TICKET_STAGES', () => {
  it('incluye requiere_info como estado', () => {
    const keys = TICKET_STAGES.map((s: { key: string }) => s.key)
    expect(keys).toContain('requiere_info')
  })

  it('no contiene la palabra reclamo', () => {
    for (const stage of TICKET_STAGES) {
      if (stage.label) {
        expect(stage.label.toLowerCase()).not.toContain('reclamo')
      }
    }
  })
})
