import { getKPIs } from '@/lib/actions/equipo'
import { KpiCard } from '@/components/equipo/kpi-card'
import { KpiCharts } from '@/components/equipo/kpi-charts'

export default async function KpisPage() {
  const kpis = await getKPIs()

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold text-gray-900">KPIs</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard titulo="Total de tickets" valor={kpis.totalTickets} icono="list-details" color="azul" />
        <KpiCard titulo="Nuevos (sin atender)" valor={kpis.nuevos} icono="alert-circle" color="naranja" />
        <KpiCard titulo="En gestión" valor={kpis.enGestion} icono="tools" color="amarillo" />
        <KpiCard titulo="Resueltos (este mes)" valor={kpis.resueltosEsteMes} icono="circle-check" color="verde" />
        <KpiCard
          titulo="Tiempo promedio de resolución"
          valor={
            kpis.tiempoPromedioResolucionDias !== null
              ? `${kpis.tiempoPromedioResolucionDias.toFixed(1)}d`
              : '—'
          }
          subtitulo="días promedio"
          icono="clock"
          color="azul"
        />
        <KpiCard
          titulo="Alta prioridad sin asignar"
          valor={kpis.altaPrioridadSinAsignar}
          icono="alert-triangle"
          color="rojo"
        />
      </div>

      <div className="mt-6">
        <KpiCharts serieSemanal={kpis.serieSemanal} porEstado={kpis.porEstado} />
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg bg-white shadow-sm">
        <h2 className="px-5 pt-5 text-sm font-bold text-gray-900">Carga por operador</h2>
        <table className="mt-3 w-full min-w-[500px] text-left text-sm">
          <thead className="border-b border-gray-200 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-5 py-3 font-medium">Operador</th>
              <th className="px-5 py-3 font-medium">Tickets activos</th>
              <th className="px-5 py-3 font-medium">Resueltos este mes</th>
              <th className="px-5 py-3 font-medium">% resolución</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {kpis.porOperador.map((op) => (
              <tr key={op.id}>
                <td className="px-5 py-3 text-gray-800">{op.nombre}</td>
                <td className="px-5 py-3 text-gray-700">{op.ticketsActivos}</td>
                <td className="px-5 py-3 text-gray-700">{op.resueltosEsteMes}</td>
                <td className="px-5 py-3 text-gray-700">{op.porcentajeResolucion}%</td>
              </tr>
            ))}
            {kpis.porOperador.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-6 text-center text-gray-400">
                  No hay operadores activos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="h-4" />
      </div>
    </div>
  )
}
