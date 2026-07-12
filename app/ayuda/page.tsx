import { createClient } from '@/lib/supabase/server'
import { getUser, getTeamMember } from '@/lib/supabase/auth-cache'
import { NavHeader } from '@/components/shared/nav-header'
import { Icon } from '@/components/ui/icon'
import { FaqAccordion } from './faq-accordion'

const CIUDADANO_SECCIONES = [
  {
    icon: 'user-plus',
    titulo: 'Registrarte',
    texto:
      'Ingresá con tu cuenta de Google. Si es tu primera vez, completá tus datos de contacto: nombre, DNI, teléfono y localidad.',
  },
  {
    icon: 'plus',
    titulo: 'Cargar una consulta',
    texto:
      "Hacé clic en 'Nueva consulta' y seguí los 3 pasos. Podés describir el problema, indicar la ubicación y adjuntar una foto opcional.",
  },
  {
    icon: 'timeline',
    titulo: 'Hacer seguimiento',
    texto:
      "Desde 'Mis consultas' podés ver el estado actual de cada caso y el historial completo de novedades del equipo.",
  },
  {
    icon: 'thumb-up',
    titulo: 'Apoyar una consulta',
    texto:
      'Si otro vecino ya cargó el mismo problema, podés apoyar su consulta. Esto ayuda al equipo a priorizar los casos más urgentes.',
  },
]

const EQUIPO_SECCIONES = [
  {
    icon: 'login',
    titulo: 'Ingresar al sistema',
    texto:
      'Ingresá con la cuenta de Gmail que fue registrada en el sistema. Si no podés acceder, contactá al administrador del equipo.',
  },
  {
    icon: 'filter',
    titulo: 'Ver y filtrar consultas',
    texto:
      "Desde 'Consultas' podés ver todos los casos. Usá los filtros de estado, prioridad, área y responsable para encontrar lo que necesitás rápidamente.",
  },
  {
    icon: 'edit',
    titulo: 'Gestionar una consulta',
    texto:
      'Hacé clic en cualquier consulta para ver el detalle completo. Desde ahí podés cambiar el estado, asignarla a un compañero y dejar notas.',
  },
  {
    icon: 'lock',
    titulo: 'Notas internas y respuestas',
    texto:
      'Las notas internas (fondo amarillo) solo las ve el equipo. Las respuestas al ciudadano aparecen en su seguimiento. Usá las plantillas rápidas para agilizar las respuestas más comunes.',
  },
  {
    icon: 'chart-bar',
    titulo: 'KPIs y métricas',
    texto:
      "Desde 'KPIs' podés ver métricas de gestión: volumen de consultas, tiempos de resolución y carga por operador.",
  },
]

const FAQS = [
  { pregunta: '¿Cuánto tarda en responderse?', respuesta: 'Hasta 48 horas hábiles desde la recepción.' },
  { pregunta: '¿Puedo adjuntar fotos?', respuesta: 'Sí, una imagen JPG o PNG de hasta 5MB.' },
  {
    pregunta: '¿Mis datos están protegidos?',
    respuesta:
      'Sí. El sistema cumple con la Ley 25.326 de Protección de Datos Personales. Tus datos se almacenan en servidores en Sudamérica.',
  },
  { pregunta: '¿Puedo cargar más de una consulta?', respuesta: 'Sí, hasta 5 consultas por día.' },
]

const TABLA_ESTADOS = [
  { estado: 'Nuevo', cuando: 'Ingresa al sistema, sin revisar todavía' },
  { estado: 'En revisión', cuando: 'El equipo lo está analizando' },
  { estado: 'Derivado', cuando: 'Se pasó a otra área o persona' },
  { estado: 'En gestión', cuando: 'Se está trabajando activamente' },
  { estado: 'Requiere más información', cuando: 'Se necesita que el ciudadano aclare algo' },
  { estado: 'Resuelto', cuando: 'El caso fue cerrado con respuesta' },
]

export default async function AyudaPage() {
  const supabase = await createClient()
  const [user, teamMember] = await Promise.all([getUser(), getTeamMember()])

  let userName: string | undefined
  const isTeamMember = !!teamMember
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single()
    userName = profile?.full_name ?? user.email ?? undefined
  }

  const secciones = isTeamMember ? EQUIPO_SECCIONES : CIUDADANO_SECCIONES

  return (
    <div className="min-h-screen bg-white">
      {user ? <NavHeader variant="ciudadano" userName={userName} /> : <NavHeader variant="publico" />}

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-extrabold text-gray-900">
          {isTeamMember ? 'Panel de ayuda — Equipo interno' : '¿Cómo usar Unidos Hacemos?'}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {isTeamMember
            ? 'Guía de uso del dashboard de Unidos Hacemos'
            : 'Guía rápida para vecinos de Santa Fe'}
        </p>

        <div className="mt-8 space-y-6">
          {secciones.map((seccion) => (
            <div key={seccion.titulo} className="flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-50">
                <Icon name={seccion.icon} size={20} className="text-brand-naranja" />
              </span>
              <div>
                <h2 className="font-semibold text-gray-900">{seccion.titulo}</h2>
                <p className="mt-0.5 text-sm text-gray-500">{seccion.texto}</p>
              </div>
            </div>
          ))}
        </div>

        {isTeamMember ? (
          <div className="mt-10">
            <h2 className="mb-3 text-base font-bold text-gray-900">Estados de una consulta</h2>
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-4 py-2 font-medium">Estado</th>
                    <th className="px-4 py-2 font-medium">Cuándo usarlo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {TABLA_ESTADOS.map((row) => (
                    <tr key={row.estado}>
                      <td className="px-4 py-2 font-medium text-gray-900">{row.estado}</td>
                      <td className="px-4 py-2 text-gray-600">{row.cuando}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="mt-10">
            <h2 className="mb-3 text-base font-bold text-gray-900">Preguntas frecuentes</h2>
            <FaqAccordion faqs={FAQS} />
          </div>
        )}
      </main>
    </div>
  )
}
