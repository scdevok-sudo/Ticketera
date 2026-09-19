/**
 * Traducción del estado interno del ticket al estado que ve el vecino.
 *
 * `resuelto` es un acto interno del equipo: la gestión terminó de su lado, pero
 * el problema puede seguir abierto para el vecino. Por eso el vecino nunca ve
 * ese estado — para él el caso sigue "En gestión" hasta que el equipo lo cierra
 * formalmente con `cerrado`, que es lo único que dispara el email de cierre.
 *
 * Es la capa de presentación del ciudadano: STATUS_LABELS sigue siendo la fuente
 * de verdad para el equipo.
 */
export function estadoParaCiudadano(status: string): string {
  return status === 'resuelto' ? 'en_gestion' : status
}
