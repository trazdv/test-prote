/**
 * Convierte un texto en una "slug" válida para usar en una URL:
 * quita acentos, pasa a minúsculas y sustituye cualquier cosa que
 * no sea letra/número por guiones.
 *
 * "Elvis" -> "elvis"
 * "Doña Manuela 2º" -> "dona-manuela-2"
 */
export function slugify(text) {
  return (text || '')
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quita acentos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
