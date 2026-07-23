import { NextResponse } from 'next/server';

// Evita que Next.js cachee esta ruta como estatica: siempre debe leer
// los datos mas recientes de la base de datos.
export const dynamic = 'force-dynamic';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { noStoreJson } from '@/lib/noStoreJson';

export async function GET(request, { params }) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (error) {
    return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  }

  return noStoreJson(data);
}
