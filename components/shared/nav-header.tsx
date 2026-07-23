'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { SignOutButton } from '@/components/ui/sign-out-button'
import { Icon } from '@/components/ui/icon'
import logoBlanco from '@/public/brand/logo-blanco.png'

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
            src={logoBlanco}
            alt="Unidos Hacemos"
            priority
            className="h-8 w-auto sm:h-9"
          />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
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

        <div className="hidden items-center gap-3 lg:flex">
          {variant === 'ciudadano' && userName && (
            <span className="text-[13px] font-medium text-white">{userName}</span>
          )}
          {variant === 'ciudadano' && <SignOutButton />}
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Abrir menú"
          className="flex h-8 w-8 items-center justify-center rounded-md text-white lg:hidden"
        >
          <Icon name="menu-2" size={22} />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />
      )}

      <div
        className={`fixed top-0 right-0 z-[60] flex h-full w-72 max-w-[85vw] transform flex-col bg-[#2D3077] transition-transform duration-300 lg:hidden ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          {variant === 'ciudadano' && userName ? (
            <span className="truncate text-sm font-semibold text-white">{userName}</span>
          ) : (
            <span className="text-sm font-semibold text-white">Menú</span>
          )}
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Cerrar menú"
            className="p-1 text-white/70 hover:text-white"
          >
            <Icon name="x" size={24} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col overflow-y-auto py-2">
          {tabs.map((tab) => (
            <Link
              key={tab.key}
              href={tab.href}
              onClick={() => setOpen(false)}
              aria-current={isActive(tab) ? 'page' : undefined}
              className={`border-b border-white/10 px-6 py-4 text-lg transition-colors duration-150 ease-in-out ${
                isActive(tab) ? 'bg-brand-naranja font-semibold text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </nav>

        {variant === 'ciudadano' && (
          <div className="border-t border-white/10 px-6 py-4">
            <SignOutButton />
          </div>
        )}
      </div>
    </header>
  )
}
