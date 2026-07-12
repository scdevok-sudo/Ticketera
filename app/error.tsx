'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { IconRefresh, IconArrowLeft } from '@tabler/icons-react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Error capturado por boundary:', error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
        <span className="text-3xl">⚠️</span>
      </div>

      <h1 className="mb-2 text-center text-2xl font-bold text-gray-900">Algo salió mal</h1>
      <p className="mb-2 max-w-sm text-center text-gray-500">
        Ocurrió un error inesperado. Podés intentar recargar la página.
      </p>

      {error.digest && (
        <p className="mb-6 font-mono text-xs text-gray-400">Código: {error.digest}</p>
      )}

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={reset}
          className="flex items-center gap-2 rounded-xl bg-brand-naranja px-6 py-3 font-semibold text-white transition-colors hover:bg-[#e66800]"
        >
          <IconRefresh size={18} />
          Reintentar
        </button>
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl border border-gray-200 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-100"
        >
          <IconArrowLeft size={18} />
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
