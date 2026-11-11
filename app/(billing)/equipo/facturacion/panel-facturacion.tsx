'use client'

import { useState, useTransition } from 'react'
import { alternarFacturacion, fijarVistaPrevia, marcarPago } from '@/lib/actions/facturacion'

interface Props {
  enabled: boolean
  nextDueDate: string
  diasMora: number
  rampDays: number
  darknessPct: number
  overridePct: number | null
}

function formatVencimiento(iso: string) {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

export function PanelFacturacion({
  enabled,
  nextDueDate,
  diasMora,
  rampDays,
  darknessPct,
  overridePct,
}: Props) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [confirmando, setConfirmando] = useState(false)
  const [preview, setPreview] = useState(overridePct ?? 0)

  function ejecutar(fn: () => Promise<{ error?: string }>) {
    setError(null)
    startTransition(async () => {
      const res = await fn()
      if (res.error) setError(res.error)
      setConfirmando(false)
    })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-900">Facturación del mantenimiento</h1>

      <section className="rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="mb-3 text-sm font-semibold text-gray-700">Estado actual</h2>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <dt className="text-gray-500">Sistema de mora</dt>
          <dd className="font-medium">{enabled ? 'Activado' : 'Desactivado'}</dd>
          <dt className="text-gray-500">Vencimiento</dt>
          <dd className="font-medium">{formatVencimiento(nextDueDate)}</dd>
          <dt className="text-gray-500">Días de mora</dt>
          <dd className="font-medium">
            {diasMora} (rampa de {rampDays} días)
          </dd>
          <dt className="text-gray-500">Oscuridad actual</dt>
          <dd className="font-medium">
            {darknessPct}%{overridePct !== null ? ' (vista previa activa)' : ''}
          </dd>
        </dl>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="mb-3 text-sm font-semibold text-gray-700">Interruptor</h2>
        <button
          type="button"
          disabled={pending}
          onClick={() => ejecutar(() => alternarFacturacion(!enabled))}
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {enabled ? 'Desactivar' : 'Activar'}
        </button>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="mb-3 text-sm font-semibold text-gray-700">Marcar pago</h2>
        <p className="mb-3 text-sm text-gray-500">
          Mueve el vencimiento al día 10 del mes siguiente al actual y quita la vista previa.
        </p>
        {confirmando ? (
          <div className="flex items-center gap-2">
            <span className="text-sm">¿Confirmás que se recibió el pago?</span>
            <button
              type="button"
              disabled={pending}
              onClick={() => ejecutar(() => marcarPago())}
              className="rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
            >
              Sí, marcar pago
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => setConfirmando(false)}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            type="button"
            disabled={pending}
            onClick={() => setConfirmando(true)}
            className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            Marcar pago
          </button>
        )}
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="mb-3 text-sm font-semibold text-gray-700">Vista previa</h2>
        <p className="mb-3 text-sm text-gray-500">
          Fuerza un nivel de oscuridad para ver cómo queda en producción (solo funciona con el
          sistema activado).
        </p>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={100}
            value={preview}
            onChange={(e) => setPreview(Number(e.target.value))}
            className="flex-1"
            aria-label="Nivel de oscuridad"
          />
          <span className="w-12 text-right text-sm tabular-nums">{preview}%</span>
        </div>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            disabled={pending}
            onClick={() => ejecutar(() => fijarVistaPrevia(preview))}
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            Aplicar vista previa
          </button>
          <button
            type="button"
            disabled={pending || overridePct === null}
            onClick={() => ejecutar(() => fijarVistaPrevia(null))}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm disabled:opacity-50"
          >
            Quitar vista previa
          </button>
        </div>
      </section>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <p className="text-xs text-gray-400">
        Los cambios se aplican al instante en este panel, pero otras instancias del servidor pueden
        tardar hasta 5 minutos en reflejarlos (cache en memoria).
      </p>
    </div>
  )
}
