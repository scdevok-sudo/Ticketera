import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AvatarCondicional } from "@/components/shared/avatar-condicional";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
});

export const metadata: Metadata = {
  title: "Unidos Construimos | José Corral - Diputado Provincial",
  description:
    "Registrá tu consulta o pedido. Tu voz llega directo al equipo del diputado José Corral.",
  icons: {
    icon: "/brand/logo-isotipo.png",
    apple: "/brand/logo-isotipo.png",
  },
  verification: {
    google: "3Z3akvjbfj-qeru5wHndWleV4JRgZvDPe2rmgVvjLFo",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        {/* Velo por mora: lee la cookie que setea proxy.ts. Inline a propósito para no
            usar cookies()/headers() y mantener las páginas públicas estáticas.
            Si el CSP se endurece (hoy permite unsafe-inline), pasar a nonce. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var m=document.cookie.match(/(?:^|; )billing_dk=([0-9.]+)/);if(m){var v=parseFloat(m[1]);if(v>0&&v<=1)document.documentElement.style.setProperty('--billing-veil',String(v))}}catch(e){}",
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <AvatarCondicional />
      </body>
    </html>
  );
}
