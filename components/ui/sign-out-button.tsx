'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function SignOutButton() {
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="rounded-md border border-white/50 px-3 py-1.5 text-sm font-medium text-white transition-colors duration-150 ease-in-out hover:bg-white/10"
    >
      Cerrar sesión
    </button>
  )
}
