import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getUser, getTeamMember } from '@/lib/supabase/auth-cache'
import { LogoJC } from '@/components/ui/logo-jc'
import { GoogleLoginButton } from './google-login-button'

export default async function LoginPage() {
  const user = await getUser()

  if (user) {
    const teamMember = await getTeamMember()
    redirect(teamMember ? '/equipo' : '/ciudadano')
  }

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-4 py-12"
      style={{
        background: 'linear-gradient(150deg, #FFB002 0%, #FF8802 45%, #FF7402 100%)',
      }}
    >
      <div className="w-full max-w-sm rounded-2xl bg-white/95 p-8 text-center shadow-xl">
        <div className="flex justify-center">
          <LogoJC size={72} />
        </div>

        <h1 className="mt-4 text-2xl font-extrabold text-brand-azul">Unidos Hacemos</h1>
        <p className="mt-1 text-sm text-zinc-500">
          José Corral · Diputado Provincial · Santa Fe
        </p>

        <hr className="my-6 border-zinc-200" />

        <h2 className="text-lg font-bold text-zinc-800">Bienvenido</h2>
        <p className="mt-2 text-sm text-zinc-600">
          Registrá tu reclamo, pedido o consulta. Tu voz llega directo al equipo del diputado.
        </p>

        <div className="mt-6">
          <GoogleLoginButton />
        </div>

        <p className="mt-4 text-xs text-zinc-400">
          Es gratis · Solo necesitás una cuenta de Gmail
        </p>

        <Link
          href="/transparencia"
          className="mt-6 inline-block text-sm font-medium text-brand-naranja hover:underline"
        >
          Ver portal de transparencia →
        </Link>
      </div>
    </div>
  )
}
