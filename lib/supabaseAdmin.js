import { createClient } from '@supabase/supabase-js';

// ¡IMPORTANTE! Este cliente usa la "service role key", que tiene permisos
// totales sobre la base de datos. Por eso SOLO se debe importar dentro de
// archivos de app/api/** (código de servidor), nunca en componentes de cliente.
// La clave se lee de una variable de entorno y nunca está escrita en el código.

let supabaseAdmin;

// Envolvemos el fetch que usa la librería de Supabase para forzar
// "no-store" en cada petición. Next.js tiene su propia caché de datos para
// llamadas fetch() hechas en el servidor, independiente de la caché de la
// propia ruta; sin esto, esa caché interna puede servir respuestas antiguas
// de Supabase aunque la ruta esté marcada como dinámica.
const fetchSinCache = (url, options = {}) => fetch(url, { ...options, cache: 'no-store' });

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
      global: { fetch: fetchSinCache },
    });
  }
  return supabaseAdmin;
}
