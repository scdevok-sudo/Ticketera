/**
 * Reglas de adjuntos compartidas entre el formulario (cliente) y los Server
 * Actions. Cualquier cambio de tipos o límites se hace acá y vale para los dos.
 */

export const ALLOWED_ATTACHMENT_TYPES = ['image/jpeg', 'image/png', 'application/pdf'] as const

export const ATTACHMENT_ACCEPT = ALLOWED_ATTACHMENT_TYPES.join(',')

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024
export const MAX_PDF_SIZE = 10 * 1024 * 1024

export const ATTACHMENT_HELP_TEXT = 'JPG, PNG o PDF · Imágenes hasta 5MB · PDFs hasta 10MB'

const EXTENSION_BY_TYPE: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'application/pdf': 'pdf',
}

export function isPdf(type: string) {
  return type === 'application/pdf'
}

export function attachmentExtension(type: string) {
  return EXTENSION_BY_TYPE[type] ?? 'bin'
}

export function maxSizeFor(type: string) {
  return isPdf(type) ? MAX_PDF_SIZE : MAX_IMAGE_SIZE
}

/** Devuelve el mensaje de error, o null si el archivo es válido. */
export function validateAttachment(file: { type: string; size: number }): string | null {
  if (!(ALLOWED_ATTACHMENT_TYPES as readonly string[]).includes(file.type)) {
    return 'Solo se aceptan imágenes (JPG, PNG) o archivos PDF.'
  }
  if (file.size > maxSizeFor(file.type)) {
    return isPdf(file.type)
      ? 'El PDF no puede superar los 10MB.'
      : 'La imagen no puede superar los 5MB.'
  }
  return null
}
