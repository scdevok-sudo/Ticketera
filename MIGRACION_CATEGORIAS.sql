-- Migración de categorías de tickets
-- Ejecutar en Supabase SQL Editor ANTES de aplicar el CHECK constraint nuevo
-- Correr primero el SELECT de diagnóstico, luego la transacción completa
--
-- Mapeo viejo -> nuevo (valores viejos tomados de lib/constants/tickets.ts en el commit 9100f25):
--   infraestructura    -> infraestructura_obras
--   espacios_publicos  -> calles_luminarias_plazas
--   salud              -> educacion_salud_asistencia
--   educacion          -> educacion_salud_asistencia
--   social             -> educacion_salud_asistencia
--   otro               -> consultas_legislativas   (fallback, sin equivalente claro)
--
-- Nota: las filas con category NULL no son alcanzadas por el UPDATE ni por la
-- verificación (NOT IN con NULL da UNKNOWN), y tampoco violan el CHECK.
-- Si el diagnóstico muestra NULLs y querés normalizarlos, decidilo aparte.

-- 1. DIAGNÓSTICO (correr aparte primero)
SELECT category, count(*) as total
FROM tickets
GROUP BY category
ORDER BY total DESC;

-- 2. MIGRACIÓN + CONSTRAINT (correr después de confirmar el diagnóstico)
BEGIN;

UPDATE tickets SET category = CASE
  WHEN category = 'infraestructura' THEN 'infraestructura_obras'
  WHEN category = 'espacios_publicos' THEN 'calles_luminarias_plazas'
  WHEN category = 'salud' THEN 'educacion_salud_asistencia'
  WHEN category = 'educacion' THEN 'educacion_salud_asistencia'
  WHEN category = 'social' THEN 'educacion_salud_asistencia'
  WHEN category = 'otro' THEN 'consultas_legislativas'
  ELSE 'consultas_legislativas'
END
WHERE category NOT IN (
  'calles_luminarias_plazas',
  'vivienda_escrituras',
  'clubes_asociaciones_instituciones',
  'educacion_salud_asistencia',
  'infraestructura_obras',
  'luz_agua_cloacas',
  'movilidad_transporte',
  'consultas_legislativas'
);

-- 3. VERIFICACIÓN: debe devolver 0 filas antes de continuar
SELECT category, count(*)
FROM tickets
WHERE category NOT IN (
  'calles_luminarias_plazas',
  'vivienda_escrituras',
  'clubes_asociaciones_instituciones',
  'educacion_salud_asistencia',
  'infraestructura_obras',
  'luz_agua_cloacas',
  'movilidad_transporte',
  'consultas_legislativas'
)
GROUP BY category;

-- 4. CONSTRAINT
ALTER TABLE tickets DROP CONSTRAINT IF EXISTS tickets_category_check;
ALTER TABLE tickets ADD CONSTRAINT tickets_category_check
  CHECK (category IN (
    'calles_luminarias_plazas',
    'vivienda_escrituras',
    'clubes_asociaciones_instituciones',
    'educacion_salud_asistencia',
    'infraestructura_obras',
    'luz_agua_cloacas',
    'movilidad_transporte',
    'consultas_legislativas'
  ));

COMMIT;
