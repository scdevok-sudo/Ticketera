import type { createClient } from '@/lib/supabase/server'
import { attachmentExtension } from '@/lib/constants/attachments'

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>

/**
 * Lee el adjunto del FormData descartando los "archivos vacíos" que manda el
 * navegador cuando el input quedó sin elegir nada.
 */
export function getAttachmentFromFormData(formData: FormData): File | null {
  const raw = formData.get('photo') as File | null
  if (!raw || raw.size === 0 || raw.type === 'application/octet-stream') return null
  return raw
}

/**
 * Sube el adjunto al bucket "attachments" y registra la fila en
 * ticket_attachments. Los fallos de storage no rompen el alta del ticket.
 */
export async function uploadTicketAttachment(
  supabase: SupabaseServerClient,
  ticketId: string,
  file: File
) {
  const fileName = `${crypto.randomUUID()}.${attachmentExtension(file.type)}`
  const storagePath = `tickets/${ticketId}/${fileName}`

  const arrayBuffer = await file.arrayBuffer()
  const { error: uploadError } = await supabase.storage
    .from('attachments')
    .upload(storagePath, arrayBuffer, {
      contentType: file.type,
      upsert: false,
    })

  if (uploadError) {
    console.error('Error subiendo adjunto:', uploadError)
    return
  }

  await supabase.from('ticket_attachments').insert({
    ticket_id: ticketId,
    storage_path: storagePath,
    file_name: fileName,
    file_size: file.size,
  })
}
