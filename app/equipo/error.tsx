'use client'

import { useEffect } from 'react'
import { IconRefresh } from '@tabler/icons-react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorEquipo({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Error en dashboard equipo:', error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
        <span className="text-2xl">⚠️</span>
      </div>
      <h2 className="mb-2 text-center text-xl font-bold text-gray-900">Error en el dashboard</h2>
      <p className="mb-2 max-w-sm text-center text-sm text-gray-500">
        Ocurrió un error al cargar esta sección del panel interno.
      </p>
      {error.digest && (
        <p className="mb-4 font-mono text-xs text-gray-400">Código: {error.digest}</p>
      )}
      <button
        onClick={reset}
        className="flex items-center gap-2 rounded-lg bg-brand-azul px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-900"
      >
        <IconRefresh size={16} />
        Reintentar
      </button>
    </div>
  )
}
