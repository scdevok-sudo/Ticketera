-- Migración: agregar número ordinal a tickets
-- Ejecutar en Supabase SQL Editor

-- 1. Crear la secuencia
CREATE SEQUENCE IF NOT EXISTS tickets_ticket_number_seq;

-- 2. Agregar la columna
ALTER TABLE tickets
  ADD COLUMN IF NOT EXISTS ticket_number INTEGER;

-- 3. Poblar los tickets existentes en orden de creación
UPDATE tickets t
SET ticket_number = sub.rn
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) AS rn
  FROM tickets
) sub
WHERE t.id = sub.id;

-- 4. Setear la secuencia al valor máximo actual
SELECT setval(
  'tickets_ticket_number_seq',
  COALESCE((SELECT MAX(ticket_number) FROM tickets), 0)
);

-- 5. Setear el default para nuevos tickets
ALTER TABLE tickets
  ALTER COLUMN ticket_number SET DEFAULT nextval('tickets_ticket_number_seq');

-- 6. Agregar NOT NULL y constraint único
ALTER TABLE tickets
  ALTER COLUMN ticket_number SET NOT NULL;

ALTER TABLE tickets
  ADD CONSTRAINT tickets_ticket_number_unique UNIQUE (ticket_number);

-- 7. Verificación
SELECT MIN(ticket_number), MAX(ticket_number), COUNT(*) FROM tickets;
