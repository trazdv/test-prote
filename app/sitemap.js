import { siteConfig } from '@/lib/siteConfig';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

// Next.js genera automáticamente /sitemap.xml a partir de este archivo.
// Ayuda a que Google encuentre y indexe todas las páginas de la web,
// incluidas las fichas de animales y campañas (que se generan dinámicamente).
export default async function sitemap() {
  const base = siteConfig.url;

  const paginasEstaticas = [
    { url: `${base}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/animales`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/campanas`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/donar`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/voluntariado`, changeFrequency: 'monthly', priority: 0.5 },
  ];

  let paginasAnimales = [];
  let paginasCampanas = [];

  try {
    const supabase = getSupabaseAdmin();

    const { data: animales } = await supabase.from('animals').select('slug, created_at');
    if (animales) {
      paginasAnimales = animales
        .filter((a) => a.slug)
        .map((a) => ({
          url: `${base}/animales/${a.slug}`,
          lastModified: a.created_at,
          changeFrequency: 'weekly',
          priority: 0.8,
        }));
    }

    const { data: campanas } = await supabase.from('campaigns').select('slug, created_at');
    if (campanas) {
      paginasCampanas = campanas
        .filter((c) => c.slug)
        .map((c) => ({
          url: `${base}/campanas/${c.slug}`,
          lastModified: c.created_at,
          changeFrequency: 'weekly',
          priority: 0.6,
        }));
    }
  } catch (err) {
    // Si la base de datos no está disponible en el momento del build,
    // devolvemos igualmente el sitemap con las páginas estáticas.
  }

  return [...paginasEstaticas, ...paginasAnimales, ...paginasCampanas];
}
