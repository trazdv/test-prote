import { NextResponse } from 'next/server';

// Evita que Next.js cachee esta ruta como estatica: siempre debe leer
// los datos mas recientes de la base de datos.
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

const BUCKETS_PERMITIDOS = ['animal-photos', 'campaign-photos', 'hero-photos'];

// POST /api/upload -> sube una imagen al bucket de Supabase Storage indicado
// y devuelve la URL pública para guardarla junto al animal o campaña.
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file');
  const bucketSolicitado = formData.get('bucket') || 'animal-photos';
  const bucket = BUCKETS_PERMITIDOS.includes(bucketSolicitado) ? bucketSolicitado : 'animal-photos';

  if (!file) {
    return NextResponse.json({ error: 'No se recibió ningún archivo' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(fileName, buffer, { contentType: file.type, upsert: false });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);

  return NextResponse.json({ url: data.publicUrl });
}
