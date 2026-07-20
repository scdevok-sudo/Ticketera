import Link from 'next/link'
import { getConsultasPublicas } from '@/lib/actions/tickets'
import { ConsultasVecinosLista } from '@/components/ciudadano/consultas-vecinos-lista'
import { Icon } from '@/components/ui/icon'

interface Props {
  searchParams: Promise<{ page?: string }>
}

const PAGE_SIZE = 20

export default async function ConsultasVecinosPage({ searchParams }: Props) {
  const params = await searchParams
  const page = params.page ? parseInt(params.page, 10) : 1
  const { consultas, total } = await getConsultasPublicas(page, PAGE_SIZE)
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
          <Icon name="users" size={20} className="text-brand-naranja" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Consultas de vecinos</h1>
          <p className="text-sm text-gray-500">
            {total} consulta{total !== 1 ? 's' : ''} pública{total !== 1 ? 's' : ''} · Apoyá las que te representan
          </p>
        </div>
      </div>

      {consultas.length === 0 ? (
        <div className="rounded-xl border border-gray-100 bg-white p-12 text-center">
          <p className="text-gray-400">Todavía no hay consultas públicas de otros vecinos.</p>
        </div>
      ) : (
        <>
          <ConsultasVecinosLista consultas={consultas} />

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
              <span>
                Mostrando {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} de {total}
              </span>
              <div className="flex gap-2">
                <Link
                  href={`?page=${Math.max(1, page - 1)}`}
                  aria-disabled={page <= 1}
                  className={`rounded-lg border border-gray-200 px-3 py-1.5 ${
                    page <= 1 ? 'pointer-events-none opacity-40' : 'hover:bg-gray-50'
                  }`}
                >
                  ← Anterior
                </Link>
                <Link
                  href={`?page=${Math.min(totalPages, page + 1)}`}
                  aria-disabled={page >= totalPages}
                  className={`rounded-lg border border-gray-200 px-3 py-1.5 ${
                    page >= totalPages ? 'pointer-events-none opacity-40' : 'hover:bg-gray-50'
                  }`}
                >
                  Siguiente →
                </Link>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
