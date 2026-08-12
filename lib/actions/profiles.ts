'use server'

import { z } from 'zod'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { sendSolicitudEliminacion } from '@/lib/actions/email'

const ProfileSchema = z.object({
  dni: z.string().regex(/^[0-9]{7,8}$/, 'El DNI debe tener 7 u 8 dígitos'),
  phone: z
    .string()
    .regex(/^[0-9]{10}$/, 'El teléfono debe tener 10 dígitos sin el 0 ni el 15'),
  localidad: z.string().min(2, 'Seleccioná tu localidad').max(100).optional(),
  localidad_tipo: z.enum(['capital', 'provincia']).optional(),
  barrio: z.string().trim().max(100).optional(),
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
  success?: boolean
}

export async function completeProfile(
  _prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const localidadTipoRaw = formData.get('localidad_tipo') || undefined
  const localidadRaw = formData.get('localidad')

  const raw = {
    dni: formData.get('dni'),
    phone: formData.get('phone'),
    localidad:
      (localidadTipoRaw === 'capital' && !localidadRaw ? 'Santa Fe' : localidadRaw) || undefined,
    localidad_tipo: localidadTipoRaw,
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
      localidad: localidad ?? null,
      localidad_tipo: localidad_tipo ?? null,
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

  redirect(teamMember ? '/equipo/tickets' : '/ciudadano')
}

export async function updateProfile(
  _prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const localidadTipoRaw = formData.get('localidad_tipo') || undefined
  const localidadRaw = formData.get('localidad')

  const raw = {
    dni: formData.get('dni'),
    phone: formData.get('phone'),
    localidad:
      (localidadTipoRaw === 'capital' && !localidadRaw ? 'Santa Fe' : localidadRaw) || undefined,
    localidad_tipo: localidadTipoRaw,
    barrio: formData.get('barrio') || undefined,
    departamento: formData.get('departamento') || undefined,
    sexo: formData.get('sexo') || undefined,
  }

  const schema = ProfileSchema.omit({ consent_accepted: true })
  const parsed = schema.safeParse(raw)

  if (!parsed.success) {
    const fieldErrors: FieldErrors = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof FieldErrors
      if (key) fieldErrors[key] = issue.message
    }
    return { fieldErrors }
  }

  const { dni, phone, localidad, localidad_tipo, barrio, departamento, sexo } = parsed.data

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
      localidad: localidad ?? null,
      localidad_tipo: localidad_tipo ?? null,
      barrio: localidad_tipo === 'capital' ? barrio : null,
      departamento: localidad_tipo === 'provincia' ? departamento : null,
      sexo: sexo ?? null,
    })
    .eq('id', user.id)

  if (error) {
    return { error: 'No pudimos guardar tu perfil. Intentá de nuevo.' }
  }

  revalidatePath('/ciudadano/perfil')
  return { success: true }
}

export type DeletionRequestState = {
  error?: string
  success?: boolean
}

export async function requestAccountDeletion(): Promise<DeletionRequestState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Tu sesión expiró. Volvé a iniciar sesión.' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, dni')
    .eq('id', user.id)
    .single()

  try {
    await sendSolicitudEliminacion({
      nombre: profile?.full_name ?? 'Sin nombre',
      email: user.email ?? 'Sin email',
      dni: profile?.dni ?? 'Sin DNI',
    })
  } catch (e) {
    console.error('Error enviando solicitud de eliminación:', e)
    return { error: 'No pudimos enviar tu solicitud. Intentá de nuevo o escribinos a privacidad@unidosconstruimos.com.ar.' }
  }

  return { success: true }
}
