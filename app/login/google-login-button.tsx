'use client'

import { createClient } from '@/lib/supabase/client'

export function GoogleLoginButton() {
  const supabase = createClient()

  async function handleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <button
      type="button"
      onClick={handleLogin}
      className="flex w-full items-center justify-center gap-3 rounded-lg bg-white px-5 py-3 font-semibold text-[#2D3077] shadow-sm ring-1 ring-zinc-200 transition-colors hover:bg-zinc-50"
    >
      <GoogleIcon />
      Continuar con Google
    </button>
  )
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.6 6 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 15.9 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34.6 6 29.6 4 24 4 16 4 9.1 8.6 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.5 0 10.4-1.9 14.3-5.1l-6.6-5.4C29.6 35.4 26.9 36 24 36c-5.2 0-9.7-3.4-11.3-8.1l-6.6 5.1C9 39.4 15.9 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.3-4.1 5.6l6.6 5.4C41.6 36 44 30.6 44 24c0-1.3-.1-2.7-.4-3.5z"
      />
    </svg>
  )
}
