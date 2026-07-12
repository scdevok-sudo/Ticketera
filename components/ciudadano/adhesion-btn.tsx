'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { addLike, removeLike } from '@/lib/actions/tickets'

interface AdhesionBtnProps {
  ticketId: string
  hasLiked: boolean
  likesCount: number
}

export function AdhesionBtn({ ticketId, hasLiked, likesCount }: AdhesionBtnProps) {
  const router = useRouter()
  const [liked, setLiked] = useState(hasLiked)
  const [count, setCount] = useState(likesCount)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function toggle() {
    setError(null)
    const nextLiked = !liked

    startTransition(async () => {
      const action = nextLiked ? addLike : removeLike
      const result = await action(ticketId)
      if (result?.error) {
        setError(result.error)
        return
      }
      setLiked(nextLiked)
      setCount((c) => c + (nextLiked ? 1 : -1))
      router.refresh()
    })
  }

  return (
    <div>
      <button
        type="button"
        disabled={isPending}
        onClick={toggle}
        className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
          liked
            ? 'bg-brand-naranja text-white'
            : 'border border-brand-naranja text-brand-naranja hover:bg-orange-50'
        }`}
      >
        <span>{liked ? 'Apoyado ✓' : 'Apoyar esta consulta'}</span>
        <span className={liked ? 'text-white/80' : 'text-brand-naranja/70'}>{count}</span>
      </button>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}
