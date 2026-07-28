const RESEND_API_KEY = process.env.RESEND_API_KEY

async function testEmail() {
  if (!RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY no está configurada')
    process.exit(1)
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Unidos Construimos <noresponder@unidosconstruimos.com.ar>',
      to: ['1caceres.santiago5@gmail.com'],
      subject: 'Test de email — Unidos Construimos',
      html: `
        <h1>Test de email</h1>
        <p>Si recibís este mensaje, Resend está funcionando correctamente con el dominio <strong>unidosconstruimos.com.ar</strong>.</p>
        <p>Enviado desde el sistema Unidos Construimos.</p>
      `,
    }),
  })

  const data = await res.json()

  if (!res.ok) {
    console.error('❌ Error al enviar:', data)
    process.exit(1)
  }

  console.log('✅ Email enviado correctamente:', data)
}

testEmail()
