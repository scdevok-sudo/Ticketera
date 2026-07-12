import { redirect } from 'next/navigation'
import { getTeamMembers } from '@/lib/actions/equipo'
import { unwrapEmbed } from '@/lib/supabase/embed'
import { getTeamMember } from '@/lib/supabase/auth-cache'
import { GestionMiembros, type MemberRow } from '@/components/equipo/gestion-miembros'

export default async function GestionEquipoPage() {
  // El layout (app/equipo/layout.tsx) ya validó user + team_member activo con
  // los mismos helpers cacheados: reusar getTeamMember() en vez de repetir las
  // consultas evita un round-trip extra a Supabase por esta página.
  const teamMember = await getTeamMember()

  if (!teamMember || teamMember.role !== 'admin') {
    redirect('/equipo/tickets')
  }

  const members = await getTeamMembers()

  const memberRows: MemberRow[] = members.map((m) => {
    const profile = unwrapEmbed(m.profiles)
    return {
      id: m.id,
      nombre: profile?.full_name ?? 'Sin nombre',
      email: profile?.email ?? null,
      role: m.role,
      area: m.area,
      createdAt: m.created_at,
    }
  })

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold text-gray-900">Equipo</h2>
      <GestionMiembros members={memberRows} />
    </div>
  )
}
