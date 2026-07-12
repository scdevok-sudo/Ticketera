'use client'

import { useEffect } from 'react'
import { IconRefresh } from '@tabler/icons-react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorTransparencia({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Error en transparencia:', error)
  }, [error])

  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center px-4 text-center">
      <p className="mb-4 text-sm text-gray-500">No pudimos cargar las estadísticas en este momento.</p>
      {error.digest && (
        <p className="mb-4 font-mono text-xs text-gray-400">Código: {error.digest}</p>
      )}
      <button
        onClick={reset}
        className="flex items-center gap-2 rounded-lg bg-brand-naranja px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#e66800]"
      >
        <IconRefresh size={16} />
        Reintentar
      </button>
    </div>
  )
}
