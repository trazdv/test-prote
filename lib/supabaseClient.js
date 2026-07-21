import { createClient } from '@supabase/supabase-js';

// Cliente "público": usa la clave anon, que solo tiene permiso de LECTURA
// gracias a las políticas de seguridad (RLS) definidas en sql/schema.sql.
// Es seguro que esta clave sea visible en el navegador.

export const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
