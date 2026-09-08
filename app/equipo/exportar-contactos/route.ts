import { getTeamMember } from '@/lib/supabase/auth-cache'
import { exportarContactos } from '@/lib/actions/equipo'
import { formatFechaCorta } from '@/lib/utils/fecha'

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

function formatFecha(fecha: string): string {
  if (!fecha) return ''
  return formatFechaCorta(fecha)
}

export async function GET() {
  const teamMember = await getTeamMember()
  if (!teamMember) {
    return new Response('No autorizado', { status: 401 })
  }
  if (teamMember.role !== 'admin') {
    return new Response('No autorizado', { status: 403 })
  }

  const result = await exportarContactos()
  if (result.error || !result.data) {
    return new Response(result.error ?? 'Error al exportar contactos', { status: 500 })
  }

  const header = ['Nombre', 'Email', 'Teléfono', 'DNI', 'Localidad', 'Fecha de registro']
  const rows = result.data.map((c) =>
    [c.nombre, c.email, c.telefono, c.dni, c.localidad, formatFecha(c.fecha)].map(csvEscape).join(',')
  )
  const csvContent = [header.join(','), ...rows].join('\n')

  // BOM al inicio: sin esto, Excel interpreta los acentos (José, Diputado) como
  // Latin-1 y los rompe al abrir un CSV UTF-8.
  return new Response('﻿' + csvContent, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="contactos-unidos-construimos.csv"',
    },
  })
}
