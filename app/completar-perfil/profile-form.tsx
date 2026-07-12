'use client'

import { useActionState, useState } from 'react'
import { completeProfile, type ProfileFormState } from '@/lib/actions/profiles'
import { LocalidadSelect } from '@/components/ciudadano/localidad-select'
import { LOCALIDADES } from '@/lib/constants/localidades'

const CAPITAL = 'Santa Fe Capital'

const SEXO_OPTIONS = [
  { value: 'masculino', label: 'Masculino' },
  { value: 'femenino', label: 'Femenino' },
  { value: 'otro', label: 'Otro' },
  { value: 'prefiero_no_decir', label: 'Prefiero no decir' },
]

const initialState: ProfileFormState = {}

export function ProfileForm() {
  const [state, formAction, isPending] = useActionState(completeProfile, initialState)
  const [dni, setDni] = useState('')
  const [phone, setPhone] = useState('')
  const [localidad, setLocalidad] = useState('')
  const [consent, setConsent] = useState(false)

  const localidadTipo = localidad === CAPITAL ? 'capital' : localidad ? 'provincia' : ''

  const dniValid = /^[0-9]{7,8}$/.test(dni)
  const phoneValid = /^[0-9]{10}$/.test(phone)
  const isValid = dniValid && phoneValid && localidad.trim().length >= 2 && consent

  return (
    <form action={formAction} className="space-y-5">
      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.error}</p>
      )}

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
        <label htmlFor="localidad" className="block text-sm font-medium text-[#1a1a1a]">
          Localidad
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
        <input type="hidden" name="localidad_tipo" value={localidadTipo} />
        <input type="hidden" name="barrio" value={localidadTipo === 'capital' ? localidad : ''} />
        <input
          type="hidden"
          name="departamento"
          value={localidadTipo === 'provincia' ? localidad : ''}
        />
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
          defaultValue=""
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

      <label className="flex items-start gap-2.5">
        <input
          type="checkbox"
          name="consent_accepted"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-zinc-300 text-brand-naranja focus:ring-brand-naranja"
        />
        <span className="text-xs leading-relaxed text-zinc-600">
          Acepto que mis datos sean tratados conforme a la Ley 25.326 de Protección de Datos
          Personales y autorizo al equipo a contactarme para gestionar mi trámite.
        </span>
      </label>
      {state.fieldErrors?.consent_accepted && (
        <p className="text-xs text-red-600">{state.fieldErrors.consent_accepted}</p>
      )}

      <button
        type="submit"
        disabled={!isValid || isPending}
        className="w-full rounded-lg bg-brand-naranja px-5 py-3 font-semibold text-white transition-colors hover:bg-[#e66800] disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500"
      >
        {isPending ? 'Guardando…' : 'Guardar y continuar'}
      </button>
    </form>
  )
}
