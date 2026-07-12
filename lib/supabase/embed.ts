/**
 * Sin un tipo `Database` tipado en `createClient()`, supabase-js infiere los
 * embeds anidados (relaciones FK) siempre como array, aunque en runtime una
 * relación "belongs-to" (FK hacia adelante) siempre devuelve un solo objeto.
 * Esta función normaliza ambos casos.
 */
export function unwrapEmbed<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null
  return value ?? null
}
