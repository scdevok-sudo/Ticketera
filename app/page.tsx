import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/supabase/auth-cache'
import { NavHeader } from '@/components/shared/nav-header'
import { KpiCard } from '@/components/shared/kpi-card'
import { Icon } from '@/components/ui/icon'
import { getStatsPublicas, type StatsPublicas } from '@/lib/actions/transparencia'
import { CATEGORIES } from '@/lib/constants/tickets'
import joseCorralHero from '@/public/images/jose-corral1.png'

const STATS_VACIAS: StatsPublicas = { total: 0, resueltos: 0, tasaResolucion: 0, promedioDias: 0 }

const PASOS = [
  { icono: 'qrcode', titulo: 'Escaneá el QR', descripcion: 'Apuntá la cámara de tu celular al código QR y accedé al sitio en segundos.' },
  { icono: 'mail', titulo: 'Ingresá con tu mail', descripcion: 'Usá tu cuenta de Google para identificarte de forma segura y simple.' },
  { icono: 'user-check', titulo: 'Completá tus datos', descripcion: 'Registrá tu nombre, DNI y localidad una sola vez.' },
  { icono: 'message-plus', titulo: 'Cargá tu consulta', descripcion: 'Contanos qué necesitás y hacé el seguimiento desde tu celular.' },
]

export default async function Home() {
  const user = await getUser()

  const [stats, profile] = await Promise.all([
    getStatsPublicas().catch(() => STATS_VACIAS),
    user
      ? createClient().then((supabase) =>
          supabase
            .from('profiles')
            .select('full_name, profile_complete')
            .eq('id', user.id)
            .single()
            .then(({ data }) => data)
        )
      : Promise.resolve(null),
  ])

  const userName = profile?.full_name ?? user?.email ?? undefined

  let ctaHref = '/login'
  if (user && profile?.profile_complete) ctaHref = '/ciudadano/nuevo-reclamo'
  else if (user) ctaHref = '/completar-perfil'

  return (
    <div className="min-h-screen bg-[#F5F5F3]">
      {user ? (
        <NavHeader variant="ciudadano" userName={userName} />
      ) : (
        <NavHeader variant="publico" />
      )}

      <section className="relative overflow-hidden">
        <Image
          src="/images/santa-fe-ciudad.jpg"
          alt="Ciudad de Santa Fe"
          fill
          priority
          className="z-0 object-cover"
        />
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              'linear-gradient(150deg, rgba(255,176,2,0.45) 0%, rgba(255,116,2,0.40) 100%)',
          }}
        />

        <div className="relative z-10 mx-auto max-w-[1200px] px-4 py-16 sm:px-6 sm:py-24 lg:py-20">
          <div className="flex flex-col items-center gap-10 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
            <div className="max-w-2xl text-center sm:w-[60%] sm:shrink-0 sm:text-left">
              <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
                Unidos construimos,
              </h1><h1 className="text-3xl font-extrabold text-white sm:text-4xl">
                una Santa Fe al servicio de los santafesinos
              </h1>
              <p className="mx-auto mt-3 max-w-lg text-base text-white/90 sm:mx-0 sm:text-lg">
                Registrá tu consulta o pedido en minutos. Hacé el seguimiento en tiempo real.
              </p>
              <div className="mt-8 flex justify-center sm:justify-start">
                <Link
                  href={ctaHref}
                  className="rounded-lg bg-[#FF7402] px-8 py-4 text-lg font-bold text-white shadow-sm transition-colors hover:bg-[#e66800]"
                >
                  Nueva Consulta
                </Link>
              </div>
            </div>

            <div className="hidden sm:block sm:w-[40%]">
              <Image
                src={joseCorralHero}
                alt="José Corral, Diputado Provincial"
                priority
                className="mx-auto h-auto w-full max-w-sm drop-shadow-2xl"
                style={{
                  maskImage:
                    'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 10%, black 75%, transparent 100%)',
                  WebkitMaskImage:
                    'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 10%, black 75%, transparent 100%)',
                  maskComposite: 'intersect',
                  WebkitMaskComposite: 'source-in',
                }}
              />
            </div>
          </div>
        </div>

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-20"
          style={{ background: 'linear-gradient(to bottom, transparent, #F5F5F3)' }}
        />
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <KpiCard valor={stats.total} label="Consultas recibidas" icono="ticket" />
          <KpiCard valor={stats.resueltos} label="Casos resueltos" icono="check" />
          <KpiCard valor={stats.tasaResolucion} sufijo="%" label="Tasa de resolución" icono="percentage" />
        </div>
      </section>

      <section className="bg-white px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-[1200px]">
          <h2 className="text-center text-2xl font-extrabold text-gray-900">Cuatro pasos y listo</h2>
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {PASOS.map((paso, i) => (
              <div key={paso.titulo} className="text-center">
                <span className="text-3xl font-extrabold text-brand-naranja">{i + 1}</span>
                <div className="mx-auto mt-2 flex h-14 w-14 items-center justify-center rounded-full bg-orange-50">
                  <Icon name={paso.icono} size={24} className="text-brand-naranja" />
                </div>
                <h3 className="mt-4 text-base font-bold text-gray-900">{paso.titulo}</h3>
                <p className="mt-1 text-sm text-gray-500">{paso.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-[1200px]">
          <h2 className="text-center text-2xl font-extrabold text-gray-900">¿Sobre qué podés consultarnos?</h2>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                className="flex items-start gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-50">
                  <Icon name={cat.icon} size={18} className="text-brand-naranja" />
                </span>
                <div>
                  <h3 className="font-bold text-gray-900">{cat.label}</h3>
                  <p className="mt-0.5 text-sm text-gray-500">{cat.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-[1200px] rounded-xl bg-brand-azul px-6 py-12 text-center">
          <h2 className="text-2xl font-extrabold text-white">¿Querés ver cómo gestionamos?</h2>
          <Link
            href="/transparencia"
            className="mt-6 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-brand-azul shadow-sm transition-colors hover:bg-white/90"
          >
            Ver portal de transparencia →
          </Link>
        </div>
      </section>

      <section
        className="px-4 py-16 text-center sm:px-6"
        style={{ background: 'linear-gradient(150deg, #FFB002 0%, #FF8802 45%, #FF7402 100%)' }}
      >
        <h2 className="text-2xl font-extrabold text-white sm:text-3xl">Hacete escuchar</h2>
        <Link
          href="/login"
          className="mt-6 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-brand-naranja shadow-sm transition-colors hover:bg-white/90"
        >
          Registrar mi consulta →
        </Link>
      </section>

      <footer className="bg-brand-azul">
        <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-white/80 md:flex-row">
            <p>© 2026 Unidos Hacemos · Equipo del Diputado José Corral · Santa Fe</p>
            <div className="flex items-center gap-4">
              <a
                href="https://josecorral.com.ar"
                target="_blank"
                rel="noopener noreferrer"
                className="underline transition-colors hover:text-orange-300"
              >
                josecorral.com.ar
              </a>
              <Link href="/ayuda" className="underline transition-colors hover:text-orange-300">
                Ayuda
              </Link>
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-white/50">Desarrollado por SCdev · scdev.com.ar</p>
        </div>
      </footer>
    </div>
  )
}
