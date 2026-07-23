import { NextResponse } from 'next/server';

// Evita que Next.js cachee esta ruta como estatica: siempre debe leer
// los datos mas recientes de la base de datos.
export const dynamic = 'force-dynamic';
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

  return noStoreJson(data);
}
