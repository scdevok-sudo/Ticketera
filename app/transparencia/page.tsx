import Link from 'next/link'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/supabase/auth-cache'
import { NavHeader } from '@/components/shared/nav-header'
import { KpiCard } from '@/components/shared/kpi-card'
import { GraficoCategorias } from '@/components/transparencia/grafico-categorias'
import { GraficoEstados } from '@/components/transparencia/grafico-estados'
import { GraficoEvolucion } from '@/components/transparencia/grafico-evolucion'
import { CasoResueltoCard } from '@/components/transparencia/caso-resuelto-card'
import { SkeletonCard } from '@/components/transparencia/skeleton-card'
import {
  getStatsPublicas,
  getTicketsPorCategoria,
  getTicketsPorEstado,
  getEvolucionMensual,
  getUltimosCasosResueltos,
} from '@/lib/actions/transparencia'

async function StatsSection() {
  const stats = await getStatsPublicas()

  return (
    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard valor={stats.total} label="Total de consultas recibidas" icono="ticket" />
      <KpiCard valor={stats.resueltos} label="Casos resueltos" icono="check" />
      <KpiCard valor={stats.tasaResolucion} sufijo="%" label="Tasa de resolución" icono="percentage" />
      <KpiCard
        valor={stats.promedioDias > 0 ? stats.promedioDias : '—'}
        sufijo={stats.promedioDias > 0 ? ' días' : ''}
        label="Tiempo promedio de resolución"
        icono="clock"
      />
    </div>
  )
}

function StatsSkeleton() {
  return (
    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonCard key={i} height={96} />
      ))}
    </div>
  )
}

async function CategoriasSection() {
  const porCategoria = await getTicketsPorCategoria()
  return <GraficoCategorias datos={porCategoria} />
}

async function EstadosSection() {
  const porEstado = await getTicketsPorEstado()
  return <GraficoEstados datos={porEstado} />
}

async function EvolucionSection() {
  const evolucion = await getEvolucionMensual()
  return <GraficoEvolucion datos={evolucion} />
}

async function UltimosCasosSection() {
  const ultimosCasos = await getUltimosCasosResueltos()

  if (ultimosCasos.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-gray-400">
        Todavía no hay datos públicos disponibles.
      </p>
    )
  }

  return (
    <>
      {ultimosCasos.map((caso) => (
        <CasoResueltoCard key={caso.id} caso={caso} />
      ))}
    </>
  )
}

function ListaSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonCard key={i} height={56} />
      ))}
    </div>
  )
}

export default async function TransparenciaPage() {
  const supabase = await createClient()
  const user = await getUser()

  let userName: string | undefined
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single()
    userName = profile?.full_name ?? user.email ?? undefined
  }

  return (
    <div className="min-h-screen bg-[#F5F5F3]">
      {user ? (
        <NavHeader variant="ciudadano" activeTab="transparencia" userName={userName} />
      ) : (
        <NavHeader variant="publico" activeTab="transparencia" />
      )}

      <main className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6">
        <section>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl font-extrabold text-gray-900">Transparencia en tiempo real</h1>
            <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-brand-naranja">
              Acceso público · Sin registro requerido
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Estadísticas públicas de consultas y pedidos gestionados por el equipo del diputado.
          </p>

          <Suspense fallback={<StatsSkeleton />}>
            <StatsSection />
          </Suspense>
        </section>

        <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-bold text-gray-900">Consultas por categoría</h2>
            <Suspense fallback={<SkeletonCard height={240} />}>
              <CategoriasSection />
            </Suspense>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-bold text-gray-900">Estado de las consultas</h2>
            <Suspense fallback={<SkeletonCard height={240} />}>
              <EstadosSection />
            </Suspense>
          </div>
        </section>

        <section className="mt-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-bold text-gray-900">Evolución de consultas — últimos 6 meses</h2>
          <Suspense fallback={<SkeletonCard height={260} />}>
            <EvolucionSection />
          </Suspense>
        </section>

        <section className="mt-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-bold text-gray-900">Últimos casos resueltos</h2>
          <p className="mt-0.5 text-xs text-gray-400">Sin datos personales — solo información del trámite</p>

          <div className="mt-3">
            <Suspense fallback={<ListaSkeleton />}>
              <UltimosCasosSection />
            </Suspense>
          </div>
        </section>

        <section
          className="mt-6 rounded-xl px-6 py-10 text-center"
          style={{ background: 'linear-gradient(150deg, #FFB002 0%, #FF8802 45%, #FF7402 100%)' }}
        >
          <h2 className="text-xl font-extrabold text-white">¿Tenés una consulta?</h2>
          <p className="mt-1 text-sm text-white/90">
            Registrala en minutos y hacé el seguimiento en tiempo real
          </p>
          <Link
            href="/login"
            className="mt-5 inline-block rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-brand-naranja shadow-sm hover:bg-white/90"
          >
            Registrar mi consulta →
          </Link>
        </section>
      </main>

      <footer className="bg-brand-azul">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-2 px-4 py-6 text-center text-xs text-white/80 sm:px-6">
          <p>Unidos Hacemos · José Corral · Diputado Provincial · Santa Fe · 2026</p>
          <div className="flex gap-4">
            <span>Privacidad</span>
            <span>Ley 25.326</span>
          </div>
          <p className="text-white/50">Desarrollado por SCdev · scdev.com.ar</p>
        </div>
      </footer>
    </div>
  )
}
