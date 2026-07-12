'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { agregarMiembro, desactivarMiembro } from '@/lib/actions/equipo'

export interface MemberRow {
  id: string
  nombre: string
  email: string | null
  role: string | null
  area: string | null
  createdAt: string | null
}

export function GestionMiembros({ members }: { members: MemberRow[] }) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'admin' | 'operator'>('operator')
  const [area, setArea] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [confirmingId, setConfirmingId] = useState<string | null>(null)

  function handleAgregar(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)
    startTransition(async () => {
      const result = await agregarMiembro(email.trim(), role, area.trim())
      if (result?.error) {
        setFormError(result.error)
        return
      }
      setEmail('')
      setArea('')
      setRole('operator')
      router.refresh()
    })
  }

  function handleDesactivar(memberId: string) {
    startTransition(async () => {
      await desactivarMiembro(memberId)
      setConfirmingId(null)
      router.refresh()
    })
  }

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="border-b border-gray-200 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-5 py-3 font-medium">Nombre</th>
              <th className="px-5 py-3 font-medium">Email</th>
              <th className="px-5 py-3 font-medium">Rol</th>
              <th className="px-5 py-3 font-medium">Área</th>
              <th className="px-5 py-3 font-medium">Activo desde</th>
              <th className="px-5 py-3 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {members.map((m) => (
              <tr key={m.id}>
                <td className="px-5 py-3 text-gray-800">{m.nombre}</td>
                <td className="px-5 py-3 text-gray-600">{m.email ?? '—'}</td>
                <td className="px-5 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      m.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {m.role === 'admin' ? 'Admin' : 'Operador'}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-600">{m.area ?? '—'}</td>
                <td className="px-5 py-3 text-gray-500">
                  {m.createdAt ? new Date(m.createdAt).toLocaleDateString('es-AR') : '—'}
                </td>
                <td className="px-5 py-3">
                  {confirmingId === m.id ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">¿Confirmar?</span>
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => handleDesactivar(m.id)}
                        className="rounded-lg bg-red-600 px-2.5 py-1 text-xs font-semibold text-white disabled:opacity-60"
                      >
                        Sí
                      </button>
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => setConfirmingId(null)}
                        className="rounded-lg border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-600"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmingId(m.id)}
                      className="rounded-lg border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      Desactivar
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {members.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-6 text-center text-gray-400">
                  No hay miembros activos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="rounded-lg bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-sm font-bold text-gray-900">Agregar miembro</h2>
        <form onSubmit={handleAgregar} className="grid grid-cols-1 gap-3 sm:grid-cols-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email de Gmail"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:border-brand-azul focus:outline-none sm:col-span-2"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as 'admin' | 'operator')}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:border-brand-azul focus:outline-none"
          >
            <option value="operator">Operador</option>
            <option value="admin">Admin</option>
          </select>
          <input
            required
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="Área"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:border-brand-azul focus:outline-none"
          />
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-brand-azul px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 sm:col-span-4 sm:w-fit"
          >
            {isPending ? 'Agregando…' : 'Agregar miembro'}
          </button>
        </form>
        {formError && <p className="mt-2 text-xs text-red-600">{formError}</p>}
      </div>
    </div>
  )
}
