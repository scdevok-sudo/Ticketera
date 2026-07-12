'use client'

import { useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { STATUS_LABELS, PRIORITY_LABELS, TIPO_TRAMITE_LABELS } from '@/lib/constants/tickets'

interface TeamMemberOption {
  id: string
  nombre: string
}

interface FiltrosTicketProps {
  teamMembers: TeamMemberOption[]
}

const FILTER_KEYS = ['estado', 'prioridad', 'tipo', 'responsable', 'area', 'q']

export function FiltrosTicket({ teamMembers }: FiltrosTicketProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [q, setQ] = useState(searchParams.get('q') ?? '')

  const activeCount = FILTER_KEYS.filter((key) => searchParams.get(key)).length

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    params.delete('page')
    router.push(params.size > 0 ? `${pathname}?${params.toString()}` : pathname)
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    updateParam('q', q.trim())
  }

  function limpiarFiltros() {
    setQ('')
    router.push(pathname)
  }

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2 rounded-lg bg-white p-3 shadow-sm">
      <select
        value={searchParams.get('estado') ?? ''}
        onChange={(e) => updateParam('estado', e.target.value)}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700"
      >
        <option value="">Todos los estados</option>
        {Object.entries(STATUS_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <select
        value={searchParams.get('prioridad') ?? ''}
        onChange={(e) => updateParam('prioridad', e.target.value)}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700"
      >
        <option value="">Toda prioridad</option>
        {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <select
        value={searchParams.get('tipo') ?? ''}
        onChange={(e) => updateParam('tipo', e.target.value)}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700"
      >
        <option value="">Todo tipo</option>
        {Object.entries(TIPO_TRAMITE_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <select
        value={searchParams.get('responsable') ?? ''}
        onChange={(e) => updateParam('responsable', e.target.value)}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700"
      >
        <option value="">Todo responsable</option>
        {teamMembers.map((m) => (
          <option key={m.id} value={m.id}>
            {m.nombre}
          </option>
        ))}
      </select>

      <form onSubmit={handleSearchSubmit} className="flex min-w-[200px] flex-1 items-center gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por título o descripción…"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-brand-azul focus:outline-none"
        />
      </form>

      {activeCount > 0 && (
        <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-brand-naranja">
          {activeCount} filtro{activeCount > 1 ? 's' : ''}
        </span>
      )}

      <button
        type="button"
        onClick={limpiarFiltros}
        className="rounded-lg px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100"
      >
        Limpiar filtros
      </button>
    </div>
  )
}
