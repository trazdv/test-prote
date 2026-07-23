import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

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

  return NextResponse.json(data);
}
