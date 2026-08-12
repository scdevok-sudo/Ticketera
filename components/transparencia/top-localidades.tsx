interface TopLocalidadesProps {
  datos: { localidad: string; total: number }[]
}

export function TopLocalidades({ datos }: TopLocalidadesProps) {
  if (datos.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-gray-400">
        Todavía no hay datos públicos disponibles.
      </p>
    )
  }

  const max = datos[0].total

  return (
    <div className="space-y-3">
      {datos.map((item, index) => (
        <div key={item.localidad} className="flex items-center gap-3">
          <span className="w-5 shrink-0 text-right text-sm font-bold text-gray-400">
            {index + 1}
          </span>

          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center justify-between">
              <span className="truncate text-sm font-medium text-gray-700">{item.localidad}</span>
              <span className="ml-2 shrink-0 text-sm font-bold text-brand-naranja">
                {item.total}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-brand-naranja transition-all duration-500"
                style={{ width: `${Math.round((item.total / max) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
