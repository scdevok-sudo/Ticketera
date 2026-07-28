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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <AvatarCondicional />
      </body>
    </html>
  );
}
