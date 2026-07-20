'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { SignOutButton } from '@/components/ui/sign-out-button'
import { Icon } from '@/components/ui/icon'

type TabKey = 'mis-reclamos' | 'consultas-vecinos' | 'nuevo-reclamo' | 'transparencia' | 'registrar'

interface Tab {
  key: TabKey
  label: string
  href: string
}

interface NavHeaderProps {
  variant: 'ciudadano' | 'publico'
  activeTab?: TabKey
  userName?: string
}

const TABS: Record<NavHeaderProps['variant'], Tab[]> = {
  publico: [
    { key: 'registrar', label: 'Hacer una consulta', href: '/login' },
    { key: 'transparencia', label: 'Transparencia pública', href: '/transparencia' },
  ],
  ciudadano: [
    { key: 'mis-reclamos', label: 'Mis consultas', href: '/ciudadano/mis-reclamos' },
    { key: 'consultas-vecinos', label: 'Consultas de vecinos', href: '/ciudadano/consultas' },
    { key: 'nuevo-reclamo', label: 'Nueva consulta', href: '/ciudadano/nuevo-reclamo' },
    { key: 'transparencia', label: 'Transparencia pública', href: '/transparencia' },
  ],
}

const TAB_CLASS =
  'whitespace-nowrap rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors duration-150 ease-in-out'

export function NavHeader({ variant, activeTab, userName }: NavHeaderProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const tabs = TABS[variant]

  function isActive(tab: Tab) {
    if (activeTab) return tab.key === activeTab
    return pathname.startsWith(tab.href)
  }

  return (
    <header className="bg-brand-naranja">
      <div className="mx-auto flex h-12 max-w-[1200px] items-center justify-between gap-3 px-4 sm:h-14 sm:px-6">
        <Link href="/" className="shrink-0">
          <Image
            src="/brand/logo-blanco.png"
            alt="Unidos Hacemos"
            width={120}
            height={36}
            priority
            className="h-8 w-auto sm:h-9"
          />
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          {tabs.map((tab) => (
            <Link
              key={tab.key}
              href={tab.href}
              aria-current={isActive(tab) ? 'page' : undefined}
              className={`${TAB_CLASS} ${
                isActive(tab) ? 'bg-white text-brand-naranja' : 'text-white/85 hover:bg-white/15'
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {variant === 'ciudadano' && userName && (
            <span className="hidden text-[13px] font-medium text-white sm:inline">{userName}</span>
          )}
          {variant === 'ciudadano' && <SignOutButton />}

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            className="flex h-8 w-8 items-center justify-center rounded-md text-white sm:hidden"
          >
            <Icon name={open ? 'x' : 'menu-2'} size={20} />
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-white/15 px-4 py-2 sm:hidden">
          {tabs.map((tab) => (
            <Link
              key={tab.key}
              href={tab.href}
              onClick={() => setOpen(false)}
              aria-current={isActive(tab) ? 'page' : undefined}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150 ease-in-out ${
                isActive(tab) ? 'bg-white text-brand-naranja' : 'text-white/85 hover:bg-white/15'
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
