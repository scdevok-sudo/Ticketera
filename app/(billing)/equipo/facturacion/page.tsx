import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isBillingOwner } from '@/lib/billing-owner'
import { computeDarkness, daysOverdue, readBillingRow } from '@/lib/billing'
import { PanelFacturacion } from './panel-facturacion'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Facturación',
  robots: { index: false, follow: false },
}

export default async function FacturacionPage() {
  // Para cualquiera que no sea el dueño, la ruta no existe.
  if (!(await isBillingOwner())) notFound()

  const row = await readBillingRow(5000)
  const now = new Date()

  if (!row) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        No se pudo leer la tabla billing_status. Verificá que la migración MIGRACION_MORA_PAGO.sql
        esté corrida.
      </div>
    )
  }

  const darkness = computeDarkness(row, now)
  const dias = daysOverdue(row.next_due_date, now)

  return (
    <PanelFacturacion
      enabled={row.enabled}
      nextDueDate={row.next_due_date}
      diasMora={dias !== null && dias > 0 ? dias : 0}
      rampDays={row.ramp_days}
      darknessPct={Math.round(darkness * 100)}
      overridePct={row.override_darkness === null ? null : Math.round(Number(row.override_darkness) * 100)}
    />
  )
}
