import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/admin/login',
  },
});

// Protege /admin (el panel principal) y todo lo que hay debajo de /admin/,
// excepto la propia página de login. Las rutas de API que modifican datos
// se comprueban además dentro de cada route.js por seguridad extra.
export const config = {
  matcher: ['/admin', '/admin/((?!login).*)'],
};
