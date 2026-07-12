import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('profile_complete')
          .eq('id', user.id)
          .single()

        if (!profile?.profile_complete) {
          return NextResponse.redirect(`${origin}/completar-perfil`)
        }

        const { data: teamMember } = await supabase
          .from('team_members')
          .select('id')
          .eq('user_id', user.id)
          .eq('active', true)
          .single()

        if (teamMember) {
          return NextResponse.redirect(`${origin}/equipo/dashboard`)
        }

        return NextResponse.redirect(`${origin}/ciudadano`)
      }
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`)
}
