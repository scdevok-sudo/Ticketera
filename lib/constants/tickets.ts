export interface TicketCategory {
  id: string
  label: string
  description: string
  /** Nombre del ícono en kebab-case, key del mapa en components/ui/icon.tsx */
  icon: string
}

// Categorías del folleto de difusión "díptico JC V3" — lista definitiva.
export const CATEGORIES: TicketCategory[] = [
  { id: 'calles_luminarias_plazas', label: 'Calles, luminarias y plazas', description: 'Baches, alumbrado, plazas y espacios verdes', icon: 'road' },
  { id: 'vivienda_escrituras', label: 'Vivienda y escrituras', description: 'Acceso a la vivienda y regularización dominial', icon: 'home' },
  { id: 'clubes_asociaciones_instituciones', label: 'Clubes, asociaciones e instituciones', description: 'Clubes de barrio, ONG y entidades civiles', icon: 'users' },
  { id: 'educacion_salud_asistencia', label: 'Educación, salud y asistencia social', description: 'Escuelas, centros de salud y asistencia social', icon: 'school' },
  { id: 'infraestructura_obras', label: 'Infraestructura y obras', description: 'Obras públicas y equipamiento urbano', icon: 'tools' },
  { id: 'luz_agua_cloacas', label: 'Luz, agua potable y cloacas', description: 'Servicios de luz, agua potable y cloacas', icon: 'droplet' },
  { id: 'movilidad_transporte', label: 'Movilidad y transporte', description: 'Transporte público, tránsito y conectividad', icon: 'bus' },
  { id: 'consultas_legislativas', label: 'Consultas e iniciativas legislativas', description: 'Proyectos de ley, iniciativas y consultas', icon: 'clipboard-list' },
]

export const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c.label])
)

export const CATEGORY_ICONS: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c.icon])
)

export const TIPO_TRAMITE_LABELS: Record<string, string> = {
  reclamo: 'Consulta',
  pedido: 'Pedido',
  // Se mantiene el label para tickets históricos con este tipo, aunque ya no se ofrece en el formulario.
  pregunta: 'Pregunta',
}

export const TICKET_STAGES = [
  { key: 'nuevo', label: 'Consulta recibida' },
  { key: 'en_revision', label: 'En revisión' },
  { key: 'derivado', label: 'Derivado al área correspondiente' },
  { key: 'en_gestion', label: 'En gestión' },
  { key: 'requiere_info', label: 'Requiere más información' },
  { key: 'resuelto', label: 'Resuelto' },
] as const

export const STATUS_LABELS: Record<string, string> = {
  nuevo: 'Nuevo',
  en_revision: 'En revisión',
  derivado: 'Derivado',
  en_gestion: 'En gestión',
  requiere_info: 'Requiere más información',
  resuelto: 'Resuelto',
}

export const STATUS_BADGE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  nuevo: { bg: '#FFF8F2', text: '#C55A00', border: '#FFE4C4' },
  en_revision: { bg: '#E6F1FB', text: '#0C447C', border: '#BFDBFE' },
  derivado: { bg: '#EEEDFE', text: '#3C3489', border: '#DDD6FE' },
  en_gestion: { bg: '#E6F1FB', text: '#2D3077', border: '#BFDBFE' },
  requiere_info: { bg: '#FEE2E2', text: '#991B1B', border: '#FECACA' },
  resuelto: { bg: '#E7F6EF', text: '#1A6B40', border: '#BBF7D0' },
}

export const STATUS_BORDER_COLORS: Record<string, string> = {
  nuevo: '#FF7402',
  en_revision: '#0C447C',
  derivado: '#3C3489',
  en_gestion: '#2D3077',
  requiere_info: '#DC2626',
  resuelto: '#1A6B40',
}

// Paleta del dashboard de equipo (Tailwind utility classes, distinta de la del ciudadano)
export const EQUIPO_STATUS_BADGE_CLASSES: Record<string, string> = {
  nuevo: 'bg-blue-100 text-blue-800',
  en_revision: 'bg-yellow-100 text-yellow-800',
  derivado: 'bg-purple-100 text-purple-800',
  en_gestion: 'bg-orange-100 text-orange-800',
  requiere_info: 'bg-red-100 text-red-800',
  resuelto: 'bg-green-100 text-green-800',
}

// Orden de atención del listado del equipo: primero lo que requiere acción,
// último lo ya cerrado. Los estados son los valores de DB, no los labels.
export const ESTADO_ORDER: Record<string, number> = {
  nuevo: 0,
  en_revision: 1,
  en_gestion: 2,
  derivado: 3,
  requiere_info: 4,
  resuelto: 5,
}

export type TicketPriority = 'alta' | 'media' | 'baja'

export const PRIORITY_LABELS: Record<string, string> = {
  alta: 'Alta',
  media: 'Media',
  baja: 'Baja',
}

// Desempate dentro de un mismo estado.
export const PRIORITY_ORDER: Record<string, number> = { alta: 0, media: 1, baja: 2 }

export const PRIORITY_BADGE_CLASSES: Record<string, string> = {
  alta: 'bg-red-100 text-red-800',
  media: 'bg-yellow-100 text-yellow-800',
  baja: 'bg-gray-100 text-gray-700',
}

// Colores en hex para los gráficos de Recharts (Tailwind classes no sirven como fill)
export const STATUS_CHART_COLORS: Record<string, string> = {
  nuevo: '#3B82F6',
  en_revision: '#F59E0B',
  derivado: '#A855F7',
  en_gestion: '#F97316',
  requiere_info: '#EF4444',
  resuelto: '#22C55E',
}

export const EVENT_TYPE_LABELS: Record<string, string> = {
  status_change: 'Cambio de estado',
  internal_note: 'Nota interna',
  response: 'Respuesta al ciudadano',
  assignment: 'Asignación',
  priority_change: 'Cambio de prioridad',
}

// Colores de fondo suave por categoría — para cards ciudadano (grilla mis-consultas / consultas de vecinos)
export const CATEGORIA_BG: Record<string, string> = {
  calles_luminarias_plazas: '#FFF3E8', // naranja muy suave
  vivienda_escrituras: '#FDF3E3', // ámbar muy suave
  clubes_asociaciones_instituciones: '#F2EDFB', // violeta muy suave
  educacion_salud_asistencia: '#EDF7F0', // verde muy suave
  infraestructura_obras: '#E9F5F3', // verde azulado muy suave
  luz_agua_cloacas: '#EBF3FC', // azul muy suave
  movilidad_transporte: '#FEF0F0', // rojo/rosa muy suave
  consultas_legislativas: '#EEEDFE', // azul marca muy suave
}

// Color de ícono por categoría (mismo criterio que el fondo, para la card)
export const CATEGORIA_ICON_COLOR: Record<string, string> = {
  calles_luminarias_plazas: '#FF7402',
  vivienda_escrituras: '#b45309',
  clubes_asociaciones_instituciones: '#7c3aed',
  educacion_salud_asistencia: '#16a34a',
  infraestructura_obras: '#0f766e',
  luz_agua_cloacas: '#2563eb',
  movilidad_transporte: '#dc2626',
  consultas_legislativas: '#2D3077',
}
