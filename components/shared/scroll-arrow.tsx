'use client'

import { useEffect, useState } from 'react'
import { Icon } from '@/components/ui/icon'

export function ScrollArrow() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY < 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className={`absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-1 text-white/80 transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <span className="text-xs font-medium uppercase tracking-wide">Deslizá</span>
      <Icon name="chevron-down" size={28} className="animate-bounce" />
    </div>
  )
}
