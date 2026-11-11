import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('server-only', () => ({}))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))

const getUser = vi.fn()
vi.mock('@/lib/supabase/server', () => ({
  createClient: async () => ({ auth: { getUser } }),
}))

const adminFrom = vi.fn()
vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({ from: adminFrom }),
}))

import { isBillingOwner } from '@/lib/billing-owner'
import { alternarFacturacion, fijarVistaPrevia, marcarPago } from '@/lib/actions/facturacion'

const OWNER = 'scdev.ok@gmail.com'
const confirmedUser = (email: string, confirmed: string | null = '2026-01-01T00:00:00Z') => ({
  data: { user: { id: 'u1', email, email_confirmed_at: confirmed } },
  error: null,
})

beforeEach(() => {
  vi.clearAllMocks()
  process.env.BILLING_OWNER_EMAIL = OWNER
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost'
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-key'
})

describe('isBillingOwner', () => {
  it('mail correcto y confirmado → true', async () => {
    getUser.mockResolvedValue(confirmedUser(OWNER))
    expect(await isBillingOwner()).toBe(true)
  })

  it('mail correcto en mayúsculas → true', async () => {
    getUser.mockResolvedValue(confirmedUser('SCDEV.OK@Gmail.com'))
    expect(await isBillingOwner()).toBe(true)
  })

  it('mail distinto → false (aunque sea admin del equipo: team_members no se consulta)', async () => {
    getUser.mockResolvedValue(confirmedUser('admin@unidosconstruimos.com.ar'))
    expect(await isBillingOwner()).toBe(false)
  })

  it('mail correcto sin confirmar → false', async () => {
    getUser.mockResolvedValue(confirmedUser(OWNER, null))
    expect(await isBillingOwner()).toBe(false)
  })

  it('sin sesión → false', async () => {
    getUser.mockResolvedValue({ data: { user: null }, error: null })
    expect(await isBillingOwner()).toBe(false)
  })

  it('error de getUser → false', async () => {
    getUser.mockResolvedValue({ data: { user: null }, error: new Error('jwt expired') })
    expect(await isBillingOwner()).toBe(false)
  })

  it('getUser lanza → false', async () => {
    getUser.mockRejectedValue(new Error('network'))
    expect(await isBillingOwner()).toBe(false)
  })

  it('sin BILLING_OWNER_EMAIL configurada → false', async () => {
    delete process.env.BILLING_OWNER_EMAIL
    getUser.mockResolvedValue(confirmedUser(OWNER))
    expect(await isBillingOwner()).toBe(false)
  })
})

describe('server actions de facturación llamadas por un no-dueño', () => {
  beforeEach(() => {
    getUser.mockResolvedValue(confirmedUser('otro@gmail.com'))
  })

  it('alternarFacturacion no escribe', async () => {
    const res = await alternarFacturacion(true)
    expect(res.error).toBeTruthy()
    expect(adminFrom).not.toHaveBeenCalled()
  })

  it('marcarPago no lee ni escribe', async () => {
    const res = await marcarPago()
    expect(res.error).toBeTruthy()
    expect(adminFrom).not.toHaveBeenCalled()
  })

  it('fijarVistaPrevia no escribe', async () => {
    const res = await fijarVistaPrevia(50)
    expect(res.error).toBeTruthy()
    expect(adminFrom).not.toHaveBeenCalled()
  })
})

describe('server actions llamadas por el dueño', () => {
  it('fijarVistaPrevia convierte porcentaje a 0..1 y escribe', async () => {
    getUser.mockResolvedValue(confirmedUser(OWNER))
    const eq = vi.fn().mockResolvedValue({ error: null })
    const update = vi.fn().mockReturnValue({ eq })
    adminFrom.mockReturnValue({ update })

    const res = await fijarVistaPrevia(50)

    expect(res.error).toBeUndefined()
    expect(update).toHaveBeenCalledWith(expect.objectContaining({ override_darkness: 0.5 }))
  })

  it('fijarVistaPrevia rechaza valores fuera de rango', async () => {
    getUser.mockResolvedValue(confirmedUser(OWNER))
    const res = await fijarVistaPrevia(150)
    expect(res.error).toBeTruthy()
    expect(adminFrom).not.toHaveBeenCalled()
  })
})
