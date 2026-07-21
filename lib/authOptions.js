import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

/**
 * Sistema de login del panel de administración.
 *
 * Las cuentas (usuario + contraseña cifrada + rol) se guardan en la tabla
 * `admin_users` de Supabase, NUNCA en el código fuente. Las contraseñas se
 * guardan siempre cifradas con bcrypt; nadie (ni el equipo técnico, ni un
 * atacante que viera la base de datos) puede leer la contraseña original.
 *
 * Hay dos roles:
 * - "superadmin": además de gestionar animales, puede crear y eliminar
 *   cuentas de otros voluntarios desde /admin/usuarios.
 * - "voluntario": puede gestionar animales, pero no ve la gestión de cuentas.
 *
 * La sesión se guarda como un JWT firmado con NEXTAUTH_SECRET (variable de
 * entorno, nunca en el código).
 */

export const authOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 8, // 8 horas
  },
  pages: {
    signIn: '/admin/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Credenciales',
      credentials: {
        username: { label: 'Usuario', type: 'text' },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const supabase = getSupabaseAdmin();
        const { data: account } = await supabase
          .from('admin_users')
          .select('id, username, password_hash, role')
          .eq('username', credentials.username)
          .single();

        if (!account) {
          return null;
        }

        const passwordMatches = await bcrypt.compare(
          credentials.password,
          account.password_hash
        );

        if (!passwordMatches) {
          return null;
        }

        return { id: account.id, name: account.username, role: account.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.userId;
      }
      return session;
    },
  },
};
