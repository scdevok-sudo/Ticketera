'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogoJC } from '@/components/ui/logo-jc'
import { SignOutButton } from '@/components/ui/sign-out-button'
import { Icon } from '@/components/ui/icon'

interface SidebarProps {
  role: string | null
}

const NAV_ITEMS = [
  { href: '/equipo/tickets', label: 'Tickets', icon: 'clipboard-list' },
  { href: '/equipo/kpis', label: 'KPIs', icon: 'chart-bar' },
]

const ADMIN_NAV_ITEM = { href: '/equipo/equipo', label: 'Equipo', icon: 'users' }

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const items = role === 'admin' ? [...NAV_ITEMS, ADMIN_NAV_ITEM] : NAV_ITEMS

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed left-3 top-3 z-50 flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm md:hidden"
        aria-label="Abrir menú"
      >
        <Icon name="menu-2" size={20} className="text-brand-azul" />
      </button>

      {open && (
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-60 flex-col bg-brand-azul transition-transform md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="px-5 py-5">
          <LogoJC size={28} showText textColor="#ffffff" />
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {items.map((item) => {
            const active = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active ? 'bg-brand-naranja text-white' : 'text-white/80 hover:bg-white/10'
                }`}
              >
                <Icon name={item.icon} size={18} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-white/10 px-3 py-3">
          <Link
            href="/transparencia"
            target="_blank"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/10"
          >
            <Icon name="world" size={18} />
            Portal público
          </Link>
        </div>

        <div className="border-t border-white/10 px-5 py-4">
          <SignOutButton />
        </div>
      </aside>
    </>
  )
}
