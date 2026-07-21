import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

// GET /api/animals -> lista pública de animales (con filtros opcionales)
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const especie = searchParams.get('especie');
  const sexo = searchParams.get('sexo');

  const supabase = getSupabaseAdmin();
  let query = supabase.from('animals').select('*').order('created_at', { ascending: false });

  if (especie) query = query.eq('species', especie);
  if (sexo) query = query.eq('sex', sexo);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST /api/animals -> crear un animal nuevo (solo admin logeado)
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const body = await request.json();
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('animals')
    .insert([
      {
        name: body.name,
        species: body.species,
        sex: body.sex,
        age: body.age,
        description: body.description,
        tags: body.tags || [],
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
