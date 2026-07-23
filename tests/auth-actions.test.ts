/**
 * tests/auth-actions.test.ts
 *
 * Verifica que las Server Actions del equipo rechacen requests
 * de usuarios no autorizados antes de operar con la base de datos.
 *
 * Estrategia: mockear getUser()/getTeamMember() (lib/supabase/auth-cache)
 * para simular usuario sin sesión / sin team member activo, y verificar
 * que cada acción retorna un estado de error (o su equivalente "vacío"
 * para las funciones de lectura) sin llegar a invocar supabase.from().
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/supabase/auth-cache', () => ({
  getUser: vi.fn().mockResolvedValue(null),
  getTeamMember: vi.fn().mockResolvedValue(null),
}))

const { mockSupabaseFrom } = vi.hoisted(() => ({ mockSupabaseFrom: vi.fn() }))
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn().mockResolvedValue({
    from: mockSupabaseFrom,
  }),
}))

import { getUser, getTeamMember } from '@/lib/supabase/auth-cache'
import {
  addNotaInterna,
  addRespuestaCiudadano,
  cambiarEstado,
  asignarTicket,
  cambiarPrioridad,
  toggleTicketPublico,
  getTeamMembers,
  getKPIs,
  agregarMiembro,
  cambiarCategoria,
  desactivarMiembro,
} from '@/lib/actions/equipo'
import { getAllTickets, getTicketByIdEquipo } from '@/lib/actions/tickets'

const TICKET_ID = '11111111-1111-1111-1111-111111111111'
const MEMBER_ID = '22222222-2222-2222-2222-222222222222'

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(getUser).mockResolvedValue(null)
  vi.mocked(getTeamMember).mockResolvedValue(null)
})

describe('Server Actions del equipo — rechazo sin autorización', () => {
  it('addNotaInterna rechaza si no hay sesión/team member', async () => {
    const result = await addNotaInterna(TICKET_ID, 'nota interna')
    expect(result).toHaveProperty('error')
    expect(mockSupabaseFrom).not.toHaveBeenCalled()
  })

  it('addRespuestaCiudadano rechaza si no hay sesión/team member', async () => {
    const result = await addRespuestaCiudadano(TICKET_ID, 'respuesta')
    expect(result).toHaveProperty('error')
    expect(mockSupabaseFrom).not.toHaveBeenCalled()
  })

  it('cambiarEstado rechaza si no hay sesión/team member', async () => {
    const result = await cambiarEstado(TICKET_ID, 'en_revision')
    expect(result).toHaveProperty('error')
    expect(mockSupabaseFrom).not.toHaveBeenCalled()
  })

  it('asignarTicket rechaza si no hay sesión/team member', async () => {
    const result = await asignarTicket(TICKET_ID, MEMBER_ID)
    expect(result).toHaveProperty('error')
    expect(mockSupabaseFrom).not.toHaveBeenCalled()
  })

  it('cambiarPrioridad rechaza si no hay sesión/team member', async () => {
    const result = await cambiarPrioridad(TICKET_ID, 'alta')
    expect(result).toHaveProperty('error')
    expect(mockSupabaseFrom).not.toHaveBeenCalled()
  })

  it('toggleTicketPublico rechaza si no hay sesión/team member', async () => {
    const result = await toggleTicketPublico(TICKET_ID, true)
    expect(result).toHaveProperty('error')
    expect(mockSupabaseFrom).not.toHaveBeenCalled()
  })

  it('cambiarCategoria rechaza si no hay sesión/team member', async () => {
    const result = await cambiarCategoria(TICKET_ID, 'infraestructura')
    expect(result).toHaveProperty('error')
    expect(mockSupabaseFrom).not.toHaveBeenCalled()
  })

  it('getTeamMembers retorna vacío sin team member activo', async () => {
    const result = await getTeamMembers()
    expect(result).toEqual([])
    expect(mockSupabaseFrom).not.toHaveBeenCalled()
  })

  it('getKPIs retorna estructura vacía sin team member activo', async () => {
    const result = await getKPIs()
    expect(result.totalTickets).toBe(0)
    expect(result.porOperador).toEqual([])
    expect(mockSupabaseFrom).not.toHaveBeenCalled()
  })

  it('getAllTickets retorna vacío sin team member activo', async () => {
    const result = await getAllTickets({})
    expect(result.tickets).toEqual([])
    expect(result.total).toBe(0)
    expect(mockSupabaseFrom).not.toHaveBeenCalled()
  })

  it('getTicketByIdEquipo retorna null sin team member activo', async () => {
    const result = await getTicketByIdEquipo(TICKET_ID)
    expect(result).toBeNull()
    expect(mockSupabaseFrom).not.toHaveBeenCalled()
  })
})

describe('Server Actions del equipo — requieren rol admin', () => {
  it('agregarMiembro rechaza sin team member activo', async () => {
    const result = await agregarMiembro('nuevo@test.com', 'operator', 'Infraestructura')
    expect(result).toHaveProperty('error')
    expect(mockSupabaseFrom).not.toHaveBeenCalled()
  })

  it('agregarMiembro rechaza si el team member no es admin', async () => {
    vi.mocked(getTeamMember).mockResolvedValueOnce({
      id: MEMBER_ID,
      role: 'operator',
      area: 'Infraestructura',
    } as never)

    const result = await agregarMiembro('nuevo@test.com', 'operator', 'Infraestructura')
    expect(result).toHaveProperty('error')
    expect(mockSupabaseFrom).not.toHaveBeenCalled()
  })

  it('desactivarMiembro rechaza sin team member activo', async () => {
    const result = await desactivarMiembro(MEMBER_ID)
    expect(result).toHaveProperty('error')
    expect(mockSupabaseFrom).not.toHaveBeenCalled()
  })

  it('desactivarMiembro rechaza si el team member no es admin', async () => {
    vi.mocked(getTeamMember).mockResolvedValueOnce({
      id: MEMBER_ID,
      role: 'operator',
      area: 'Infraestructura',
    } as never)

    const result = await desactivarMiembro(MEMBER_ID)
    expect(result).toHaveProperty('error')
    expect(mockSupabaseFrom).not.toHaveBeenCalled()
  })
})
