import { NextResponse } from 'next/server';

// Evita que Next.js cachee esta ruta como estatica: siempre debe leer
// los datos mas recientes de la base de datos.
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { noStoreJson } from '@/lib/noStoreJson';

export async function GET(request, { params }) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('animals')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (error) {
    return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  }

  if (data.paired_animal_id) {
    const { data: pareja } = await supabase
      .from('animals')
      .select('name, slug')
      .eq('id', data.paired_animal_id)
      .single();
    data.paired_animal = pareja || null;
  }

  // --- BLOQUE TEMPORAL DE DIAGNÓSTICO ---
  // Esto no expone ninguna clave secreta, solo el host de Supabase al que
  // se ha conectado esta petición en concreto, y la hora exacta de la
  // consulta, para descartar de un vistazo si hay algún problema de
  // variables de entorno o de despliegue. Se puede quitar después.
  data._debug = {
    supabaseHost: (process.env.SUPABASE_URL || 'NO_CONFIGURADA').replace('https://', ''),
    queriedAt: new Date().toISOString(),
  };
  // --- FIN BLOQUE TEMPORAL ---

  return noStoreJson(data);
}
