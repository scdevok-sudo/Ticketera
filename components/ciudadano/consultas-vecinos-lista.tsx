'use client'

import { useState, useTransition } from 'react'
import { Icon } from '@/components/ui/icon'
import { addLike, removeLike } from '@/lib/actions/tickets'
import { STATUS_LABELS, CATEGORY_LABELS, TIPO_TRAMITE_LABELS } from '@/lib/constants/tickets'

interface Consulta {
  id: string
  title: string
  category: string
  type: string
  localidad: string | null
  status: string
  likes_count: number
  created_at: string
  hasLiked: boolean
}

interface Props {
  consultas: Consulta[]
}

export function ConsultasVecinosLista({ consultas }: Props) {
  const [likesState, setLikesState] = useState<Record<string, { count: number; hasLiked: boolean }>>(
    Object.fromEntries(consultas.map((c) => [c.id, { count: c.likes_count, hasLiked: c.hasLiked }]))
  )
  const [pending, startTransition] = useTransition()

  function handleLike(ticketId: string) {
    const current = likesState[ticketId]
    if (!current) return

    // Optimistic update
    setLikesState((prev) => ({
      ...prev,
      [ticketId]: {
        count: current.hasLiked ? current.count - 1 : current.count + 1,
        hasLiked: !current.hasLiked,
      },
    }))

    startTransition(async () => {
      const action = current.hasLiked ? removeLike : addLike
      const result = await action(ticketId)
      if (result?.error) {
        // Revertir si falla
        setLikesState((prev) => ({
          ...prev,
          [ticketId]: current,
        }))
      }
    })
  }

  return (
    <div className="flex flex-col gap-3">
      {consultas.map((consulta) => {
        const state = likesState[consulta.id] ?? { count: consulta.likes_count, hasLiked: consulta.hasLiked }

        return (
          <div key={consulta.id} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-brand-naranja">
                    {CATEGORY_LABELS[consulta.category] ?? consulta.category}
                  </span>
                  <span className="text-xs text-gray-400">·</span>
                  <span className="text-xs text-gray-400">
                    {TIPO_TRAMITE_LABELS[consulta.type] ?? 'Consulta'}
                  </span>
                </div>

                <h3 className="font-semibold leading-snug text-gray-900">{consulta.title}</h3>

                <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                  {consulta.localidad && <span>{consulta.localidad}</span>}
                  <span className="text-gray-300">·</span>
                  <span>{STATUS_LABELS[consulta.status] ?? consulta.status}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleLike(consulta.id)}
                disabled={pending}
                className={`flex shrink-0 flex-col items-center gap-0.5 rounded-xl border px-3 py-2 transition-colors ${
                  state.hasLiked
                    ? 'border-brand-naranja bg-orange-50 text-brand-naranja'
                    : 'border-gray-200 text-gray-400 hover:border-brand-naranja hover:text-brand-naranja'
                }`}
              >
                <Icon name={state.hasLiked ? 'thumb-up-filled' : 'thumb-up'} size={18} />
                <span className="text-xs font-semibold">{state.count}</span>
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
