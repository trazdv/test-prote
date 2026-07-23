import { NextResponse } from 'next/server';

// Evita que Next.js cachee esta ruta como estatica: siempre debe leer
// los datos mas recientes de la base de datos.
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'superadmin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  if (session.user.id === params.id) {
    return NextResponse.json(
      { error: 'No puedes eliminar tu propia cuenta mientras estás conectado con ella.' },
      { status: 400 }
    );
  }

  const supabase = getSupabaseAdmin();

  // Evitamos quedarnos sin ningún superadmin en el sistema.
  const { data: target } = await supabase
    .from('admin_users')
    .select('role')
    .eq('id', params.id)
    .single();

  if (target?.role === 'superadmin') {
    const { count } = await supabase
      .from('admin_users')
      .select('id', { count: 'exact', head: true })
      .eq('role', 'superadmin');

    if ((count || 0) <= 1) {
      return NextResponse.json(
        { error: 'Debe quedar al menos un superadmin. Crea otro antes de eliminar este.' },
        { status: 400 }
      );
    }
  }

  const { error } = await supabase.from('admin_users').delete().eq('id', params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
