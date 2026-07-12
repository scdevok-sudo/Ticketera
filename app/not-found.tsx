import Link from 'next/link'
import { IconArrowLeft, IconMoodSad } from '@tabler/icons-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100">
        <IconMoodSad size={40} className="text-brand-naranja" />
      </div>

      <p className="mb-2 text-8xl font-black text-brand-naranja">404</p>

      <h1 className="mb-2 text-center text-2xl font-bold text-gray-900">Esta página no existe</h1>
      <p className="mb-8 max-w-sm text-center text-gray-500">
        La dirección que ingresaste no corresponde a ninguna sección de Unidos Hacemos.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl bg-brand-naranja px-6 py-3 font-semibold text-white transition-colors hover:bg-[#e66800]"
        >
          <IconArrowLeft size={18} />
          Volver al inicio
        </Link>
        <Link
          href="/transparencia"
          className="flex items-center gap-2 rounded-xl border border-gray-200 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-100"
        >
          Ver portal de transparencia
        </Link>
      </div>

      <p className="mt-12 text-xs text-gray-400">
        Unidos Hacemos · Equipo del Diputado José Corral · Santa Fe
      </p>
    </div>
  )
}
