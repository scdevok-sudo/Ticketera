'use client'

import { useState, useTransition } from 'react'
import { addLike, removeLike } from '@/lib/actions/tickets'
import { TicketCard } from './ticket-card'

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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {consultas.map((consulta) => {
        const state = likesState[consulta.id] ?? { count: consulta.likes_count, hasLiked: consulta.hasLiked }

        return (
          <TicketCard
            key={consulta.id}
            ticket={{ ...consulta, likes_count: state.count }}
            showLikes
            disableLink
            hasLiked={state.hasLiked}
            likePending={pending}
            onLike={() => handleLike(consulta.id)}
          />
        )
      })}
    </div>
  )
}
