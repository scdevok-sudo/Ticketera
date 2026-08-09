'use server'

interface AcuseReciboParams {
  to: string
  ticketId: string
  title: string
  type: string
}

export async function sendAcuseRecibo({ to, ticketId, title, type }: AcuseReciboParams) {
  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) {
    console.warn('RESEND_API_KEY no configurada — email no enviado')
    return
  }

  const ticketNum = ticketId.slice(0, 8).toUpperCase()
  const typeLabel = type === 'pregunta' ? 'Consulta' : 'Pedido'

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Unidos Construimos <noresponder@unidosconstruimos.com.ar>',
      to: [to],
      subject: `${typeLabel} recibido — Caso #${ticketNum}`,
      html: `
        <div style="font-family: Inter, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px;">
          <div style="background: linear-gradient(135deg, #FFB002, #FF7402); border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
            <img src="https://www.unidosconstruimos.com.ar/brand/logo-blanco.png" alt="Unidos Construimos" style="height: 48px; width: auto; margin-bottom: 12px;" />
            <h1 style="color: white; margin: 0; font-size: 20px; font-weight: 800;">Unidos Construimos</h1>
          </div>

          <h2 style="color: #1a1a1a; font-size: 18px; margin-bottom: 8px;">¡${typeLabel} recibido!</h2>
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
            Gracias por comunicarte. Registramos tu ${typeLabel.toLowerCase()} y el equipo del Diputado Corral va a revisarlo a la brevedad.
          </p>

          <div style="background: #FFF8F2; border: 1px solid rgba(255,116,2,0.2); border-radius: 10px; padding: 16px; margin-bottom: 20px;">
            <p style="color: #6b7280; font-size: 12px; margin: 0 0 4px;">Número de caso</p>
            <p style="color: #FF7402; font-size: 22px; font-weight: 800; margin: 0;">#UC-${ticketNum}</p>
            <p style="color: #1a1a1a; font-size: 13px; margin: 8px 0 0;"><strong>${title}</strong></p>
          </div>

          <a href="${process.env.NEXT_PUBLIC_APP_URL}/ciudadano/mis-reclamos"
             style="display: block; background: #FF7402; color: white; text-align: center; padding: 12px 24px; border-radius: 8px; font-weight: 700; font-size: 14px; text-decoration: none; margin-bottom: 20px;">
            Ver el seguimiento →
          </a>

          <p style="color: #9ca3af; font-size: 12px; text-align: center; line-height: 1.5;">
            Unidos Construimos · scdev.com.ar<br>
            Este es un mensaje automático, por favor no respondas este email.
          </p>
        </div>
      `,
    }),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(`Resend error: ${JSON.stringify(err)}`)
  }
}

interface AcuseReciboManualParams {
  to: string
  contactName: string
  ticketId: string
  title: string
  type: string
}

export async function sendAcuseReciboManual({
  to,
  contactName,
  ticketId,
  title,
  type,
}: AcuseReciboManualParams) {
  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) {
    console.warn('RESEND_API_KEY no configurada — email no enviado')
    return
  }

  const ticketNum = ticketId.slice(0, 8).toUpperCase()
  const typeLabel = type === 'pregunta' ? 'Consulta' : 'Pedido'

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Unidos Construimos <noresponder@unidosconstruimos.com.ar>',
      to: [to],
      subject: `${typeLabel} recibido — Caso #${ticketNum}`,
      html: `
        <div style="font-family: Inter, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px;">
          <div style="background: linear-gradient(135deg, #FFB002, #FF7402); border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
            <img src="https://www.unidosconstruimos.com.ar/brand/logo-blanco.png" alt="Unidos Construimos" style="height: 48px; width: auto; margin-bottom: 12px;" />
            <h1 style="color: white; margin: 0; font-size: 20px; font-weight: 800;">Unidos Construimos</h1>
          </div>

          <h2 style="color: #1a1a1a; font-size: 18px; margin-bottom: 8px;">Hola ${contactName}, tu consulta fue registrada</h2>
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
            El equipo del Diputado Corral registró tu consulta. Podés hacer el seguimiento ingresando al portal con tu cuenta de Google.
          </p>

          <div style="background: #FFF8F2; border: 1px solid rgba(255,116,2,0.2); border-radius: 10px; padding: 16px; margin-bottom: 20px;">
            <p style="color: #6b7280; font-size: 12px; margin: 0 0 4px;">Número de caso</p>
            <p style="color: #FF7402; font-size: 22px; font-weight: 800; margin: 0;">#UC-${ticketNum}</p>
            <p style="color: #1a1a1a; font-size: 13px; margin: 8px 0 0;"><strong>${title}</strong></p>
          </div>

          <a href="${process.env.NEXT_PUBLIC_APP_URL}/ciudadano/mis-reclamos"
             style="display: block; background: #FF7402; color: white; text-align: center; padding: 12px 24px; border-radius: 8px; font-weight: 700; font-size: 14px; text-decoration: none; margin-bottom: 20px;">
            Ver el seguimiento →
          </a>

          <p style="color: #9ca3af; font-size: 12px; text-align: center; line-height: 1.5;">
            Unidos Construimos · scdev.com.ar<br>
            Este es un mensaje automático, por favor no respondas este email.
          </p>
        </div>
      `,
    }),
  })

  if (!res.ok) {
    const err = await res.json()
    console.error('Resend error al enviar acuse manual:', err)
  }
}

interface RespuestaCiudadanoParams {
  to: string
  ticketId: string
  title: string
  respuesta: string
}

export async function sendRespuestaCiudadano({ to, ticketId, title, respuesta }: RespuestaCiudadanoParams) {
  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) {
    console.warn('RESEND_API_KEY no configurada — email no enviado')
    return
  }

  const ticketNum = ticketId.slice(0, 8).toUpperCase()

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Unidos Construimos <noresponder@unidosconstruimos.com.ar>',
      to: [to],
      subject: `Hay una respuesta a tu consulta #UC-${ticketNum}`,
      html: `
        <div style="font-family: Inter, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px;">
          <div style="background: linear-gradient(135deg, #FFB002, #FF7402); border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
            <img src="https://www.unidosconstruimos.com.ar/brand/logo-blanco.png" alt="Unidos Construimos" style="height: 48px; width: auto; margin-bottom: 12px;" />
            <h1 style="color: white; margin: 0; font-size: 20px; font-weight: 800;">Unidos Construimos</h1>
          </div>

          <h2 style="color: #1a1a1a; font-size: 18px; margin-bottom: 8px;">Hay una respuesta a tu consulta</h2>
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
            El equipo del Diputado Corral respondió tu consulta. Podés ver la respuesta completa en el seguimiento.
          </p>

          <div style="background: #FFF8F2; border: 1px solid rgba(255,116,2,0.2); border-radius: 10px; padding: 16px; margin-bottom: 16px;">
            <p style="color: #6b7280; font-size: 12px; margin: 0 0 4px;">Número de caso</p>
            <p style="color: #FF7402; font-size: 22px; font-weight: 800; margin: 0;">#UC-${ticketNum}</p>
            <p style="color: #1a1a1a; font-size: 13px; margin: 8px 0 0;"><strong>${title}</strong></p>
          </div>

          <div style="background: #f9fafb; border-left: 3px solid #FF7402; border-radius: 0 8px 8px 0; padding: 16px; margin-bottom: 20px;">
            <p style="color: #6b7280; font-size: 12px; margin: 0 0 8px;">Respuesta del equipo</p>
            <p style="color: #1a1a1a; font-size: 14px; line-height: 1.6; margin: 0;">${respuesta}</p>
          </div>

          <a href="${process.env.NEXT_PUBLIC_APP_URL}/ciudadano/mis-reclamos"
             style="display: block; background: #FF7402; color: white; text-align: center; padding: 12px 24px; border-radius: 8px; font-weight: 700; font-size: 14px; text-decoration: none; margin-bottom: 20px;">
            Ver el seguimiento →
          </a>

          <p style="color: #9ca3af; font-size: 12px; text-align: center; line-height: 1.5;">
            Unidos Construimos · scdev.com.ar<br>
            Este es un mensaje automático, por favor no respondas este email.
          </p>
        </div>
      `,
    }),
  })

  if (!res.ok) {
    const err = await res.json()
    console.error('Resend error al enviar respuesta:', err)
  }
}

interface AsignacionOperadorParams {
  to: string
  operadorNombre: string
  ticketId: string
  title: string
  asignadoPor: string
}

export async function sendAsignacionOperador({
  to,
  operadorNombre,
  ticketId,
  title,
  asignadoPor,
}: AsignacionOperadorParams) {
  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) {
    console.warn('RESEND_API_KEY no configurada — email no enviado')
    return
  }

  const ticketNum = ticketId.slice(0, 8).toUpperCase()

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Unidos Construimos <noresponder@unidosconstruimos.com.ar>',
      to: [to],
      subject: `Nuevo ticket asignado — Caso #UC-${ticketNum}`,
      html: `
        <div style="font-family: Inter, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px;">
          <div style="background: linear-gradient(135deg, #FFB002, #FF7402); border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
            <img src="https://www.unidosconstruimos.com.ar/brand/logo-blanco.png" alt="Unidos Construimos" style="height: 48px; width: auto; margin-bottom: 12px;" />
            <h1 style="color: white; margin: 0; font-size: 20px; font-weight: 800;">Unidos Construimos</h1>
          </div>

          <h2 style="color: #1a1a1a; font-size: 18px; margin-bottom: 8px;">Hola ${operadorNombre}, te asignaron un ticket</h2>
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
            ${asignadoPor} te asignó el siguiente caso. Podés verlo y gestionarlo desde el panel del equipo.
          </p>

          <div style="background: #FFF8F2; border: 1px solid rgba(255,116,2,0.2); border-radius: 10px; padding: 16px; margin-bottom: 20px;">
            <p style="color: #6b7280; font-size: 12px; margin: 0 0 4px;">Número de caso</p>
            <p style="color: #FF7402; font-size: 22px; font-weight: 800; margin: 0;">#UC-${ticketNum}</p>
            <p style="color: #1a1a1a; font-size: 13px; margin: 8px 0 0;"><strong>${title}</strong></p>
          </div>

          <a href="${process.env.NEXT_PUBLIC_APP_URL}/equipo/tickets/${ticketId}"
             style="display: block; background: #2D3077; color: white; text-align: center; padding: 12px 24px; border-radius: 8px; font-weight: 700; font-size: 14px; text-decoration: none; margin-bottom: 20px;">
            Ver el ticket →
          </a>

          <p style="color: #9ca3af; font-size: 12px; text-align: center; line-height: 1.5;">
            Unidos Construimos · scdev.com.ar<br>
            Este es un mensaje automático, por favor no respondas este email.
          </p>
        </div>
      `,
    }),
  })

  if (!res.ok) {
    const err = await res.json()
    console.error('Resend error al notificar asignación:', err)
  }
}
