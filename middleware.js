import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/admin/login',
  },
});

// Protege todo lo que hay bajo /admin excepto la propia página de login,
// y protege también las rutas de API que modifican animales (POST/PUT/DELETE
// se comprueban además dentro de cada route.js por seguridad extra).
export const config = {
  matcher: ['/admin/((?!login).*)'],
};
