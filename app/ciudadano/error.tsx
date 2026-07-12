'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { IconRefresh, IconArrowLeft } from '@tabler/icons-react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorCiudadano({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Error en sección ciudadano:', error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
        <span className="text-2xl">⚠️</span>
      </div>
      <h2 className="mb-2 text-center text-xl font-bold text-gray-900">
        No pudimos cargar esta sección
      </h2>
      <p className="mb-6 max-w-sm text-center text-sm text-gray-500">
        Hubo un problema al conectar con el servidor. Intentá de nuevo en unos segundos.
      </p>
      {error.digest && (
        <p className="mb-4 font-mono text-xs text-gray-400">Código: {error.digest}</p>
      )}
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="flex items-center gap-2 rounded-lg bg-brand-naranja px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#e66800]"
        >
          <IconRefresh size={16} />
          Reintentar
        </button>
        <Link
          href="/ciudadano"
          className="flex items-center gap-2 rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          <IconArrowLeft size={16} />
          Mis consultas
        </Link>
      </div>
    </div>
  )
}
