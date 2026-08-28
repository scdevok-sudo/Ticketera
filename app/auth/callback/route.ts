import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
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
        const { data: teamMember } = await supabase
          .from('team_members')
          .select('id')
          .eq('user_id', user.id)
          .eq('active', true)
          .maybeSingle()

        const { data: profile } = await supabase
          .from('profiles')
          .select('profile_complete')
          .eq('id', user.id)
          .single()

        // El operador nunca pasa por /completar-perfil (ese formulario es del
        // ciudadano), así que su perfil se marca completo acá.
        if (teamMember) {
          if (!profile?.profile_complete) {
            const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
            if (serviceKey) {
              const serviceClient = createServiceClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                serviceKey
              )
              await serviceClient
                .from('profiles')
                .update({ profile_complete: true })
                .eq('id', user.id)
            }
          }

          return NextResponse.redirect(`${origin}/equipo/tickets`)
        }

        if (!profile?.profile_complete) {
          return NextResponse.redirect(`${origin}/completar-perfil`)
        }

        return NextResponse.redirect(`${origin}/ciudadano`)
      }
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`)
}
