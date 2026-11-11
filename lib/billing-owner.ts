import 'server-only'
import { createClient } from '@/lib/supabase/server'

/**
 * ¿La persona logueada es el dueño de SCdev (BILLING_OWNER_EMAIL)?
 * Independiente de team_members y de los roles: ser admin del equipo no alcanza.
 * Usa getUser() (validado contra Supabase), nunca getSession().
 */
export async function isBillingOwner(): Promise<boolean> {
  try {
    const ownerEmail = process.env.BILLING_OWNER_EMAIL?.trim().toLowerCase()
    if (!ownerEmail) return false

    const supabase = await createClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) return false
    if (!user.email || user.email.trim().toLowerCase() !== ownerEmail) return false
    if (!user.email_confirmed_at) return false

    return true
  } catch {
    return false
  }
}
