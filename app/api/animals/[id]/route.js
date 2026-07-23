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

export async function GET(request, { params }) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('animals')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return noStoreJson(data);
}

export async function PUT(request, { params }) {
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
    excludeId: params.id,
  });

  if (!slugResult.ok) {
    return NextResponse.json({ error: slugResult.error }, { status: 409 });
  }

  const { data: animalAntes } = await supabase
    .from('animals')
    .select('paired_animal_id')
    .eq('id', params.id)
    .single();

  const { data, error } = await supabase
    .from('animals')
    .update({
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
    })
    .eq('id', params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await syncAnimalPairing({
    supabase,
    animalId: params.id,
    oldPairedId: animalAntes?.paired_animal_id || null,
    newPairedId: body.pairedAnimalId || null,
  });

  return NextResponse.json(data);
}

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('animals').delete().eq('id', params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
