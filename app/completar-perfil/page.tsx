import { redirect } from 'next/navigation'
import { getUser } from '@/lib/supabase/auth-cache'
import { LogoJC } from '@/components/ui/logo-jc'
import { ProfileForm } from './profile-form'
import { BtnCerrarFormulario } from './btn-cerrar-formulario'

// Evita que "atrás" en el browser muestre una versión cacheada sin pasar
// por proxy.ts (que redirige según profile_complete).
export const dynamic = 'force-dynamic'

export default async function CompletarPerfilPage() {
  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  const fullName =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    user.email ??
    'Usuario'
  const initial = fullName.charAt(0).toUpperCase()

  return (
    <div
      className="min-h-screen"
      style={{
        background: 'linear-gradient(150deg, #FFB002 0%, #FF8802 45%, #FF7402 100%)',
      }}
    >
      <header className="flex items-center gap-2 px-6 py-4">
        <LogoJC size={32} showText textColor="#ffffff" />
      </header>

      <main className="flex justify-center px-4 pb-12">
        <div className="relative w-full max-w-[480px] rounded-2xl bg-white p-6 shadow-xl sm:p-8">
          <BtnCerrarFormulario />

          <span className="inline-block rounded-full bg-brand-amarillo/20 px-3 py-1 text-xs font-semibold text-brand-naranja">
            Completá tu perfil para continuar
          </span>

          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-azul text-lg font-bold text-white">
              {initial}
            </div>
            <div>
              <p className="font-semibold text-zinc-800">{fullName}</p>
              <p className="text-sm text-zinc-500">{user.email}</p>
            </div>
          </div>

          <hr className="my-6 border-zinc-200" />

          <ProfileForm />
        </div>
      </main>
    </div>
  )
}
