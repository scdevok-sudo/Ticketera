import { getConsultasPublicas } from '@/lib/actions/tickets'
import { ConsultasVecinosLista } from '@/components/ciudadano/consultas-vecinos-lista'
import { PaginacionSimple } from '@/components/ciudadano/paginacion-simple'
import { Icon } from '@/components/ui/icon'

interface Props {
  searchParams: Promise<{ page?: string }>
}

const PAGE_SIZE = 9

export default async function ConsultasVecinosPage({ searchParams }: Props) {
  const params = await searchParams
  const page = params.page ? parseInt(params.page, 10) : 1
  const { consultas, total } = await getConsultasPublicas(page, PAGE_SIZE)

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
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
          <div className="mb-6">
            <ConsultasVecinosLista consultas={consultas} />
          </div>

          {total > PAGE_SIZE && (
            <PaginacionSimple
              page={page}
              total={total}
              pageSize={PAGE_SIZE}
              buildHref={(p) => `?page=${p}`}
            />
          )}
        </>
      )}
    </div>
  )
}
