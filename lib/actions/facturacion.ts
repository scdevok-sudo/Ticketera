'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { isBillingOwner } from '@/lib/billing-owner'
import {
  createBillingAdminClient,
  invalidateBillingCache,
  nextDueAfterPayment,
  readBillingRow,
} from '@/lib/billing'

export interface FacturacionActionState {
  error?: string
}

const PANEL_PATH = '/equipo/facturacion'

async function escribir(cambios: Record<string, unknown>): Promise<FacturacionActionState> {
  const admin = createBillingAdminClient()
  if (!admin) return { error: 'Falta configurar las credenciales del servidor' }

  const { error } = await admin
    .from('billing_status')
    .update({ ...cambios, updated_at: new Date().toISOString() })
    .eq('id', 1)

  if (error) return { error: 'No se pudo guardar el cambio' }

  invalidateBillingCache()
  revalidatePath(PANEL_PATH)
  return {}
}

export async function alternarFacturacion(enabled: boolean): Promise<FacturacionActionState> {
  if (!(await isBillingOwner())) return { error: 'No autorizado' }
  const parsed = z.boolean().safeParse(enabled)
  if (!parsed.success) return { error: 'Valor inválido' }
  return escribir({ enabled: parsed.data })
}

export async function marcarPago(): Promise<FacturacionActionState> {
  if (!(await isBillingOwner())) return { error: 'No autorizado' }

  const row = await readBillingRow(5000)
  if (!row) return { error: 'No se pudo leer el estado actual' }

  const next = nextDueAfterPayment(row.next_due_date)
  if (!next) return { error: 'El vencimiento actual es inválido' }

  // Al marcar el pago también se quita cualquier vista previa pendiente.
  return escribir({ next_due_date: next, override_darkness: null })
}

export async function fijarVistaPrevia(porcentaje: number | null): Promise<FacturacionActionState> {
  if (!(await isBillingOwner())) return { error: 'No autorizado' }

  const parsed = z.number().min(0).max(100).nullable().safeParse(porcentaje)
  if (!parsed.success) return { error: 'El valor debe estar entre 0 y 100' }

  return escribir({
    override_darkness: parsed.data === null ? null : parsed.data / 100,
  })
}
