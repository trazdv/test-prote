import { NextResponse } from 'next/server';

// Evita que Next.js cachee esta ruta como estatica: siempre debe leer
// los datos mas recientes de la base de datos.
export const dynamic = 'force-dynamic';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { sanitizeRichText } from '@/lib/sanitizeHtml';
import { ensureUniqueSlug } from '@/lib/ensureUniqueSlug';

export async function GET(request, { params }) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json(data);
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
    table: 'campaigns',
    desiredSlug: body.slug,
    fallbackText: body.title,
    excludeId: params.id,
  });

  if (!slugResult.ok) {
    return NextResponse.json({ error: slugResult.error }, { status: 409 });
  }

  const { data, error } = await supabase
    .from('campaigns')
    .update({
      title: body.title,
      slug: slugResult.slug,
      description: sanitizeRichText(body.description),
      info2: sanitizeRichText(body.info2),
      start_date: body.start_date,
      end_date: body.end_date || null,
      photos: body.photos || [],
      cover_photo: body.coverPhoto || null,
    })
    .eq('id', params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('campaigns').delete().eq('id', params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
