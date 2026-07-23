import { slugify } from '@/lib/slugify';

/**
 * Normaliza el slug propuesto y comprueba que no lo esté usando ya otro
 * registro de la misma tabla (animals o campaigns).
 *
 * Devuelve { ok: true, slug } o { ok: false, error }.
 */
export async function ensureUniqueSlug({ supabase, table, desiredSlug, fallbackText, excludeId }) {
  const base = slugify(desiredSlug) || slugify(fallbackText);

  if (!base) {
    return { ok: false, error: 'No se ha podido generar una URL válida. Usa letras y números.' };
  }

  let query = supabase.from(table).select('id').eq('slug', base);
  if (excludeId) {
    query = query.neq('id', excludeId);
  }
  const { data: existentes, error } = await query;

  if (error) {
    return { ok: false, error: error.message };
  }

  if (existentes && existentes.length > 0) {
    return {
      ok: false,
      error: `La URL "${base}" ya está en uso por otro elemento. Prueba con otra, por ejemplo "${base}-2".`,
    };
  }

  return { ok: true, slug: base };
}
