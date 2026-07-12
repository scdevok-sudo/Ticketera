export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F5F5F3]">
      <div className="h-12 bg-brand-naranja sm:h-14" />

      <div className="mx-auto w-full max-w-2xl px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="h-6 w-32 animate-pulse rounded bg-gray-200" />
          <div className="h-9 w-32 animate-pulse rounded-lg bg-gray-200" />
        </div>

        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg border-l-4 border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-gray-200" />
              <div className="min-w-0 flex-1">
                <div className="mb-2 h-4 w-16 animate-pulse rounded-full bg-gray-200" />
                <div className="mb-1.5 h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
