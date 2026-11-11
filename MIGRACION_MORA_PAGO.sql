-- MIGRACION_MORA_PAGO.sql
-- Ejecutar manualmente en Supabase SQL Editor (proyecto tfqmafhgwjawetuforuo)
-- Crea billing_status: una sola fila que controla el velo progresivo por mora de mantenimiento.
-- Solo SCdev la toca (service role / SQL Editor). RLS activado y SIN políticas públicas.

CREATE TABLE IF NOT EXISTS public.billing_status (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),          -- fuerza una sola fila
  enabled boolean NOT NULL DEFAULT false,                   -- interruptor general
  next_due_date date NOT NULL,                              -- próximo vencimiento
  ramp_days integer NOT NULL DEFAULT 14 CHECK (ramp_days > 0),
  override_darkness numeric CHECK (override_darkness IS NULL OR (override_darkness >= 0 AND override_darkness <= 1)),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.billing_status ENABLE ROW LEVEL SECURITY;
-- Sin políticas: anon y authenticated no pueden leer ni escribir. El service role ignora RLS.
REVOKE ALL ON public.billing_status FROM anon, authenticated;

INSERT INTO public.billing_status (id, enabled, next_due_date, ramp_days)
VALUES (1, false, '2026-11-10', 14)
ON CONFLICT (id) DO NOTHING;

-- Verificación: debe devolver una fila con enabled = false
SELECT * FROM public.billing_status;

-- ---------------------------------------------------------------------------
-- OPERACIÓN MANUAL (desde el SQL Editor, o desde el panel /equipo/facturacion)
-- ---------------------------------------------------------------------------

-- Activar el sistema de mora:
--   UPDATE public.billing_status SET enabled = true, updated_at = now() WHERE id = 1;

-- Marcar el pago (mueve el vencimiento al día 10 del mes siguiente):
--   UPDATE public.billing_status
--   SET next_due_date = (date_trunc('month', next_due_date) + interval '1 month' + interval '9 days')::date,
--       updated_at = now()
--   WHERE id = 1;

-- Apagar todo de inmediato:
--   UPDATE public.billing_status SET enabled = false, override_darkness = NULL, updated_at = now() WHERE id = 1;
