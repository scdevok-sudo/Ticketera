'use client'

import { useActionState, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { createTicket, type TicketFormState } from '@/lib/actions/tickets'
import { CATEGORIES, CATEGORY_ICONS, CATEGORY_LABELS, TIPO_TRAMITE_LABELS } from '@/lib/constants/tickets'
import { LOCALIDADES } from '@/lib/constants/localidades'
import { StepIndicator } from '@/components/ciudadano/step-indicator'
import { LocalidadSelect } from '@/components/ciudadano/localidad-select'
import { Icon } from '@/components/ui/icon'

type TipoTramite = 'reclamo' | 'pedido' | 'pregunta'

const TIPOS: TipoTramite[] = ['reclamo', 'pedido', 'pregunta']
const initialState: TicketFormState = {}

// Devuelve false en el render de SSR/hidratación y true una vez montado en el
// cliente, sin el patrón useEffect+setState que dispara cascading renders.
function subscribeNoop() {
  return () => {}
}
function getClientSnapshot() {
  return true
}
function getServerSnapshot() {
  return false
}

export function NuevoReclamoForm() {
  const [state, formAction, isPending] = useActionState(createTicket, initialState)
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [category, setCategory] = useState('')
  const [type, setType] = useState<TipoTramite | ''>('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [localidad, setLocalidad] = useState('')
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [photoName, setPhotoName] = useState<string | null>(null)
  const [photoError, setPhotoError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const mounted = useSyncExternalStore(subscribeNoop, getClientSnapshot, getServerSnapshot)

  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview)
    }
  }, [photoPreview])

  useEffect(() => {
    const form = formRef.current
    if (!form) return

    // Al submitear, forzamos que "photo" sea el File real leído directamente del
    // input (no una reconstrucción), evitando que llegue al server un Blob vacío.
    function handleFormData(e: FormDataEvent) {
      const file = fileInputRef.current?.files?.[0]
      if (file && file.size > 0) {
        e.formData.set('photo', file, file.name)
      } else {
        e.formData.delete('photo')
      }
    }

    form.addEventListener('formdata', handleFormData)
    return () => form.removeEventListener('formdata', handleFormData)
  }, [])

  // Gateado por "mounted" para que el disabled del SSR y el primer render del
  // cliente coincidan siempre (false) y no genere un error de hidratación.
  const step1Valid = mounted && category !== '' && type !== ''
  const step2Valid =
    mounted &&
    title.trim().length >= 5 &&
    description.trim().length >= 10 &&
    localidad.trim().length >= 2

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const allowed = ['image/jpeg', 'image/png']
    if (!allowed.includes(file.type)) {
      setPhotoError('Solo se aceptan imágenes JPG o PNG')
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('El archivo no puede superar los 5MB')
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    setPhotoError(null)
    if (photoPreview) URL.revokeObjectURL(photoPreview)
    setPhotoPreview(URL.createObjectURL(file))
    setPhotoName(file.name)
  }

  function removePhoto() {
    if (photoPreview) URL.revokeObjectURL(photoPreview)
    setPhotoPreview(null)
    setPhotoName(null)
    setPhotoError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <form ref={formRef} action={formAction}>
      {/* Seleccionados con botones, no con inputs nativos: van como hidden para viajar en el FormData */}
      <input type="hidden" name="category" value={category} />
      <input type="hidden" name="type" value={type} />

      <h1 className="pt-4 text-center text-lg font-bold text-zinc-800">Registrar consulta</h1>
      <StepIndicator currentStep={step} />

      {state.error && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.error}</p>
      )}

      {/* Los 3 pasos quedan siempre montados (solo se ocultan con CSS) para que sus campos
          viajen en el FormData del <form> al hacer submit en el paso 3. */}
      <div className={step === 1 ? 'space-y-6' : 'hidden'}>
        <div>
          <h2 className="mb-3 text-base font-bold text-zinc-800">¿De qué tema es tu consulta?</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`flex flex-col items-center gap-1.5 rounded-lg border p-3 text-center transition-colors ${
                  category === cat.id
                    ? 'border-brand-naranja bg-orange-50'
                    : 'border-zinc-200 bg-white hover:border-zinc-300'
                }`}
              >
                <Icon name={cat.icon} size={24} className="text-brand-naranja" />
                <span className="text-sm font-semibold text-zinc-800">{cat.label}</span>
                <span className="text-xs text-zinc-500">{cat.description}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-base font-bold text-zinc-800">¿Qué tipo de trámite es?</h2>
          <div className="grid grid-cols-3 gap-2">
            {TIPOS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`rounded-lg border px-3 py-2.5 text-sm font-semibold transition-colors ${
                  type === t
                    ? 'border-brand-naranja bg-orange-50 text-brand-naranja'
                    : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300'
                }`}
              >
                {TIPO_TRAMITE_LABELS[t]}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          disabled={!step1Valid}
          onClick={() => setStep(2)}
          className="w-full rounded-lg bg-brand-naranja px-5 py-3 font-semibold text-white transition-colors hover:bg-[#e66800] disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500"
        >
          Continuar
        </button>
      </div>

      <div className={step === 2 ? 'space-y-5' : 'hidden'}>
        <h2 className="text-base font-bold text-zinc-800">Contanos qué pasó</h2>

        <div>
          <div className="flex items-baseline justify-between">
            <label htmlFor="title" className="block text-sm font-medium text-[#1a1a1a]">
              Título breve
            </label>
            <span className="text-xs text-zinc-400">{title.length}/200</span>
          </div>
          <input
            id="title"
            name="title"
            value={title}
            maxLength={200}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej: Bache en la esquina de San Martín y Rivadavia"
            className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-base text-[#1a1a1a] placeholder:text-[#9CA3AF] focus:border-brand-naranja focus:outline-none focus:ring-1 focus:ring-brand-naranja"
          />
        </div>

        <div>
          <div className="flex items-baseline justify-between">
            <label htmlFor="description" className="block text-sm font-medium text-[#1a1a1a]">
              Contanos qué pasa, dónde y cómo te gustaría que te ayudemos
            </label>
            <span className="text-xs text-zinc-400">{description.length}/2000</span>
          </div>
          <textarea
            id="description"
            name="description"
            value={description}
            maxLength={2000}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="mt-1 w-full resize-none rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-base text-[#1a1a1a] placeholder:text-[#9CA3AF] focus:border-brand-naranja focus:outline-none focus:ring-1 focus:ring-brand-naranja"
          />
        </div>

        <div>
          <label htmlFor="localidad" className="block text-sm font-medium text-[#1a1a1a]">
            Localidad del problema
          </label>
          <div className="mt-1">
            <LocalidadSelect
              id="localidad"
              name="localidad"
              value={localidad}
              onChange={setLocalidad}
              options={LOCALIDADES}
              placeholder="Buscar localidad o departamento…"
            />
          </div>
        </div>

        <div>
          <span className="block text-sm font-medium text-[#1a1a1a]">Adjuntar foto (opcional)</span>
          <div className={photoPreview ? '' : 'hidden'}>
            <div className="mt-1.5 flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-3">
              {photoPreview && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photoPreview}
                  alt="Vista previa de la foto adjunta"
                  className="h-16 w-16 rounded-md object-cover"
                />
              )}
              <div className="min-w-0 flex-1 text-sm text-zinc-600">{photoName}</div>
              <button
                type="button"
                onClick={removePhoto}
                className="shrink-0 text-sm font-medium text-red-600"
              >
                Quitar
              </button>
            </div>
          </div>
          <label
            className={`mt-1.5 flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border border-dashed border-zinc-300 bg-white px-3 py-6 text-center hover:border-brand-naranja ${
              photoPreview ? 'hidden' : ''
            }`}
          >
            <Icon name="camera" size={24} className="text-brand-naranja" />
            <span className="text-sm font-medium text-zinc-600">
              Adjuntar foto (opcional) · JPG o PNG, hasta 5MB
            </span>
            <input
              ref={fileInputRef}
              type="file"
              name="photo"
              accept="image/jpeg,image/png"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </label>
          {photoError && <p className="mt-1 text-xs text-red-600">{photoError}</p>}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="flex-1 rounded-lg border border-zinc-300 px-5 py-3 font-semibold text-zinc-600 transition-colors hover:bg-zinc-50"
          >
            Atrás
          </button>
          <button
            type="button"
            disabled={!step2Valid}
            onClick={() => setStep(3)}
            className="flex-1 rounded-lg bg-brand-naranja px-5 py-3 font-semibold text-white transition-colors hover:bg-[#e66800] disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500"
          >
            Continuar
          </button>
        </div>
      </div>

      <div className={step === 3 ? 'space-y-5' : 'hidden'}>
        <h2 className="text-base font-bold text-zinc-800">Confirmación antes de enviar</h2>

        <div className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4">
          <div className="flex items-center gap-2">
            {category && <Icon name={CATEGORY_ICONS[category]} size={20} className="text-brand-naranja" />}
            <span className="text-sm font-semibold text-zinc-800">{CATEGORY_LABELS[category]}</span>
            <span className="ml-auto rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-brand-naranja">
              {type && TIPO_TRAMITE_LABELS[type]}
            </span>
          </div>
          <div>
            <p className="text-xs font-medium text-zinc-500">Título</p>
            <p className="text-sm text-zinc-800">{title}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-zinc-500">Descripción</p>
            <p className="whitespace-pre-line text-sm text-zinc-800">{description}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-zinc-500">Localidad</p>
            <p className="text-sm text-zinc-800">{localidad}</p>
          </div>
          {photoPreview && (
            <div>
              <p className="mb-1.5 text-xs font-medium text-zinc-500">Foto adjunta</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoPreview}
                alt="Vista previa de la foto adjunta"
                className="max-h-48 w-full rounded-md object-cover"
              />
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            disabled={isPending}
            onClick={() => setStep(1)}
            className="flex-1 rounded-lg border border-zinc-300 px-5 py-3 font-semibold text-zinc-600 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Editar
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-brand-naranja px-5 py-3 font-semibold text-white transition-colors hover:bg-[#e66800] disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500"
          >
            {isPending && <Spinner />}
            {isPending ? 'Enviando…' : 'Enviar consulta'}
          </button>
        </div>
      </div>
    </form>
  )
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z" />
    </svg>
  )
}
