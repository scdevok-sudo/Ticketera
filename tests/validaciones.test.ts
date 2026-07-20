import { describe, it, expect } from 'vitest'
import { z } from 'zod'

// Replicar los schemas de los Server Actions para testearlos aislados
const TicketSchema = z.object({
  type: z.enum(['reclamo', 'pedido', 'pregunta']),
  category: z.string().min(2),
  title: z.string().min(5).max(200),
  description: z.string().min(10).max(2000),
})

const ProfileSchema = z.object({
  dni: z.string().regex(/^[0-9]{7,8}$/),
  phone: z.string().regex(/^[0-9]{10}$/),
  localidad: z.string().min(1),
  localidad_tipo: z.enum(['capital', 'provincia']),
  barrio: z.string().optional(),
  departamento: z.string().optional(),
  sexo: z.enum(['masculino', 'femenino', 'otro', 'prefiero_no_decir']).optional(),
})

describe('TicketSchema', () => {
  it('valida un ticket correcto', () => {
    const result = TicketSchema.safeParse({
      type: 'pedido',
      category: 'Infraestructura',
      title: 'Bache en la calle',
      description: 'Hay un bache grande en la esquina de mi casa',
    })
    expect(result.success).toBe(true)
  })

  it('rechaza título muy corto', () => {
    const result = TicketSchema.safeParse({
      type: 'pedido',
      category: 'Infraestructura',
      title: 'Hi',
      description: 'Descripción válida con más de 10 caracteres',
    })
    expect(result.success).toBe(false)
  })

  it('rechaza descripción muy corta', () => {
    const result = TicketSchema.safeParse({
      type: 'pedido',
      category: 'Infraestructura',
      title: 'Título válido',
      description: 'Corto',
    })
    expect(result.success).toBe(false)
  })

  it('rechaza type inválido', () => {
    const result = TicketSchema.safeParse({
      type: 'consulta', // no es un valor válido del enum interno
      category: 'Infraestructura',
      title: 'Título válido largo',
      description: 'Descripción válida con más de 10 caracteres',
    })
    expect(result.success).toBe(false)
  })
})

describe('ProfileSchema', () => {
  it('valida un perfil completo correcto', () => {
    const result = ProfileSchema.safeParse({
      dni: '12345678',
      phone: '3415551234',
      localidad: 'Rosario',
      localidad_tipo: 'provincia',
      departamento: 'Rosario',
    })
    expect(result.success).toBe(true)
  })

  it('valida DNI de 7 dígitos', () => {
    const result = ProfileSchema.safeParse({
      dni: '1234567',
      phone: '3415551234',
      localidad: 'Rosario',
      localidad_tipo: 'provincia',
    })
    expect(result.success).toBe(true)
  })

  it('rechaza DNI con letras', () => {
    const result = ProfileSchema.safeParse({
      dni: '1234567A',
      phone: '3415551234',
      localidad: 'Rosario',
      localidad_tipo: 'provincia',
    })
    expect(result.success).toBe(false)
  })

  it('rechaza teléfono de menos de 10 dígitos', () => {
    const result = ProfileSchema.safeParse({
      dni: '12345678',
      phone: '341555',
      localidad: 'Rosario',
      localidad_tipo: 'provincia',
    })
    expect(result.success).toBe(false)
  })

  it('acepta sexo como opcional', () => {
    const result = ProfileSchema.safeParse({
      dni: '12345678',
      phone: '3415551234',
      localidad: 'Santa Fe',
      localidad_tipo: 'capital',
      barrio: 'Centro',
    })
    expect(result.success).toBe(true)
  })

  it('rechaza localidad_tipo inválido', () => {
    const result = ProfileSchema.safeParse({
      dni: '12345678',
      phone: '3415551234',
      localidad: 'Rosario',
      localidad_tipo: 'ciudad', // inválido
    })
    expect(result.success).toBe(false)
  })
})
