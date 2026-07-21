import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

// GET /api/campaigns -> lista pública de campañas
export async function GET() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .order('start_date', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST /api/campaigns -> crear una campaña nueva (solo cuentas del panel)
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const body = await request.json();
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('campaigns')
    .insert([
      {
        title: body.title,
        description: body.description,
        info2: body.info2,
        start_date: body.start_date,
        end_date: body.end_date || null,
        photos: body.photos || [],
      },
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
