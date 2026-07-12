export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F5F5F3]">
      <div className="h-12 bg-brand-naranja sm:h-14" />

      <div
        className="px-4 py-16 text-center sm:px-6 sm:py-24"
        style={{ background: 'linear-gradient(150deg, #FFB002 0%, #FF8802 45%, #FF7402 100%)' }}
      >
        <div className="mx-auto h-9 w-72 max-w-full animate-pulse rounded bg-white/30" />
        <div className="mx-auto mt-4 h-5 w-80 max-w-full animate-pulse rounded bg-white/20" />
        <div className="mx-auto mt-8 h-12 w-48 animate-pulse rounded-lg bg-white/40" />
      </div>

      <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-gray-200" />
          ))}
        </div>
      </div>

      <div className="bg-white px-4 py-14 sm:px-6">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <div className="h-14 w-14 animate-pulse rounded-full bg-gray-200" />
              <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 py-14 sm:px-6">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-gray-200" />
          ))}
        </div>
      </div>

      <div className="px-4 py-14 sm:px-6">
        <div className="mx-auto h-40 max-w-[1200px] animate-pulse rounded-xl bg-gray-200" />
      </div>

      <div className="px-4 py-16 sm:px-6">
        <div className="mx-auto h-32 max-w-[1200px] animate-pulse rounded-xl bg-gray-200" />
      </div>

      <div className="h-20 bg-brand-azul" />
    </div>
  )
}
