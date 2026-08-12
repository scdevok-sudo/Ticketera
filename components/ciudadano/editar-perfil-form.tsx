'use client'

import { useActionState, useRef, useState, useTransition } from 'react'
import { updateProfile, requestAccountDeletion, type ProfileFormState } from '@/lib/actions/profiles'
import { LocalidadSelect } from '@/components/ciudadano/localidad-select'
import { LOCALIDADES_PROVINCIA, getDepartamento } from '@/lib/constants/localidades'

const SEXO_OPTIONS = [
  { value: 'masculino', label: 'Masculino' },
  { value: 'femenino', label: 'Femenino' },
  { value: 'otro', label: 'Otro' },
  { value: 'prefiero_no_decir', label: 'Prefiero no decir' },
]

interface Profile {
  full_name: string | null
  email: string | null
  dni: string | null
  phone: string | null
  localidad: string | null
  localidad_tipo: 'capital' | 'provincia' | null
  barrio: string | null
  departamento: string | null
  sexo: string | null
}

const initialState: ProfileFormState = {}

export function EditarPerfilForm({ profile }: { profile: Profile }) {
  const [state, formAction, isPending] = useActionState(updateProfile, initialState)
  const [dni, setDni] = useState(profile.dni ?? '')
  const [phone, setPhone] = useState(profile.phone ?? '')
  const [localidadTipo, setLocalidadTipo] = useState<'capital' | 'provincia' | ''>(
    profile.localidad_tipo ?? ''
  )
  const [localidad, setLocalidad] = useState(
    profile.localidad_tipo === 'capital' ? profile.barrio ?? '' : profile.localidad ?? ''
  )

  const dialogRef = useRef<HTMLDialogElement>(null)
  const [isDeleting, startDeleteTransition] = useTransition()
  const [deleteState, setDeleteState] = useState<{ error?: string; success?: boolean }>({})

  function handleTipoChange(tipo: 'capital' | 'provincia') {
    setLocalidadTipo(tipo)
    setLocalidad('')
  }

  const departamento = localidadTipo === 'provincia' ? getDepartamento(localidad) ?? '' : ''

  const dniValid = /^[0-9]{7,8}$/.test(dni)
  const phoneValid = /^[0-9]{10}$/.test(phone)
  const isValid =
    dniValid &&
    phoneValid &&
    (localidadTipo !== 'provincia' || (localidad.trim().length >= 2 && departamento !== ''))

  function handleConfirmDelete() {
    startDeleteTransition(async () => {
      const result = await requestAccountDeletion()
      setDeleteState(result)
      if (result.success) dialogRef.current?.close()
    })
  }

  return (
    <>
      <form action={formAction} className="space-y-5">
        {state.error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.error}</p>
        )}
        {state.success && (
          <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
            Tus datos fueron actualizados correctamente.
          </p>
        )}

        <div className="rounded-lg bg-zinc-50 px-3 py-2.5">
          <p className="text-sm font-medium text-zinc-700">{profile.full_name}</p>
          <p className="text-sm text-zinc-500">{profile.email}</p>
          <p className="mt-1 text-xs text-zinc-400">Este dato proviene de tu cuenta de Google</p>
        </div>

        <div>
          <label htmlFor="dni" className="block text-sm font-medium text-[#1a1a1a]">
            DNI
          </label>
          <input
            id="dni"
            name="dni"
            inputMode="numeric"
            value={dni}
            onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
            placeholder="12345678"
            className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-base text-[#1a1a1a] placeholder:text-[#9CA3AF] focus:border-brand-naranja focus:outline-none focus:ring-1 focus:ring-brand-naranja"
          />
          {dni.length > 0 && !dniValid && (
            <p className="mt-1 text-xs text-red-600">El DNI debe tener 7 u 8 dígitos</p>
          )}
          {state.fieldErrors?.dni && (
            <p className="mt-1 text-xs text-red-600">{state.fieldErrors.dni}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-[#1a1a1a]">
            Teléfono
          </label>
          <input
            id="phone"
            name="phone"
            inputMode="numeric"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
            placeholder="3421234567"
            className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-base text-[#1a1a1a] placeholder:text-[#9CA3AF] focus:border-brand-naranja focus:outline-none focus:ring-1 focus:ring-brand-naranja"
          />
          {phone.length > 0 && !phoneValid && (
            <p className="mt-1 text-xs text-red-600">
              El teléfono debe tener 10 dígitos sin el 0 ni el 15
            </p>
          )}
          {state.fieldErrors?.phone && (
            <p className="mt-1 text-xs text-red-600">{state.fieldErrors.phone}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1a1a1a]">Localidad</label>
          <div className="mt-1.5 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleTipoChange('capital')}
              className={`rounded-lg border px-3 py-2.5 text-sm font-semibold transition-colors ${
                localidadTipo === 'capital'
                  ? 'border-brand-naranja bg-orange-50 text-brand-naranja'
                  : 'border-zinc-300 bg-white text-zinc-600 hover:border-zinc-400'
              }`}
            >
              Santa Fe Capital
            </button>
            <button
              type="button"
              onClick={() => handleTipoChange('provincia')}
              className={`rounded-lg border px-3 py-2.5 text-sm font-semibold transition-colors ${
                localidadTipo === 'provincia'
                  ? 'border-brand-naranja bg-orange-50 text-brand-naranja'
                  : 'border-zinc-300 bg-white text-zinc-600 hover:border-zinc-400'
              }`}
            >
              Otra localidad
            </button>
          </div>

          {localidadTipo === 'capital' && (
            <div className="mt-3">
              <label htmlFor="localidad" className="block text-xs font-medium text-zinc-500">
                Barrio <span className="font-normal text-zinc-400">(opcional)</span>
              </label>
              <input
                id="localidad"
                name="localidad"
                type="text"
                value={localidad}
                onChange={(e) => setLocalidad(e.target.value)}
                placeholder="Ej: Barrio Norte, Alto Verde, Candioti..."
                className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-base text-[#1a1a1a] placeholder:text-[#9CA3AF] focus:border-brand-naranja focus:outline-none focus:ring-1 focus:ring-brand-naranja"
              />
            </div>
          )}

          {localidadTipo === 'provincia' && (
            <div className="mt-3">
              <LocalidadSelect
                id="localidad"
                name="localidad"
                value={localidad}
                onChange={setLocalidad}
                options={LOCALIDADES_PROVINCIA}
                placeholder="Buscar localidad…"
              />
            </div>
          )}

          <input type="hidden" name="localidad_tipo" value={localidadTipo} />
          <input type="hidden" name="barrio" value={localidadTipo === 'capital' ? localidad : ''} />
          <input type="hidden" name="departamento" value={departamento} />
          {(state.fieldErrors?.localidad_tipo ||
            state.fieldErrors?.barrio ||
            state.fieldErrors?.departamento) && (
            <p className="mt-1 text-xs text-red-600">
              {state.fieldErrors.localidad_tipo ??
                state.fieldErrors.barrio ??
                state.fieldErrors.departamento}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="sexo" className="block text-sm font-medium text-[#1a1a1a]">
            Sexo
          </label>
          <p className="text-xs text-zinc-400">Para estadísticas internas del equipo</p>
          <select
            id="sexo"
            name="sexo"
            defaultValue={profile.sexo ?? ''}
            className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-base text-[#1a1a1a] focus:border-brand-naranja focus:outline-none focus:ring-1 focus:ring-brand-naranja"
          >
            <option value="" className="text-[#9CA3AF]">
              Preferís no responder
            </option>
            {SEXO_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="text-[#1a1a1a]">
                {opt.label}
              </option>
            ))}
          </select>
          {state.fieldErrors?.sexo && (
            <p className="mt-1 text-xs text-red-600">{state.fieldErrors.sexo}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={!isValid || isPending}
          className="w-full rounded-lg bg-brand-naranja px-5 py-3 font-semibold text-white transition-colors hover:bg-[#e66800] disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500"
        >
          {isPending ? 'Guardando…' : 'Guardar cambios'}
        </button>
      </form>

      <div className="mt-10 rounded-xl border border-red-200 bg-red-50/50 p-5">
        <h2 className="text-sm font-bold text-red-700">Zona de eliminación de datos</h2>
        <p className="mt-1 text-sm text-red-700/80">
          Si querés eliminar tu cuenta y todos tus datos personales de la plataforma, podés
          solicitarlo. Tu solicitud será procesada dentro de los 5 días hábiles.
        </p>
        {deleteState.error && (
          <p className="mt-2 rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700">
            {deleteState.error}
          </p>
        )}
        {deleteState.success && (
          <p className="mt-2 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
            Tu solicitud fue enviada. La procesaremos dentro de los 5 días hábiles.
          </p>
        )}
        {!deleteState.success && (
          <button
            type="button"
            onClick={() => dialogRef.current?.showModal()}
            className="mt-3 rounded-lg border border-red-400 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100"
          >
            Solicitar eliminación de cuenta
          </button>
        )}
      </div>

      <dialog
        ref={dialogRef}
        className="w-full max-w-[420px] rounded-2xl p-6 shadow-xl backdrop:bg-black/50"
      >
        <h3 className="text-base font-bold text-gray-900">¿Confirmás que querés eliminar tu cuenta?</h3>
        <p className="mt-2 text-sm text-zinc-600">
          Esta acción eliminará todos tus datos personales de la plataforma. Tus consultas
          registradas quedarán anonimizadas para fines estadísticos.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-600 transition-colors hover:bg-zinc-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirmDelete}
            disabled={isDeleting}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
          >
            {isDeleting ? 'Enviando…' : 'Sí, solicitar eliminación'}
          </button>
        </div>
      </dialog>
    </>
  )
}
