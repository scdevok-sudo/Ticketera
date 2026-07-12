'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { asignarTicket } from '@/lib/actions/equipo'

interface TeamMemberOption {
  id: string
  nombre: string
  area: string | null
}

interface AsignarTicketProps {
  ticketId: string
  currentAssigneeId: string | null
  teamMembers: TeamMemberOption[]
}

export function AsignarTicket({ ticketId, currentAssigneeId, teamMembers }: AsignarTicketProps) {
  const router = useRouter()
  const [pendingAssignee, setPendingAssignee] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [nota, setNota] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleChange(value: string) {
    const newAssigneeId = value === '' ? null : value
    if (newAssigneeId === currentAssigneeId) return
    setPendingAssignee(newAssigneeId)
    setNota('')
    setError(null)
    setShowModal(true)
  }

  function cerrar() {
    setShowModal(false)
    setPendingAssignee(null)
  }

  function confirmar() {
    startTransition(async () => {
      const result = await asignarTicket(ticketId, pendingAssignee, nota.trim() || undefined)
      if (result?.error) {
        setError(result.error)
        return
      }
      setShowModal(false)
      router.refresh()
    })
  }

  const pendingMember = teamMembers.find((m) => m.id === pendingAssignee)

  return (
    <div>
      <label className="block text-xs font-medium text-gray-500">Asignado a</label>
      <select
        value={currentAssigneeId ?? ''}
        onChange={(e) => handleChange(e.target.value)}
        disabled={isPending}
        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:border-brand-azul focus:outline-none"
      >
        <option value="">Sin asignar</option>
        {teamMembers.map((m) => (
          <option key={m.id} value={m.id}>
            {m.nombre}
            {m.area ? ` · ${m.area}` : ''}
          </option>
        ))}
      </select>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-5 shadow-lg">
            <h3 className="mb-2 text-sm font-bold text-gray-900">
              {pendingAssignee ? `Asignar a ${pendingMember?.nombre ?? 'operador'}` : 'Quitar asignación'}
            </h3>
            <label className="block text-xs font-medium text-gray-500">Nota u observación (opcional)</label>
            <textarea
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              maxLength={500}
              rows={3}
              className="mt-1 w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:border-brand-azul focus:outline-none"
            />
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                disabled={isPending}
                onClick={confirmar}
                className="flex-1 rounded-lg bg-brand-azul px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {isPending ? 'Guardando…' : 'Confirmar'}
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={cerrar}
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-600"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
