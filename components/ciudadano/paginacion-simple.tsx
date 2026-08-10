import Link from 'next/link'

interface Props {
  page: number
  total: number
  pageSize: number
  buildHref: (page: number) => string
}

export function PaginacionSimple({ page, total, pageSize, buildHref }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  return (
    <div className="flex items-center justify-end gap-3 mt-2">
      <span className="text-sm text-gray-500">
        {from}–{to} de {total}
      </span>
      <Link
        href={buildHref(Math.max(1, page - 1))}
        aria-disabled={page <= 1}
        aria-label="Página anterior"
        className={`flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 ${
          page <= 1 ? 'pointer-events-none opacity-40' : 'hover:bg-gray-50'
        }`}
      >
        ‹
      </Link>
      <Link
        href={buildHref(Math.min(totalPages, page + 1))}
        aria-disabled={page >= totalPages}
        aria-label="Página siguiente"
        className={`flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 ${
          page >= totalPages ? 'pointer-events-none opacity-40' : 'hover:bg-gray-50'
        }`}
      >
        ›
      </Link>
    </div>
  )
}
