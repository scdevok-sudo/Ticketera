-- La policy "equipo puede ver todos los miembros" tenía un using_expr que solo
-- permitía auth.uid() = user_id (o service_role), es decir cada operador solo
-- veía su propia fila. Eso rompe getTeamMembers() (lib/actions/equipo.ts):
-- el selector de responsable, la lista de carga por operador en KPIs y la
-- página /equipo/equipo devuelven un solo miembro en vez de todo el equipo.
--
-- Un EXISTS que consulta team_members directamente en el using_expr de una
-- policy de team_members dispara "infinite recursion detected in policy for
-- relation team_members" en Postgres. Se resuelve con una función
-- SECURITY DEFINER: al correr con los privilegios del definer, su query
-- interna a team_members no vuelve a evaluar RLS.

create or replace function public.is_active_team_member()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.team_members
    where user_id = auth.uid() and active = true
  )
$$;

drop policy if exists "equipo puede ver todos los miembros" on public.team_members;

create policy "equipo puede ver todos los miembros"
on public.team_members
for select
using (
  auth.role() = 'service_role'
  or public.is_active_team_member()
);
