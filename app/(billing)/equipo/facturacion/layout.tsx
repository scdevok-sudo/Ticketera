export default function FacturacionLayout({ children }: { children: React.ReactNode }) {
  // data-billing-panel: globals.css oculta el velo mientras este panel está en pantalla.
  return (
    <div data-billing-panel className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-2xl">{children}</div>
    </div>
  )
}
