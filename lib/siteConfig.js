/**
 * ============================================================
 *  CONFIGURACIÓN GENERAL DE LA WEB
 * ============================================================
 *  Este es el ÚNICO archivo que necesitas tocar para personalizar
 *  textos, nombre de la protectora, redes sociales y el enlace
 *  a los formularios de Google Forms.
 *
 *  Los colores de marca se cambian en tailwind.config.js
 *  (colores brand.cream y brand.dark).
 * ============================================================
 */

export const siteConfig = {
  nombreProtectora: 'Ayuda Animal Murcia',
  eslogan: 'Cada huella cuenta una historia. Ayúdanos a encontrarles un hogar.',
  descripcionCorta:
    'Somos una protectora de animales sin ánimo de lucro. Rescatamos, cuidamos y buscamos un hogar responsable para perros, gatos y otros animales que lo necesitan.',

  contacto: {
    email: 'info@ayudaanimalmurcia.org',
    telefono: '+34 600 000 000',
    direccion: 'Calle Ejemplo 12, Murcia',
    instagram: 'https://instagram.com/ayudaanimalmurcia',
    facebook: 'https://facebook.com/ayudaanimalmurcia',
  },

  // Especies disponibles para el desplegable de filtros y del formulario de alta.
  especies: ['Perro', 'Gato', 'Pájaro', 'Conejo', 'Otro'],

  // Etiquetas frecuentes que se pueden asignar a un animal (se pueden añadir más
  // libremente desde el panel de administración, esto es solo una lista de sugerencias).
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
    iban: 'ES00 0000 0000 0000 0000 0000',
    bizumCodigo: '00000',
    teamingUrl: 'https://www.teaming.net/ayudaanimalprotectorademurcia',
  },

  /**
   * ---------------------------------------------------------
   * GOOGLE FORMS
   * ---------------------------------------------------------
   * Aquí se configuran los dos formularios (adopción y acogida).
   * En el README se explica paso a paso cómo obtener estos datos
   * desde tu propio Google Form (la URL de envío y los "entry.XXXX"
   * de cada campo).
   */
  googleForms: {
    adopcion: {
      // URL de envío del formulario, termina en /formResponse
      actionUrl: 'https://docs.google.com/forms/d/e/TU_ID_DE_FORMULARIO/formResponse',
      // Relaciona cada campo de nuestro formulario con el "entry.XXXXXXX" de Google Forms
      entries: {
        nombreSolicitante: 'entry.111111111',
        email: 'entry.222222222',
        telefono: 'entry.333333333',
        mensaje: 'entry.444444444',
        nombreAnimal: 'entry.555555555',
        tipoSolicitud: 'entry.666666666',
      },
    },
    acogida: {
      actionUrl: 'https://docs.google.com/forms/d/e/TU_ID_DE_FORMULARIO_ACOGIDA/formResponse',
      entries: {
        nombreSolicitante: 'entry.111111111',
        email: 'entry.222222222',
        telefono: 'entry.333333333',
        mensaje: 'entry.444444444',
        nombreAnimal: 'entry.555555555',
        tipoSolicitud: 'entry.666666666',
      },
    },
  },
};
