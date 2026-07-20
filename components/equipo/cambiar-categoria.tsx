'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { cambiarCategoria } from '@/lib/actions/equipo'
import { CATEGORIES, CATEGORY_LABELS } from '@/lib/constants/tickets'

interface CambiarCategoriaProps {
  ticketId: string
  currentCategory: string
}

export function CambiarCategoria({ ticketId, currentCategory }: CambiarCategoriaProps) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [selected, setSelected] = useState(currentCategory)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSave() {
    if (selected === currentCategory) {
      setEditing(false)
      return
    }
    startTransition(async () => {
      const result = await cambiarCategoria(ticketId, selected)
      if (result?.error) {
        setError(result.error)
        return
      }
      setEditing(false)
      setError(null)
      router.refresh()
    })
  }

  function cancelar() {
    setSelected(currentCategory)
    setEditing(false)
    setError(null)
  }

  if (!editing) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-800">{CATEGORY_LABELS[currentCategory] ?? currentCategory}</span>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="text-xs font-medium text-brand-naranja hover:underline"
        >
          Corregir
        </button>
      </div>
    )
  }

  return (
    <div>
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        disabled={isPending}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:border-brand-azul focus:outline-none"
      >
        {CATEGORIES.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.label}
          </option>
        ))}
      </select>

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}

      <div className="mt-2 flex gap-2">
        <button
          type="button"
          disabled={isPending}
          onClick={handleSave}
          className="rounded-lg bg-brand-naranja px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
        >
          {isPending ? 'Guardando…' : 'Guardar'}
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
  )
}
