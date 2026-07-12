'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { addNotaInterna, addRespuestaCiudadano } from '@/lib/actions/equipo'

const PLANTILLAS = [
  'Acuse de recibo: Tu consulta fue recibida y está siendo analizada.',
  'Derivado: Tu consulta fue derivada al área correspondiente para su resolución.',
  'En gestión: Estamos trabajando en la resolución de tu solicitud.',
  'Resuelto: Tu solicitud fue procesada. Gracias por comunicarte.',
]

type Tab = 'interna' | 'respuesta'

export function NotaInterna({ ticketId }: { ticketId: string }) {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('interna')
  const [content, setContent] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleTabChange(newTab: Tab) {
    setTab(newTab)
    setContent('')
    setError(null)
  }

  function handleSubmit() {
    const trimmed = content.trim()
    if (!trimmed) return
    setError(null)

    startTransition(async () => {
      const action = tab === 'interna' ? addNotaInterna : addRespuestaCiudadano
      const result = await action(ticketId, trimmed)
      if (result?.error) {
        setError(result.error)
        return
      }
      setContent('')
      router.refresh()
      document.getElementById('timeline-end')?.scrollIntoView({ behavior: 'smooth' })
    })
  }

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      <div className="mb-3 flex gap-2 border-b border-gray-200">
        <button
          type="button"
          onClick={() => handleTabChange('interna')}
          className={`border-b-2 px-3 py-2 text-sm font-medium ${
            tab === 'interna' ? 'border-yellow-400 text-yellow-700' : 'border-transparent text-gray-500'
          }`}
        >
          Nota interna
        </button>
        <button
          type="button"
          onClick={() => handleTabChange('respuesta')}
          className={`border-b-2 px-3 py-2 text-sm font-medium ${
            tab === 'respuesta' ? 'border-brand-azul text-brand-azul' : 'border-transparent text-gray-500'
          }`}
        >
          Respuesta al ciudadano
        </button>
      </div>

      <select
        onChange={(e) => {
          if (e.target.value) setContent(e.target.value)
          e.target.value = ''
        }}
        defaultValue=""
        className="mb-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-500"
      >
        <option value="">Plantillas rápidas…</option>
        {PLANTILLAS.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={1000}
        rows={4}
        placeholder={
          tab === 'interna'
            ? 'Escribí una nota visible solo para el equipo…'
            : 'Escribí una respuesta visible para el ciudadano…'
        }
        className={`w-full resize-none rounded-lg border px-3 py-2 text-sm focus:outline-none ${
          tab === 'interna'
            ? 'border-yellow-300 bg-yellow-50 text-gray-800 focus:border-yellow-400'
            : 'border-blue-200 bg-blue-50 text-blue-900 focus:border-brand-azul'
        }`}
      />

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}

      <button
        type="button"
        disabled={isPending || !content.trim()}
        onClick={handleSubmit}
        className="mt-2 rounded-lg bg-brand-azul px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? 'Enviando…' : tab === 'interna' ? 'Guardar nota' : 'Enviar respuesta'}
      </button>
    </div>
  )
}
