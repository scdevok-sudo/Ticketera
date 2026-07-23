'use client'

import { usePathname } from 'next/navigation'
import { AvatarFlotante } from '@/components/ciudadano/avatar-flotante'

export function AvatarCondicional() {
  const pathname = usePathname()
  if (pathname.startsWith('/equipo')) return null
  return <AvatarFlotante />
}
