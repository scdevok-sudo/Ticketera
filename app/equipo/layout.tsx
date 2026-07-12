import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/equipo/sidebar'
import { getUser, getTeamMember } from '@/lib/supabase/auth-cache'

export default async function EquipoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  const [teamMember, { data: profile }] = await Promise.all([
    getTeamMember(),
    supabase.from('profiles').select('full_name').eq('id', user.id).single(),
  ])

  if (!teamMember) {
    redirect('/ciudadano')
  }

  const displayName = profile?.full_name ?? user.email ?? 'Operador'

  return (
    <div className="min-h-screen bg-equipo-bg">
      <Sidebar role={teamMember.role} />

      <div className="flex flex-col md:pl-60">
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-4 pl-16 md:px-8 md:pl-8">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500">{displayName}</p>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  )
}
