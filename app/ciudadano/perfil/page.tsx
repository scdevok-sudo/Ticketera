import { redirect } from 'next/navigation'
import { getUser } from '@/lib/supabase/auth-cache'
import { createClient } from '@/lib/supabase/server'
import { EditarPerfilForm } from '@/components/ciudadano/editar-perfil-form'

export default async function PerfilPage() {
  const user = await getUser()
  if (!user) redirect('/login')

  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email, dni, phone, localidad, localidad_tipo, barrio, departamento, sexo')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/completar-perfil')

  return (
    <div className="mx-auto w-full max-w-[600px] px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-extrabold text-gray-900">Mi perfil</h1>
      <p className="mt-1 text-sm text-zinc-500">Actualizá tus datos de contacto y localización.</p>

      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
        <EditarPerfilForm profile={profile} />
      </div>
    </div>
  )
}
