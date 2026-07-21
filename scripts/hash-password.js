/**
 * Genera el hash cifrado de una contraseña para usarlo como
 * ADMIN_PASSWORD_HASH en las variables de entorno.
 *
 * Uso:
 *   node scripts/hash-password.js "MiContraseñaSuperSecreta"
 */
const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
  console.log('Uso: node scripts/hash-password.js "TuContraseña"');
  process.exit(1);
}

bcrypt.hash(password, 10).then((hash) => {
  console.log('\nCopia este valor en la variable ADMIN_PASSWORD_HASH:\n');
  console.log(hash);
  console.log('');
});
