/**
 * ============================================================
 *  CONFIGURACIÓN GENERAL DE LA WEB
 * ============================================================
 *  Este es el ÚNICO archivo que necesitas tocar para personalizar
 *  textos, nombre de la protectora, redes sociales y los enlaces
 *  a los formularios de Google Forms.
 *
 *  Los colores de marca se cambian en tailwind.config.js
 *  (colores brand.cream y brand.dark).
 * ============================================================
 */

export const siteConfig = {
  nombreProtectora: 'Ayuda Animal Murcia',
  // URL final de la web (con dominio propio). Cámbiala aquí cuando conectes
  // tu dominio: se usa para el SEO (Open Graph) y para generar el mapa del
  // sitio (sitemap.xml) que ayuda a Google a indexar todas las páginas.
  url: 'https://www.ayudaanimalmurcia.org',
  eslogan: 'Cada huella cuenta una historia. Ayúdanos a encontrarles un hogar.',
  descripcionCorta:
    'Somos una protectora de animales sin ánimo de lucro. Rescatamos, cuidamos y buscamos un hogar responsable para perros, gatos y otros animales que lo necesitan.',

  contacto: {
    email: 'ayudanimal_pm@hotmail.es',
    whatsapp: 'https://api.whatsapp.com/send?phone=34722196933',
    direccion: 'C. Campus Universitario, 7, Murcia',
    instagram: 'https://instagram.com/ayuda_animal_murcia',
    facebook: 'https://facebook.com/ayudanimalmurcia',
  },

  // Especies disponibles para el desplegable de filtros y del formulario de
  // alta. Solo perro y gato: el resto de animales (casos especiales) se
  // gestionan en privado y no aparecen en el filtro público.
  especies: ['Perro', 'Gato'],

  // Etiquetas frecuentes que se pueden asignar a un animal (se pueden añadir más
  // libremente desde el panel de administración, esto es solo una lista de sugerencias).
  // "Cachorro" y "Adulto" NO están aquí porque se gestionan con un campo obligatorio
  // aparte en el formulario (ver componente AnimalForm), no como etiqueta libre.
  etiquetasSugeridas: [
    'Acogida',
    'Urgente',
    'Esterilizado/a',
    'Vacunado/a',
    'Apto con niños',
    'Apto con otros animales',
    'Necesidades especiales',
  ],

  /**
   * ---------------------------------------------------------
   * DONACIONES
   * ---------------------------------------------------------
   * Rellena aquí los datos reales de la protectora. Aparecen en la
   * página /donar.
   */
  donaciones: {
    iban: 'ES22 0081 4243 2600 0183 7191',
    bizumCodigo: '12966',
    teamingUrl: 'https://www.teaming.net/ayudaanimalprotectorademurcia',
  },

  /**
   * ---------------------------------------------------------
   * FORMULARIOS EXTERNOS (Google Forms)
   * ---------------------------------------------------------
   * Los botones de la web ("¡Quiero adoptarlo!", "Hazte voluntario"...)
   * llevan directamente a estos enlaces, en una pestaña nueva. No hay
   * ninguna integración compleja: son enlaces normales.
   *
   * El formulario de adopción depende de la especie (Perro/Gato) y de si
   * el animal está etiquetado como "Cachorro" o "Adulto".
   */
  formulariosExternos: {
    adopcion: {
      perro_cachorro: 'https://forms.gle/UaxzdTC4uBwpdzPw9',
      perro_adulto: 'https://forms.gle/ZUCkfNX6L73xZbXN8',
      gato_cachorro: 'https://forms.gle/1YkVaBRSnDBdpxHD6',
      gato_adulto: 'https://forms.gle/MYkMXzfRt6UdtbfK9',
    },
    // Mismo formulario de acogida para cualquier animal.
    acogida: 'https://forms.gle/Z7qP6fuCZhUPbtwq9',
    voluntariado: 'https://forms.gle/hSzHG8tA2G4DYwWM7',
    voluntariadoUmu: 'https://forms.gle/r6CHR3UCQPBsuGnQA',
  },
};
