import Link from 'next/link'
import { NavHeader } from '@/components/shared/nav-header'

export default function PrivacidadPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <NavHeader variant="publico" />

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-12 sm:px-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Política de Privacidad</h1>
        <p className="mt-1 text-sm text-zinc-500">Última actualización: agosto de 2026</p>

        <p className="mt-6 text-sm leading-relaxed text-zinc-700">
          Unidos Construimos es una plataforma impulsada por el Diputado Provincial José Corral
          para que los vecinos de Santa Fe puedan registrar y hacer seguimiento de sus consultas y
          pedidos.
        </p>

        <section className="mt-8">
          <h2 className="text-base font-bold text-gray-900">1. Responsable del tratamiento</h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-700">
            José Corral — Legislatura de la Provincia de Santa Fe.
            <br />
            Contacto: privacidad@unidosconstruimos.com.ar
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-base font-bold text-gray-900">2. Datos que recopilamos</h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-700">
            Al registrarte, recopilamos: nombre completo, dirección de email (provistos por
            Google), DNI, teléfono, localidad y barrio o departamento. Al enviar una consulta,
            recopilamos el contenido de tu mensaje y, opcionalmente, una foto adjunta.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-base font-bold text-gray-900">3. Para qué usamos tus datos</h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-700">
            Los datos se usan exclusivamente para gestionar tus consultas y pedidos, notificarte
            sobre el estado de tus trámites y mejorar el servicio. No vendemos ni cedemos tus
            datos a terceros.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-base font-bold text-gray-900">4. Dónde almacenamos tus datos</h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-700">
            Tus datos se almacenan en servidores ubicados en São Paulo, Brasil, a través de
            Supabase. El almacenamiento en América del Sur cumple con los estándares de la Ley
            25.326 de Protección de Datos Personales de Argentina.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-base font-bold text-gray-900">5. Tus derechos (ARCO)</h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-700">
            Tenés derecho a acceder, rectificar, actualizar y suprimir tus datos personales en
            cualquier momento. Para ejercer estos derechos:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-zinc-700">
            <li>
              Rectificación y actualización: podés editar tu perfil directamente desde la
              plataforma en la sección &quot;Mi perfil&quot;.
            </li>
            <li>
              Eliminación de cuenta: podés solicitar la eliminación completa de tu cuenta y datos
              desde la sección &quot;Mi perfil&quot; → &quot;Solicitar eliminación de cuenta&quot;.
              La solicitud será procesada dentro de los 5 días hábiles.
            </li>
            <li>Consultas: escribinos a privacidad@unidosconstruimos.com.ar</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-base font-bold text-gray-900">6. Consentimiento</h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-700">
            Al registrarte en la plataforma, aceptaste expresamente el tratamiento de tus datos
            personales. Podés revocar ese consentimiento en cualquier momento solicitando la
            eliminación de tu cuenta.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-base font-bold text-gray-900">7. Cambios en esta política</h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-700">
            Podemos actualizar esta política. Te notificaremos por email ante cambios
            significativos.
          </p>
        </section>
      </main>

      <footer className="border-t border-zinc-100 bg-white">
        <div className="mx-auto max-w-2xl px-4 py-6 text-center sm:px-6">
          <Link href="/" className="text-sm text-zinc-500 underline hover:text-zinc-700">
            Volver al inicio
          </Link>
        </div>
      </footer>
    </div>
  )
}
