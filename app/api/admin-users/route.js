import { NextResponse } from 'next/server';

// Evita que Next.js cachee esta ruta como estatica: siempre debe leer
// los datos mas recientes de la base de datos.
export const dynamic = 'force-dynamic';
import { getServerSession } from 'next-auth';
import bcrypt from 'bcryptjs';
import { authOptions } from '@/lib/authOptions';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

async function requireSuperadmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'superadmin') {
    return null;
  }
  return session;
}

// GET /api/admin-users -> lista de cuentas (sin exponer nunca el password_hash)
export async function GET() {
  const session = await requireSuperadmin();
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('admin_users')
    .select('id, username, role, created_at')
    .order('created_at', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST /api/admin-users -> crear una cuenta nueva de voluntario o superadmin
export async function POST(request) {
  const session = await requireSuperadmin();
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  const body = await request.json();
  const { username, password, role } = body;

  if (!username || !password) {
    return NextResponse.json({ error: 'Usuario y contraseña son obligatorios' }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: 'La contraseña debe tener al menos 8 caracteres' },
      { status: 400 }
    );
  }

  const supabase = getSupabaseAdmin();

  // La contraseña se cifra aquí, en el servidor, antes de guardarla.
  // En ningún momento se guarda en texto plano.
  const password_hash = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from('admin_users')
    .insert([{ username, password_hash, role: role === 'superadmin' ? 'superadmin' : 'voluntario' }])
    .select('id, username, role, created_at')
    .single();

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Ese nombre de usuario ya existe' }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
