'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { crearConsultaManual } from '@/lib/actions/equipo'
import type { EquipoActionState } from '@/lib/actions/equipo'
import { CATEGORIES, PRIORITY_LABELS } from '@/lib/constants/tickets'
import { Icon } from '@/components/ui/icon'
import {
  ATTACHMENT_ACCEPT,
  ATTACHMENT_HELP_TEXT,
  isPdf,
  validateAttachment,
} from '@/lib/constants/attachments'

const TIPOS: { value: 'reclamo' | 'pedido'; label: string }[] = [
  { value: 'reclamo', label: 'Consulta' },
  { value: 'pedido', label: 'Pedido' },
]

const initialState: EquipoActionState = {}

const inputClass =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:border-[#FF7402] focus:outline-none focus:ring-1 focus:ring-brand-naranja'

const labelClass = 'mb-1 block text-sm font-medium text-gray-700'

export function NuevaConsultaForm() {
  const [state, formAction, isPending] = useActionState(crearConsultaManual, initialState)
  // filePreview solo existe para imágenes; los PDFs se representan con ícono + nombre.
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [fileIsPdf, setFileIsPdf] = useState(false)
  const [fileError, setFileError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    return () => {
      if (filePreview) URL.revokeObjectURL(filePreview)
    }
  }, [filePreview])

  useEffect(() => {
    const form = formRef.current
    if (!form) return

    // Mismo criterio que el formulario del ciudadano: al submitear forzamos que
    // "photo" sea el File real del input y no una reconstrucción vacía.
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

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const invalid = validateAttachment(file)
    if (invalid) {
      setFileError(invalid)
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    setFileError(null)
    if (filePreview) URL.revokeObjectURL(filePreview)
    setFilePreview(isPdf(file.type) ? null : URL.createObjectURL(file))
    setFileIsPdf(isPdf(file.type))
    setFileName(file.name)
  }

  function removeFile() {
    if (filePreview) URL.revokeObjectURL(filePreview)
    setFilePreview(null)
    setFileIsPdf(false)
    setFileName(null)
    setFileError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.error}</p>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 border-b border-gray-200 pb-3 text-sm font-bold text-gray-900">
          Datos del vecino
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="contact_name" className={labelClass}>
              Nombre completo
            </label>
            <input id="contact_name" name="contact_name" required className={inputClass} />
          </div>

          <div>
            <label htmlFor="contact_email" className={labelClass}>
              Email
            </label>
            <input
              id="contact_email"
              name="contact_email"
              type="email"
              required
              className={inputClass}
              placeholder="Es el que vincula al perfil si el vecino se loguea"
            />
          </div>

          <div>
            <label htmlFor="contact_phone" className={labelClass}>
              Teléfono (opcional)
            </label>
            <input id="contact_phone" name="contact_phone" className={inputClass} />
          </div>

          <div>
            <label htmlFor="contact_dni" className={labelClass}>
              DNI (opcional)
            </label>
            <input id="contact_dni" name="contact_dni" className={inputClass} />
          </div>

          <div>
            <label htmlFor="contact_localidad" className={labelClass}>
              Localidad (opcional)
            </label>
            <input id="contact_localidad" name="contact_localidad" className={inputClass} />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 border-b border-gray-200 pb-3 text-sm font-bold text-gray-900">
          Datos de la consulta
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="type" className={labelClass}>
              Tipo
            </label>
            <select id="type" name="type" required defaultValue="" className={inputClass}>
              <option value="" disabled>
                Seleccionar…
              </option>
              {TIPOS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="category" className={labelClass}>
              Categoría
            </label>
            <select id="category" name="category" required defaultValue="" className={inputClass}>
              <option value="" disabled>
                Seleccionar…
              </option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="area" className={labelClass}>
              Área
            </label>
            <input id="area" name="area" required className={inputClass} />
          </div>

          <div>
            <label htmlFor="priority" className={labelClass}>
              Prioridad
            </label>
            <select id="priority" name="priority" required defaultValue="media" className={inputClass}>
              {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="title" className={labelClass}>
              Título
            </label>
            <input id="title" name="title" required minLength={5} maxLength={200} className={inputClass} />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="description" className={labelClass}>
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              required
              minLength={10}
              maxLength={2000}
              rows={5}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="localidad" className={labelClass}>
              Localidad del problema
            </label>
            <input id="localidad" name="localidad" className={inputClass} />
          </div>

          <div className="sm:col-span-2">
            <span className={labelClass}>Adjuntar archivo (opcional)</span>
            <div className={fileName ? '' : 'hidden'}>
              <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3">
                {filePreview && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={filePreview}
                    alt="Vista previa del archivo adjunto"
                    className="h-16 w-16 rounded-md object-cover"
                  />
                )}
                {fileIsPdf && (
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md bg-red-50">
                    <Icon name="file-type-pdf" size={28} className="text-red-600" />
                  </div>
                )}
                <div className="min-w-0 flex-1 truncate text-sm text-gray-600">{fileName}</div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="shrink-0 text-sm font-medium text-red-600"
                >
                  Quitar
                </button>
              </div>
            </div>
            <label
              className={`flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border border-dashed border-gray-300 bg-white px-3 py-6 text-center hover:border-brand-naranja ${
                fileName ? 'hidden' : ''
              }`}
            >
              <Icon name="camera" size={24} className="text-brand-naranja" />
              <span className="text-sm font-medium text-gray-600">{ATTACHMENT_HELP_TEXT}</span>
              <input
                ref={fileInputRef}
                type="file"
                name="photo"
                accept={ATTACHMENT_ACCEPT}
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            {fileError && <p className="mt-1 text-xs text-red-600">{fileError}</p>}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-[#FF7402] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#e66800] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? 'Registrando…' : 'Registrar consulta'}
        </button>
      </div>
    </form>
  )
}
