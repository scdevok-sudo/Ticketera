-- MIGRACION_ESTADO_CERRADO.sql
-- Ejecutar manualmente en Supabase SQL Editor (proyecto tfqmafhgwjawetuforuo)
-- Agrega 'cerrado' como valor válido del campo status en la tabla tickets

-- 1. Eliminar el CHECK actual de status.
--    Se busca por definición en vez de por nombre fijo, porque el nombre que
--    generó Postgres puede no ser exactamente 'tickets_status_check'.
DO $$
DECLARE
  con_name text;
BEGIN
  FOR con_name IN
    SELECT con.conname
    FROM pg_constraint con
    JOIN pg_class rel ON rel.oid = con.conrelid
    JOIN pg_namespace ns ON ns.oid = rel.relnamespace
    WHERE ns.nspname = 'public'
      AND rel.relname = 'tickets'
      AND con.contype = 'c'
      AND pg_get_constraintdef(con.oid) ILIKE '%status%'
  LOOP
    EXECUTE format('ALTER TABLE public.tickets DROP CONSTRAINT %I', con_name);
    RAISE NOTICE 'Constraint eliminado: %', con_name;
  END LOOP;
END $$;

-- 2. Volver a crear el CHECK con el set completo de estados, incluido 'cerrado'.
ALTER TABLE public.tickets
  ADD CONSTRAINT tickets_status_check
  CHECK (status IN (
    'nuevo',
    'en_revision',
    'en_gestion',
    'derivado',
    'requiere_info',
    'resuelto',
    'cerrado'
  ));

-- 3. Verificar que el constraint quedó bien aplicado.
--    Debe devolver una fila: tickets_status_check con 'cerrado' en la definición.
SELECT
  con.conname AS constraint_name,
  pg_get_constraintdef(con.oid) AS definition
FROM pg_constraint con
JOIN pg_class rel ON rel.oid = con.conrelid
JOIN pg_namespace ns ON ns.oid = rel.relnamespace
WHERE ns.nspname = 'public'
  AND rel.relname = 'tickets'
  AND con.conname = 'tickets_status_check';
