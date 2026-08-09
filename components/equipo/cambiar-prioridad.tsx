'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { cambiarPrioridad } from '@/lib/actions/equipo'
import { PRIORITY_LABELS } from '@/lib/constants/tickets'

interface CambiarPrioridadProps {
  ticketId: string
  currentPriority: string
}

export function CambiarPrioridad({ ticketId, currentPriority }: CambiarPrioridadProps) {
  const router = useRouter()
  const [selected, setSelected] = useState(currentPriority)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleChange(value: string) {
    setSelected(value)
    setError(null)
    startTransition(async () => {
      const result = await cambiarPrioridad(ticketId, value)
      if (result?.error) {
        setSelected(currentPriority)
        setError(result.error)
        return
      }
      router.refresh()
    })
  }

  return (
    <div>
      <h3 className="mb-1 text-sm font-semibold text-gray-500">Prioridad</h3>
      <select
        value={selected}
        onChange={(e) => handleChange(e.target.value)}
        disabled={isPending}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:border-brand-azul focus:outline-none"
      >
        {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}
