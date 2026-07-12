export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F5F5F3]">
      <div className="h-12 bg-brand-naranja sm:h-14" />

      <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6">
        <div className="mb-2 h-8 w-64 animate-pulse rounded bg-gray-200" />
        <div className="mb-8 h-4 w-96 max-w-full animate-pulse rounded bg-gray-200" />

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-gray-200" />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="h-64 animate-pulse rounded-xl bg-gray-200" />
          <div className="h-64 animate-pulse rounded-xl bg-gray-200" />
        </div>
      </div>
    </div>
  )
}
