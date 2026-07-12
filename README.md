# Unidos Hacemos — Sistema de gestión de consultas ciudadanas

Plataforma web para que los vecinos de Santa Fe registren consultas, pedidos y reclamos al equipo del **Diputado Provincial José Corral**, con seguimiento en tiempo real y portal de transparencia pública.

Desarrollado por [SCdev](https://scdev.com.ar) · Santiago Cáceres

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 16 (App Router, Server Actions, TypeScript) |
| Estilos | Tailwind CSS v4 (CSS-first) |
| Base de datos | Supabase (PostgreSQL + RLS) · Región São Paulo |
| Auth | Supabase Auth + Google OAuth |
| Storage | Supabase Storage (adjuntos privados) |
| Email | Resend (acuse de recibo automático) |
| Gráficos | Recharts |
| Hosting | Vercel |

---

## Funcionalidades

**Ciudadano**
- Login con Google, perfil con localidad y consentimiento Ley 25.326
- Formulario conversacional de 3 pasos para cargar una consulta
- Adjunto de foto (JPG/PNG, máx. 5MB)
- Seguimiento en tiempo real con línea de tiempo
- Email automático de acuse de recibo
- Adhesiones a consultas de otros vecinos

**Equipo interno**
- Dashboard con listado, filtros y paginación
- Detalle de consulta con notas internas (no visibles al ciudadano)
- Asignación de tickets a operadores
- Cambio de estado con auditoría completa
- Panel de KPIs y métricas
- Gestión de miembros del equipo (admin)

**Portal público**
- Estadísticas agregadas sin datos personales
- Gráficos por categoría, estado y evolución mensual
- Últimos casos resueltos
- Sin registro requerido

---

## Desarrollo local

```bash
npm install
npm run dev
```

Requiere un archivo `.env.local` con las variables de entorno. Pedirlas al responsable del proyecto.

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Estructura de rutas

```
/                     → Landing pública
/login                → Auth con Google
/completar-perfil     → Perfil obligatorio post-login
/ciudadano/*          → Requiere sesión + perfil completo
/equipo/*             → Requiere sesión + team_members activo
/transparencia        → Portal público sin auth
/ayuda                → Instructivos (contenido según rol)
```

---

## Decisiones técnicas destacadas

- **`proxy.ts`** en lugar de `middleware.ts` — convención de Next.js 16
- **Sin route groups con paréntesis** — bug de Turbopack en Next.js 16
- **`cache()` de React** en auth — un solo round-trip a Supabase por request
- **RLS en todas las tablas** — autorización a nivel de base de datos
- **Tailwind v4 CSS-first** — colores definidos en `globals.css` con `@theme`

---

## Cumplimiento legal

El sistema cumple con la **Ley 25.326 de Protección de Datos Personales**:
- Consentimiento explícito con timestamp en el registro
- Datos almacenados en servidores en Sudamérica (São Paulo)
- Portal de transparencia sin exposición de PII
- Vista `public_tickets_stats` con `security_invoker = true`

---

*SCdev · scdev.com.ar · Santa Fe · 2026*