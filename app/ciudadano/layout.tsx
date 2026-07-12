import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { NavHeader } from '@/components/shared/nav-header'
import { getUser } from '@/lib/supabase/auth-cache'

export default async function CiudadanoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  const displayName = profile?.full_name ?? user.email ?? 'Vecino/a'

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F3]">
      <NavHeader variant="ciudadano" userName={displayName} />
      <div className="mx-auto w-full max-w-[1200px] px-4 pt-2 text-right sm:px-6">
        <Link href="/ayuda" className="text-xs text-zinc-400 hover:text-zinc-600">
          Ayuda
        </Link>
      </div>
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  )
}
