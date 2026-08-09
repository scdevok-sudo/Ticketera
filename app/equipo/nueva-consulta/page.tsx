import { NuevaConsultaForm } from './nueva-consulta-form'

export default function NuevaConsultaPage() {
  return (
    <div>
      <h2 className="mb-1 text-xl font-bold text-gray-900">Nueva consulta</h2>
      <p className="mb-4 text-sm text-gray-500">
        Cargá una consulta en nombre de un vecino que no tiene cuenta de Google (recorridas, atención presencial, etc.).
      </p>
      <NuevaConsultaForm />
    </div>
  )
}
