export interface TicketCategory {
  id: string
  label: string
  description: string
  /** Nombre del ícono en kebab-case, key del mapa en components/ui/icon.tsx */
  icon: string
}

export const CATEGORIES: TicketCategory[] = [
  { id: 'infraestructura', label: 'Infraestructura', description: 'Calles, baches, luminarias', icon: 'road' },
  { id: 'salud', label: 'Salud', description: 'Centros de salud, turnos', icon: 'heartbeat' },
  { id: 'espacios_publicos', label: 'Espacios públicos', description: 'Plazas, parques', icon: 'trees' },
  { id: 'educacion', label: 'Educación', description: 'Escuelas, becas', icon: 'school' },
  { id: 'social', label: 'Social', description: 'Comedores, asistencia', icon: 'heart-handshake' },
  { id: 'otro', label: 'Otro', description: 'Cualquier otro tema', icon: 'help' },
]

export const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c.label])
)

export const CATEGORY_ICONS: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c.icon])
)

export const TIPO_TRAMITE_LABELS: Record<string, string> = {
  reclamo: 'Reclamo',
  pedido: 'Pedido',
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

export type TicketPriority = 'alta' | 'media' | 'baja'

export const PRIORITY_LABELS: Record<string, string> = {
  alta: 'Alta',
  media: 'Media',
  baja: 'Baja',
}

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
}
