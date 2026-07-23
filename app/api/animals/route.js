import { NextResponse } from 'next/server';

// Evita que Next.js cachee esta ruta como estatica: siempre debe leer
// los datos mas recientes de la base de datos.
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { noStoreJson } from '@/lib/noStoreJson';
import { sanitizeRichText } from '@/lib/sanitizeHtml';
import { ensureUniqueSlug } from '@/lib/ensureUniqueSlug';
import { syncAnimalPairing } from '@/lib/syncAnimalPairing';

// GET /api/animals -> lista pública de animales (con filtros opcionales)
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const especie = searchParams.get('especie');
  const sexo = searchParams.get('sexo');
  const etiqueta = searchParams.get('etiqueta');

  const supabase = getSupabaseAdmin();
  let query = supabase.from('animals').select('*').order('created_at', { ascending: false });

  if (especie) query = query.eq('species', especie);
  if (sexo) query = query.eq('sex', sexo);
  if (etiqueta) query = query.contains('tags', [etiqueta]);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return noStoreJson(data);
}

// POST /api/animals -> crear un animal nuevo (solo admin logeado)
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const body = await request.json();
  const supabase = getSupabaseAdmin();

  const slugResult = await ensureUniqueSlug({
    supabase,
    table: 'animals',
    desiredSlug: body.slug,
    fallbackText: body.name,
  });

  if (!slugResult.ok) {
    return NextResponse.json({ error: slugResult.error }, { status: 409 });
  }

  const { data, error } = await supabase
    .from('animals')
    .insert([
      {
        name: body.name,
        slug: slugResult.slug,
        species: body.species,
        sex: body.sex,
        age: body.age,
        description: sanitizeRichText(body.description),
        tags: body.tags || [],
        photos: body.photos || [],
        cover_photo: body.coverPhoto || null,
        paired_animal_id: body.pairedAnimalId || null,
      },
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (body.pairedAnimalId) {
    await syncAnimalPairing({
      supabase,
      animalId: data.id,
      oldPairedId: null,
      newPairedId: body.pairedAnimalId,
    });
  }

  return NextResponse.json(data, { status: 201 });
}
