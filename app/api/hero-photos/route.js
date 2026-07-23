import { NextResponse } from 'next/server';

// Evita que Next.js cachee esta ruta como estatica: siempre debe leer
// los datos mas recientes de la base de datos.
export const dynamic = 'force-dynamic';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

// GET /api/hero-photos -> lista pública de fotos del carrusel de portada
export async function GET() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('hero_photos')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST /api/hero-photos -> añade una foto ya subida (solo cuentas del panel)
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const body = await request.json();
  if (!body.url) {
    return NextResponse.json({ error: 'Falta la URL de la foto' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('hero_photos')
    .insert([{ url: body.url }])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
