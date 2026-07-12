'use client'

import { IconX } from '@tabler/icons-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function BtnCerrarFormulario() {
  const [confirmando, setConfirmando] = useState(false)
  const router = useRouter()

  async function handleCerrar() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirmando(true)}
        className="absolute top-4 right-4 text-gray-400 transition-colors hover:text-gray-600"
        aria-label="Cancelar registro"
      >
        <IconX size={24} />
      </button>

      {confirmando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h3 className="mb-2 font-semibold text-gray-900">¿Cancelar el registro?</h3>
            <p className="mb-6 text-sm text-gray-500">
              Si salís ahora, tu cuenta de Google no quedará vinculada al sistema. Podés volver a
              registrarte cuando quieras.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmando(false)}
                className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
              >
                Seguir registrándome
              </button>
              <button
                type="button"
                onClick={handleCerrar}
                className="flex-1 rounded-lg bg-gray-900 px-4 py-2 text-sm text-white transition-colors hover:bg-gray-700"
              >
                Sí, salir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
