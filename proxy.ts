import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PROTECTED_ROUTES = ['/ciudadano', '/equipo', '/completar-perfil']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rutas públicas: salir sin tocar Supabase (evita latencia de ~100-450ms por request)
  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
  if (!isProtected) {
    return NextResponse.next()
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // La verificación de team_members (rol de operador) se hace en
  // app/equipo/layout.tsx como Server Component, para evitar queries desde el Edge.
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // profile_complete se verifica acá (y no solo en los Server Components) porque
  // el botón "atrás" del browser puede mostrar /ciudadano sin volver a pasar por
  // el layout si la página quedó cacheada.
  if (pathname.startsWith('/ciudadano') || pathname.startsWith('/completar-perfil')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('profile_complete')
      .eq('id', user.id)
      .single()

    if (!profile?.profile_complete && pathname.startsWith('/ciudadano')) {
      return NextResponse.redirect(new URL('/completar-perfil', request.url))
    }

    if (profile?.profile_complete && pathname.startsWith('/completar-perfil')) {
      return NextResponse.redirect(new URL('/ciudadano', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2)$).*)',
  ],
}
