import Link from 'next/link'

interface Props {
  page: number
  total: number
  pageSize: number
  buildHref: (page: number) => string
}

/**
 * Ventana de páginas visibles: siempre la primera y la última, más un bloque
 * de 5 páginas alrededor de la actual (clampeado contra los extremos), con
 * ellipsis donde haya salto.
 *   10 páginas, actual 5  → 1 … 3 4 5 6 7 … 10
 *   10 páginas, actual 1  → 1 2 3 4 5 … 10
 *   10 páginas, actual 10 → 1 … 6 7 8 9 10
 */
export function buildPageWindow(page: number, totalPages: number): (number | 'ellipsis')[] {
  const WINDOW = 5
  if (totalPages <= WINDOW + 2) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const start = Math.min(Math.max(page - 2, 1), totalPages - WINDOW + 1)
  const end = start + WINDOW - 1

  const pages: (number | 'ellipsis')[] = []

  if (start > 1) {
    pages.push(1)
    if (start > 2) pages.push('ellipsis')
  }

  for (let i = start; i <= end; i++) pages.push(i)

  if (end < totalPages) {
    if (end < totalPages - 1) pages.push('ellipsis')
    pages.push(totalPages)
  }

  return pages
}

export function PaginacionEquipo({ page, total, pageSize, buildHref }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)
  const pages = buildPageWindow(page, totalPages)

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-500">
      <span>
        Mostrando {from}–{to} de {total}
      </span>

      <nav aria-label="Paginación" className="flex flex-wrap items-center gap-1">
        <Link
          href={buildHref(Math.max(1, page - 1))}
          aria-disabled={page <= 1}
          aria-label="Página anterior"
          className={`flex h-9 min-w-9 items-center justify-center rounded-lg border border-gray-300 bg-white px-2 text-gray-700 ${
            page <= 1 ? 'pointer-events-none opacity-40' : 'hover:bg-gray-100'
          }`}
        >
          ←
        </Link>

        {pages.map((p, i) =>
          p === 'ellipsis' ? (
            <span
              key={`ellipsis-${i}`}
              aria-hidden="true"
              className="flex h-9 min-w-9 items-center justify-center px-1 text-gray-400"
            >
              …
            </span>
          ) : p === page ? (
            <span
              key={p}
              aria-current="page"
              className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-brand-naranja px-2 font-semibold text-white"
            >
              {p}
            </span>
          ) : (
            <Link
              key={p}
              href={buildHref(p)}
              aria-label={`Página ${p}`}
              className="flex h-9 min-w-9 items-center justify-center rounded-lg px-2 font-medium text-gray-700 hover:bg-gray-100"
            >
              {p}
            </Link>
          )
        )}

        <Link
          href={buildHref(Math.min(totalPages, page + 1))}
          aria-disabled={page >= totalPages}
          aria-label="Página siguiente"
          className={`flex h-9 min-w-9 items-center justify-center rounded-lg border border-gray-300 bg-white px-2 text-gray-700 ${
            page >= totalPages ? 'pointer-events-none opacity-40' : 'hover:bg-gray-100'
          }`}
        >
          →
        </Link>
      </nav>
    </div>
  )
}
