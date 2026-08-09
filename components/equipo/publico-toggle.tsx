'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toggleTicketPublico } from '@/lib/actions/equipo'

interface PublicoToggleProps {
  ticketId: string
  /** Estado real del ticket en la DB (tickets.is_public). true = visible en /transparencia. */
  isPublic: boolean
}

export function PublicoToggle({ ticketId, isPublic }: PublicoToggleProps) {
  const router = useRouter()
  const [active, setActive] = useState(isPublic)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleToggle() {
    const next = !active
    setActive(next)
    setError(null)

    startTransition(async () => {
      const result = await toggleTicketPublico(ticketId, next)
      if (result?.error) {
        setActive(!next)
        setError(result.error)
        return
      }
      router.refresh()
    })
  }

  // Track: gris cuando inactivo, naranja cuando activo.
  const trackClass = active ? 'bg-[#FF7402]' : 'bg-gray-300'

  // Thumb: translate-x-0 → pegado a la izquierda (inactivo).
  // translate-x-5 → desplazado a la derecha (activo).
  const thumbTranslateClass = active ? 'translate-x-5' : 'translate-x-0'

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
          aria-checked={active}
          disabled={isPending}
          onClick={handleToggle}
          className={`relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-60 ${trackClass}`}
        >
          <div
            className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${thumbTranslateClass}`}
          />
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}
