import type { Metadata } from 'next'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Sitio temporalmente fuera de servicio',
  robots: { index: false, follow: false },
}

export default function SuspendidoPage() {
  return (
    <div className="fixed inset-0 z-[2147483646] flex flex-col items-center justify-center gap-3 bg-black px-6 text-center text-white">
      <p className="text-sm text-neutral-300">Sitio temporalmente fuera de servicio</p>
      <a
        href="https://scdev.com.ar"
        className="text-xs text-neutral-500 underline underline-offset-2 hover:text-neutral-300"
      >
        scdev.com.ar
      </a>
    </div>
  )
}
