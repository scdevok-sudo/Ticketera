-- El equipo (operadores activos en team_members) necesita ver los perfiles
-- de los ciudadanos (para el detalle de ticket) y de sus compañeros (para
-- el selector de responsable). Antes solo existía "ciudadano ve su propio
-- perfil" (auth.uid() = id), por lo que el embed profiles!... en las queries
-- de /equipo devolvía null por RLS aunque el JOIN estuviera bien armado.

create policy "equipo ve perfiles"
on public.profiles
for select
using (
  exists (
    select 1 from public.team_members
    where team_members.user_id = auth.uid()
      and team_members.active = true
  )
);
