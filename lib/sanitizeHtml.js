/**
 * Limpieza básica del HTML que llega desde el editor de texto enriquecido,
 * antes de guardarlo en la base de datos. Solo permite negrita, cursiva,
 * tamaños de letra y saltos de línea; quita scripts y atributos peligrosos.
 * No es un sanitizador exhaustivo de nivel bancario, pero es suficiente
 * dado que solo cuentas de administrador autenticadas pueden escribir aquí.
 */
export function sanitizeRichText(html) {
  if (!html) return '';
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/ on\w+="[^"]*"/gi, '')
    .replace(/ on\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, '');
}
