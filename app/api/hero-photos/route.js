import { NextResponse } from 'next/server';

// Evita que Next.js cachee esta ruta como estatica: siempre debe leer
// los datos mas recientes de la base de datos.
export const dynamic = 'force-dynamic';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { noStoreJson } from '@/lib/noStoreJson';

// GET /api/hero-photos -> lista pública de fotos del carrusel de portada, ordenadas
export async function GET() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('hero_photos')
    .select('*')
    .order('position', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return noStoreJson(data);
}

// POST /api/hero-photos -> añade una foto ya subida (solo cuentas del panel),
// colocándola al final del orden actual
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

  const { data: existentes } = await supabase
    .from('hero_photos')
    .select('position')
    .order('position', { ascending: false })
    .limit(1);

  const siguientePosicion = (existentes?.[0]?.position ?? -1) + 1;

  const { data, error } = await supabase
    .from('hero_photos')
    .insert([{ url: body.url, position: siguientePosicion }])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

// PUT /api/hero-photos -> reordena las fotos. Recibe { order: [id1, id2, id3, ...] }
// en el orden final deseado.
export async function PUT(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const body = await request.json();
  const orden = Array.isArray(body.order) ? body.order : [];

  const supabase = getSupabaseAdmin();

  await Promise.all(
    orden.map((id, index) =>
      supabase.from('hero_photos').update({ position: index }).eq('id', id)
    )
  );

  return NextResponse.json({ ok: true });
}
