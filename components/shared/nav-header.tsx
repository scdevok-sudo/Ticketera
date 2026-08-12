'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
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
  isTeamMember?: boolean
  hideOnTop?: boolean
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
  'whitespace-nowrap rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors duration-150 ease-in-out'

function UserDropdown({ userName }: { userName?: string }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const firstName = userName?.trim().split(/\s+/)[0] || 'Mi cuenta'

  useEffect(() => {
    if (!open) return

    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  useEffect(() => {
    const handleScroll = () => setOpen(false)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 whitespace-nowrap rounded-md px-2 py-1.5 text-[13px] font-medium text-white transition-colors duration-150 ease-in-out hover:bg-white/15"
      >
        {firstName}
        <Icon
          name="chevron-down"
          size={14}
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 min-w-[160px] rounded-lg border border-gray-100 bg-white shadow-lg">
          <Link
            href="/ciudadano/perfil"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
          >
            <Icon name="user" size={16} />
            Mi perfil
          </Link>
          <hr className="border-gray-100" />
          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
          >
            <Icon name="logout" size={16} />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  )
}

function MobileSignOut({ onNavigate }: { onNavigate: () => void }) {
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    onNavigate()
    router.push('/login')
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="flex w-full items-center gap-3 text-lg font-medium text-red-300 transition-colors hover:text-red-200"
    >
      <Icon name="logout" size={20} />
      Cerrar sesión
    </button>
  )
}

export function NavHeader({ variant, activeTab, userName, isTeamMember, hideOnTop }: NavHeaderProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(!hideOnTop)
  const tabs = TABS[variant]

  function isActive(tab: Tab) {
    if (activeTab) return tab.key === activeTab
    return pathname.startsWith(tab.href)
  }

  useEffect(() => {
    if (!hideOnTop) return

    const handleScroll = () => {
      setVisible(window.scrollY > 80)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [hideOnTop])

  return (
    <>
      <header
        className={`bg-brand-naranja ${
          hideOnTop
            ? `fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
                visible || open ? 'translate-y-0' : '-translate-y-full'
              }`
            : ''
        }`}
      >
        <div className="mx-auto flex h-12 max-w-[1200px] items-center justify-between gap-3 px-4 sm:h-14 sm:px-6">
          <Link href="/" className="shrink-0">
            <Image
              src={logoBlanco}
              alt="Unidos Construimos"
              priority
              className="h-8 w-auto sm:h-9"
            />
          </Link>

          <nav className="hidden items-center gap-0.5 lg:flex">
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

          <div className="hidden items-center gap-2 lg:flex">
            {variant === 'ciudadano' && isTeamMember && (
              <Link
                href="/equipo/tickets"
                className="whitespace-nowrap rounded-md bg-brand-azul px-3.5 py-1.5 text-[13px] font-semibold text-white transition-colors duration-150 ease-in-out hover:bg-[#242964]"
              >
                Panel del equipo
              </Link>
            )}
            {variant === 'ciudadano' && <UserDropdown userName={userName} />}
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
      </header>

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
          {variant === 'ciudadano' && isTeamMember && (
            <Link
              href="/equipo/tickets"
              onClick={() => setOpen(false)}
              className="border-b border-white/10 px-6 py-4 text-lg text-white/80 transition-colors duration-150 ease-in-out hover:bg-white/10 hover:text-white"
            >
              Panel del equipo
            </Link>
          )}
          {variant === 'ciudadano' && (
            <Link
              href="/ciudadano/perfil"
              onClick={() => setOpen(false)}
              aria-current={pathname.startsWith('/ciudadano/perfil') ? 'page' : undefined}
              className={`flex items-center gap-3 border-b border-white/10 px-6 py-4 text-lg transition-colors duration-150 ease-in-out ${
                pathname.startsWith('/ciudadano/perfil')
                  ? 'bg-brand-naranja font-semibold text-white'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon name="user" size={20} />
              Mi perfil
            </Link>
          )}
        </nav>

        {variant === 'ciudadano' && (
          <div className="border-t border-white/10 px-6 py-4">
            <MobileSignOut onNavigate={() => setOpen(false)} />
          </div>
        )}
      </div>
    </>
  )
}
