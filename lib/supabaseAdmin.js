import { createClient } from '@supabase/supabase-js';

// ¡IMPORTANTE! Este cliente usa la "service role key", que tiene permisos
// totales sobre la base de datos. Por eso SOLO se debe importar dentro de
// archivos de app/api/** (código de servidor), nunca en componentes de cliente.
// La clave se lee de una variable de entorno y nunca está escrita en el código.

let supabaseAdmin;

export function getSupabaseAdmin() {
  if (!supabaseAdmin) {
    const url = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceKey) {
      throw new Error(
        'Faltan las variables de entorno SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY.'
      );
    }

    supabaseAdmin = createClient(url, serviceKey, {
      auth: { persistSession: false },
    });
  }
  return supabaseAdmin;
}
