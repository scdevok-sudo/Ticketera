'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { cambiarEstado } from '@/lib/actions/equipo'
import { STATUS_LABELS, TICKET_STAGES } from '@/lib/constants/tickets'

interface CambiarEstadoProps {
  ticketId: string
  currentStatus: string
}

export function CambiarEstado({ ticketId, currentStatus }: CambiarEstadoProps) {
  const router = useRouter()
  const [selected, setSelected] = useState(currentStatus)
  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleChange(value: string) {
    setSelected(value)
    setError(null)
    setConfirming(value !== currentStatus)
  }

  function cancelar() {
    setSelected(currentStatus)
    setConfirming(false)
  }

  function confirmar() {
    startTransition(async () => {
      const result = await cambiarEstado(ticketId, selected)
      if (result?.error) {
        setError(result.error)
        return
      }
      setConfirming(false)
      router.refresh()
    })
  }

  return (
    <div>
      <label className="block text-xs font-medium text-gray-500">Estado actual</label>
      <select
        value={selected}
        onChange={(e) => handleChange(e.target.value)}
        disabled={isPending}
        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:border-brand-azul focus:outline-none"
      >
        {TICKET_STAGES.map((stage) => (
          <option key={stage.key} value={stage.key} disabled={stage.key === currentStatus}>
            {STATUS_LABELS[stage.key]}
            {stage.key === currentStatus ? ' (actual)' : ''}
          </option>
        ))}
      </select>

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}

      {confirming && (
        <div className="mt-2 rounded-lg bg-orange-50 p-3 text-sm">
          <p className="mb-2 text-gray-700">
            ¿Confirmar cambio a <strong>{STATUS_LABELS[selected]}</strong>?
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={isPending}
              onClick={confirmar}
              className="rounded-lg bg-brand-naranja px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
            >
              {isPending ? 'Guardando…' : 'Confirmar'}
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={cancelar}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
