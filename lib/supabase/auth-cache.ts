import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'

/**
 * getUser cacheado con cache() de React.
 * Se ejecuta UNA SOLA VEZ por request.
 * Si el token está expirado o es inválido, retorna null silenciosamente
 * en lugar de propagar el error y generar múltiples intentos de refresh.
 */
export const getUser = cache(async () => {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    // Si hay error de token inválido, retornar null sin explotar
    if (error) return null

    return user ?? null
  } catch {
    // Cualquier error de red o auth → tratar como sin sesión
    return null
  }
})

/**
 * getTeamMember cacheado.
 * Retorna el registro de team_members o null.
 * Reutiliza el getUser() cacheado (no vuelve a llamar a supabase.auth.getUser())
 * para no duplicar el intento de auth dentro del mismo request.
 */
export const getTeamMember = cache(async () => {
  try {
    const user = await getUser()
    if (!user) return null

    const supabase = await createClient()
    const { data } = await supabase
      .from('team_members')
      .select('id, role, area')
      .eq('user_id', user.id)
      .eq('active', true)
      .maybeSingle()

    return data ?? null
  } catch {
    return null
  }
})
