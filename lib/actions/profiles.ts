'use server'

import { z } from 'zod'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

const ProfileSchema = z.object({
  dni: z.string().regex(/^[0-9]{7,8}$/, 'El DNI debe tener 7 u 8 dígitos'),
  phone: z
    .string()
    .regex(/^[0-9]{10}$/, 'El teléfono debe tener 10 dígitos sin el 0 ni el 15'),
  localidad: z.string().min(2, 'Seleccioná tu localidad'),
  localidad_tipo: z.enum(['capital', 'provincia'], 'Seleccioná tu localidad'),
  barrio: z.string().min(2).optional(),
  departamento: z.string().min(2).optional(),
  sexo: z.enum(['masculino', 'femenino', 'otro', 'prefiero_no_decir']).optional(),
  consent_accepted: z.literal('on', 'Debés aceptar los términos'),
})

type FieldErrors = Partial<
  Record<
    | 'dni'
    | 'phone'
    | 'localidad'
    | 'localidad_tipo'
    | 'barrio'
    | 'departamento'
    | 'sexo'
    | 'consent_accepted',
    string
  >
>

export type ProfileFormState = {
  error?: string
  fieldErrors?: FieldErrors
}

export async function completeProfile(
  _prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const raw = {
    dni: formData.get('dni'),
    phone: formData.get('phone'),
    localidad: formData.get('localidad'),
    localidad_tipo: formData.get('localidad_tipo'),
    barrio: formData.get('barrio') || undefined,
    departamento: formData.get('departamento') || undefined,
    sexo: formData.get('sexo') || undefined,
    consent_accepted: formData.get('consent_accepted'),
  }

  const parsed = ProfileSchema.safeParse(raw)

  if (!parsed.success) {
    const fieldErrors: FieldErrors = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof FieldErrors
      if (key) fieldErrors[key] = issue.message
    }
    return { fieldErrors }
  }

  const { dni, phone, localidad, localidad_tipo, barrio, departamento, sexo } = parsed.data

  if (localidad_tipo === 'capital' && !barrio) {
    return { fieldErrors: { barrio: 'Seleccioná tu barrio' } }
  }
  if (localidad_tipo === 'provincia' && !departamento) {
    return { fieldErrors: { departamento: 'Seleccioná tu departamento' } }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Tu sesión expiró. Volvé a iniciar sesión.' }
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      dni,
      phone,
      localidad,
      localidad_tipo,
      barrio: localidad_tipo === 'capital' ? barrio : null,
      departamento: localidad_tipo === 'provincia' ? departamento : null,
      sexo: sexo ?? null,
      consent_accepted: true,
      consent_timestamp: new Date().toISOString(),
      profile_complete: true,
    })
    .eq('id', user.id)

  if (error) {
    return { error: 'No pudimos guardar tu perfil. Intentá de nuevo.' }
  }

  const { data: teamMember } = await supabase
    .from('team_members')
    .select('id')
    .eq('user_id', user.id)
    .eq('active', true)
    .single()

  redirect(teamMember ? '/equipo/dashboard' : '/ciudadano')
}
