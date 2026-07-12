'use client'

import { useEffect, useState } from 'react'

export function SuccessBanner() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <div className="mb-4 flex items-center gap-2 rounded-lg bg-[#E7F6EF] px-4 py-3 text-sm font-medium text-[#1A6B40]">
      <span aria-hidden="true">✓</span>
      <span>¡Consulta registrada! Te enviamos un email de confirmación.</span>
    </div>
  )
}
