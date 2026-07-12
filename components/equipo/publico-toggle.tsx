'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toggleTicketPublico } from '@/lib/actions/equipo'

interface PublicoToggleProps {
  ticketId: string
  isPublic: boolean
}

export function PublicoToggle({ ticketId, isPublic }: PublicoToggleProps) {
  const router = useRouter()
  const [checked, setChecked] = useState(isPublic)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleToggle() {
    const next = !checked
    setChecked(next)
    setError(null)

    startTransition(async () => {
      const result = await toggleTicketPublico(ticketId, next)
      if (result?.error) {
        setChecked(!next)
        setError(result.error)
        return
      }
      router.refresh()
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-gray-900">Visible en el portal de transparencia</p>
          <p className="mt-0.5 text-xs text-gray-500">
            Al activarlo, este caso aparecerá en estadísticas públicas (sin datos personales)
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={isPending}
          onClick={handleToggle}
          className={`relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-60 ${
            checked ? 'bg-brand-naranja' : 'bg-gray-300'
          }`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
              checked ? 'translate-x-5' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}
