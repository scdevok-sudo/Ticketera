import { describe, it, expect } from 'vitest'
import {
  CATEGORIES,
  CATEGORIA_BG,
  CATEGORIA_ICON_COLOR,
  STATUS_LABELS,
  PRIORITY_LABELS,
  TICKET_STAGES,
  TICKET_STAGES_CIUDADANO,
  ESTADO_ORDER,
  ESTADOS_FINALIZADOS,
  PRIORITY_ORDER,
} from '@/lib/constants/tickets'
import { estadoParaCiudadano } from '@/lib/utils/estado-ciudadano'

// Categorías definitivas del folleto "díptico JC V3"
const CATEGORIAS_FOLLETO = [
  'calles_luminarias_plazas',
  'vivienda_escrituras',
  'clubes_asociaciones_instituciones',
  'educacion_salud_asistencia',
  'infraestructura_obras',
  'luz_agua_cloacas',
  'movilidad_transporte',
  'consultas_legislativas',
]

describe('CATEGORIES', () => {
  it('tiene las 8 categorías del folleto', () => {
    expect(CATEGORIES.map((c) => c.id)).toEqual(CATEGORIAS_FOLLETO)
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

  it('cada categoría tiene color de fondo e ícono en los mapas de la card', () => {
    for (const cat of CATEGORIES) {
      expect(CATEGORIA_BG[cat.id]).toBeTruthy()
      expect(CATEGORIA_ICON_COLOR[cat.id]).toBeTruthy()
    }
  })
})

describe('STATUS_LABELS', () => {
  it('incluye todos los estados del sistema', () => {
    const estadosRequeridos = [
      'nuevo',
      'en_revision',
      'derivado',
      'en_gestion',
      'requiere_info',
      'resuelto',
      'cerrado',
    ]
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

describe('ESTADO_ORDER', () => {
  const ORDEN_PEDIDO = [
    'nuevo',
    'en_revision',
    'en_gestion',
    'derivado',
    'requiere_info',
    'resuelto',
    'cerrado',
  ]

  it('ordena los estados según la urgencia de atención pedida por el equipo', () => {
    const ordenados = Object.keys(ESTADO_ORDER).sort(
      (a, b) => ESTADO_ORDER[a] - ESTADO_ORDER[b]
    )
    expect(ordenados).toEqual(ORDEN_PEDIDO)
  })

  it('cubre todos los estados del sistema', () => {
    for (const stage of TICKET_STAGES) {
      expect(ESTADO_ORDER[stage.key]).toBeTypeOf('number')
    }
  })

  it('deja cerrado último', () => {
    const maximo = Math.max(...Object.values(ESTADO_ORDER))
    expect(ESTADO_ORDER.cerrado).toBe(maximo)
    expect(ESTADO_ORDER.cerrado).toBeGreaterThan(ESTADO_ORDER.resuelto)
  })

  it('ordena una lista de tickets por estado y desempata por prioridad', () => {
    const tickets = [
      { id: 'a', status: 'resuelto', priority: 'alta' },
      { id: 'b', status: 'nuevo', priority: 'baja' },
      { id: 'c', status: 'nuevo', priority: 'alta' },
      { id: 'd', status: 'derivado', priority: 'media' },
      { id: 'e', status: 'en_revision', priority: 'media' },
    ]

    const ordenados = [...tickets].sort((a, b) => {
      const estadoA = ESTADO_ORDER[a.status] ?? 99
      const estadoB = ESTADO_ORDER[b.status] ?? 99
      if (estadoA !== estadoB) return estadoA - estadoB
      return (PRIORITY_ORDER[a.priority] ?? 1) - (PRIORITY_ORDER[b.priority] ?? 1)
    })

    expect(ordenados.map((t) => t.id)).toEqual(['c', 'b', 'e', 'd', 'a'])
  })
})

describe('estadoParaCiudadano', () => {
  it('oculta resuelto y lo muestra como en gestión', () => {
    expect(estadoParaCiudadano('resuelto')).toBe('en_gestion')
  })

  it('deja pasar cerrado tal cual', () => {
    expect(estadoParaCiudadano('cerrado')).toBe('cerrado')
  })

  it('deja pasar el resto de los estados sin cambios', () => {
    for (const estado of ['nuevo', 'en_revision', 'derivado', 'en_gestion', 'requiere_info']) {
      expect(estadoParaCiudadano(estado)).toBe(estado)
    }
  })

  it('el label visible del vecino nunca dice "resuelto"', () => {
    for (const stage of TICKET_STAGES) {
      const visible = estadoParaCiudadano(stage.key)
      expect(STATUS_LABELS[visible].toLowerCase()).not.toContain('resuelto')
    }
  })
})

describe('TICKET_STAGES_CIUDADANO', () => {
  it('no incluye resuelto', () => {
    expect(TICKET_STAGES_CIUDADANO.map((s) => s.key)).not.toContain('resuelto')
  })

  it('termina en cerrado', () => {
    expect(TICKET_STAGES_CIUDADANO.at(-1)?.key).toBe('cerrado')
  })

  it('mantiene el resto de las etapas del equipo en el mismo orden', () => {
    expect(TICKET_STAGES_CIUDADANO.map((s) => s.key)).toEqual(
      TICKET_STAGES.map((s) => s.key).filter((k) => k !== 'resuelto')
    )
  })
})

describe('ESTADOS_FINALIZADOS', () => {
  it('incluye resuelto y cerrado', () => {
    expect(ESTADOS_FINALIZADOS).toEqual(['resuelto', 'cerrado'])
  })
})
