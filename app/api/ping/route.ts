import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  await supabase.from('tickets').select('id', { count: 'exact', head: true }).eq('is_public', true)

  return Response.json({ ok: true, timestamp: new Date().toISOString() })
}
