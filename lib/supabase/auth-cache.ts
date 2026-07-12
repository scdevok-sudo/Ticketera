import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'

export const getUser = cache(async () => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
})

export const getTeamMember = cache(async () => {
  const user = await getUser()
  if (!user) return null
  const supabase = await createClient()
  const { data } = await supabase
    .from('team_members')
    .select('id, role, area')
    .eq('user_id', user.id)
    .eq('active', true)
    .single()
  return data
})
