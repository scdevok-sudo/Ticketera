export default function Loading() {
  return (
    <div className="min-h-screen bg-equipo-bg">
      <div className="fixed inset-y-0 left-0 hidden w-60 bg-brand-azul md:block" />

      <div className="flex flex-col md:pl-60">
        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-4 pl-16 md:px-8 md:pl-8">
          <div>
            <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
            <div className="mt-2 h-3 w-24 animate-pulse rounded bg-gray-200" />
          </div>
        </div>

        <main className="flex-1 p-4 md:p-8">
          <div className="mb-4 h-6 w-40 animate-pulse rounded bg-gray-200" />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-lg bg-gray-200" />
            ))}
          </div>

          <div className="mt-6 rounded-lg bg-white p-5 shadow-sm">
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 animate-pulse rounded bg-gray-100" />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
