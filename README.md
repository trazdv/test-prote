# 🐾 Guía completa: cómo publicar y mantener la web de la protectora

Esta guía está pensada para que **cualquier voluntario, aunque no tenga conocimientos técnicos**,
pueda poner la web en marcha y mantenerla en el futuro. Ve siguiendo los pasos en orden, no hace
falta saltarse nada.

> 📌 **¿Ya tenías un proyecto de Supabase creado de una versión anterior?** Solo tienes que volver
> a ejecutar el archivo `sql/schema.sql` completo en el SQL Editor: los `create table if not
> exists` y `alter table ... add column if not exists` no tocan lo que ya tenías, y añadirán las
> tablas y columnas nuevas (campañas, fotos de portada, y la URL personalizada de cada animal y
> campaña) sin borrar nada de lo que ya tuvieras. Si ya tenías animales o campañas creados antes de
> añadir las URLs personalizadas, el propio script les genera una automáticamente a partir de su
> nombre.

Todo lo que usamos tiene un **plan gratuito** suficiente para una protectora normal. Lo único que
tendrás que pagar seguro es el **dominio** (el nombre de la web, tipo `protectoraamigospeludos.org`),
que cuesta entre 10 y 20 €/año. Al final de esta guía tienes un resumen de costes.

---

## 0. Resumen de las piezas que vamos a montar

| Pieza | Para qué sirve | Servicio recomendado | Coste |
|---|---|---|---|
| Código de la web | El diseño y la lógica | Ya lo tienes en este proyecto | Gratis |
| Hosting (dónde "vive" la web) | Que la web esté online 24/7 | Vercel | Gratis (plan Hobby) |
| Base de datos + fotos | Guardar los animales y sus imágenes | Supabase | Gratis (plan Free) |
| Dominio | La dirección de tu web | Namecheap, Google Domains, IONOS... | ~10-20 €/año |
| Formularios | Recibir solicitudes de adopción/acogida | Google Forms | Gratis |

---

## 1. Requisitos previos

1. Una cuenta de **GitHub** (gratis): https://github.com/signup
2. Una cuenta de **Vercel** (gratis, puedes entrar con tu cuenta de GitHub): https://vercel.com
3. Una cuenta de **Supabase** (gratis, puedes entrar con GitHub): https://supabase.com
4. Tener **Node.js** instalado en tu ordenador (solo para hacer pruebas antes de publicar):
   https://nodejs.org (descarga la versión "LTS")
5. Un editor de texto/código, por ejemplo **Visual Studio Code** (gratis): https://code.visualstudio.com

---

## 2. Sube el proyecto a GitHub

GitHub es donde guardamos el código, y desde ahí Vercel lo publicará automáticamente.

1. Descomprime la carpeta del proyecto que te hemos dado.
2. Crea un repositorio nuevo en GitHub (botón verde "New").
   - Dale un nombre, por ejemplo `web-protectora`.
   - No marques ninguna casilla de "Add README" (ya tenemos uno).
3. En tu ordenador, abre una terminal dentro de la carpeta del proyecto y ejecuta:

```bash
git init
git add .
git commit -m "Primera versión de la web"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/web-protectora.git
git push -u origin main
```

(Sustituye `TU-USUARIO` por tu usuario de GitHub). Si es la primera vez que usas Git, te pedirá que
inicies sesión: sigue las instrucciones en pantalla.

> El archivo `.gitignore` ya está configurado para que nunca subas contraseñas ni claves secretas
> a GitHub por error.

---

## 3. Configura la base de datos (Supabase)

1. Entra en https://supabase.com y crea un **nuevo proyecto**.
   - Elige un nombre, una contraseña para la base de datos (guárdala en un lugar seguro) y la
     región más cercana a España (por ejemplo, "Central EU (Frankfurt)").
   - Espera 1-2 minutos a que se cree.
2. Ve a la pestaña **SQL Editor** (icono de terminal en el menú lateral).
3. Abre el archivo `sql/schema.sql` de este proyecto, copia todo su contenido y pégalo en el editor.
   Dale a **Run**. Esto crea la tabla de animales y el almacén de fotos automáticamente.
4. Ve a **Project Settings > API** (rueda dentada, abajo a la izquierda). Ahí verás:
   - **Project URL** → esto es tu `SUPABASE_URL` y también `NEXT_PUBLIC_SUPABASE_URL` (es el mismo valor).
   - **anon public key** → esto es tu `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
   - **service_role key** (dale a "Reveal") → esto es tu `SUPABASE_SERVICE_ROLE_KEY`.
     ⚠️ Esta clave es muy poderosa (tiene acceso total a la base de datos). No la compartas ni la
     pongas nunca en el código: solo va en las variables de entorno, como se explica más adelante.

---

## 4. Crea la primera cuenta (superadmin)

Las cuentas de acceso al panel (usuario, contraseña cifrada y rol) se guardan en la base de datos,
en la tabla `admin_users` que ya creaste en el paso 3. Hay dos roles:

- **superadmin**: gestiona animales **y** puede crear/eliminar cuentas de otros voluntarios.
- **voluntario**: solo gestiona animales (crear, editar, eliminar fichas).

Una vez haya al menos un superadmin, todo lo demás (crear más cuentas, eliminarlas cuando alguien
deja la protectora) se hace desde el propio panel web, en **Gestionar cuentas**. Pero la primera
cuenta hay que crearla a mano, una única vez:

1. En tu ordenador, dentro de la carpeta del proyecto, genera el hash de la contraseña que quieras:

```bash
npm install
npm run hash-password "LaContraseñaQueQuieras"
```

2. Te aparecerá un texto largo tipo `$2a$10$...`. Cópialo.
3. Ve a Supabase > **SQL Editor** y ejecuta esto, sustituyendo el usuario y pegando tu hash:

```sql
insert into admin_users (username, password_hash, role)
values ('admin', 'PEGA_AQUI_EL_HASH_GENERADO', 'superadmin');
```

Con eso ya puedes iniciar sesión en `/admin/login` con ese usuario y la contraseña original (sin
cifrar) que elegiste en el paso 1. A partir de aquí, entra en **Gestionar cuentas** dentro del
panel para crear una cuenta para cada voluntario, con su propio usuario y contraseña.

---

## 5. Publica la web en Vercel

1. Entra en https://vercel.com, dale a **Add New > Project**.
2. Selecciona el repositorio `web-protectora` que subiste a GitHub.
3. Antes de darle a "Deploy", despliega la sección **Environment Variables** y añade estas
   (los valores los sacaste en los pasos 3 y 4):

| Nombre | Valor |
|---|---|
| `SUPABASE_URL` | La Project URL de Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | La service_role key de Supabase |
| `NEXT_PUBLIC_SUPABASE_URL` | La misma Project URL de Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | La anon public key de Supabase |
| `NEXTAUTH_SECRET` | Un texto aleatorio largo (puedes generarlo en https://generate-secret.vercel.app/32) |
| `NEXTAUTH_URL` | La URL final de tu web, ej. `https://www.protectoraamigospeludos.org` (de momento puedes poner la URL que te dé Vercel, tipo `https://web-protectora.vercel.app`, y cambiarla luego) |

4. Dale a **Deploy**. En 1-2 minutos tendrás tu web publicada en una URL tipo
   `https://web-protectora.vercel.app`. ¡Pruébala!

> Cada vez que hagas un cambio en el código y lo subas a GitHub (`git push`), Vercel actualizará
> la web sola, automáticamente, en un par de minutos.

---

## 6. Compra y conecta tu dominio propio

1. Compra el dominio en cualquier proveedor: Namecheap, IONOS, GoDaddy, OVH, Google Domains
   (ahora Squarespace Domains), etc. Busca que esté disponible algo como `protectoraamigospeludos.org` o `.es`.
2. En tu proyecto de Vercel, ve a **Settings > Domains** y añade tu dominio.
3. Vercel te dará unos registros DNS (normalmente un registro tipo `A` o `CNAME`). Copia esos
   valores y pégalos en el panel de tu proveedor de dominios, en la sección "DNS" o "Zona DNS".
4. Espera entre 10 minutos y unas horas a que se propague (es normal que tarde). Vercel te avisará
   cuando esté todo correcto y añadirá el certificado HTTPS (candado verde) automáticamente y gratis.
5. Actualiza la variable `NEXTAUTH_URL` en Vercel con tu dominio final (ej.
   `https://www.protectoraamigospeludos.org`) y vuelve a desplegar (Vercel > Deployments > ⋯ > Redeploy).

---

## 7. Que aparezcáis en Google al buscar "Ayuda Animal"

La web ya viene preparada técnicamente para un buen SEO (metadatos, mapa del sitio automático en
`/sitemap.xml`, `robots.txt`, datos estructurados para que Google entienda que sois una ONG). Pero
aparecer bien posicionados, por encima de vuestras redes sociales, no es instantáneo: Google tarda
días o semanas en "descubrir" una web nueva, y el resto depende de estos pasos:

1. **Da de alta la web en Google Search Console** (gratis): entra en
   https://search.google.com/search-console, añade tu dominio (`ayudaanimalmurcia.org`) como
   propiedad, y verifica que eres el propietario (Google te dará un registro TXT para añadir en el
   DNS de IONOS, muy parecido a como añadiste el registro A).
2. Una vez verificado, en el menú **Sitemaps**, envía la URL `https://www.ayudaanimalmurcia.org/sitemap.xml`.
   Esto ya incluye automáticamente todos los animales y campañas, y se actualiza solo cuando añadís
   nuevos.
3. **Enlaza tu web desde Instagram y Facebook** (en la biografía/enlace de cada perfil). Estos
   enlaces desde perfiles que ya tienen autoridad ayudan mucho a que Google confíe antes en la web
   nueva.
4. Ten paciencia: es normal que la web tarde entre 2 y 8 semanas en empezar a aparecer bien en los
   resultados, y que gane posiciones poco a poco a medida que se actualiza con nuevos animales y
   campañas (Google valora el contenido que se mantiene vivo).
5. Si quieres actualizar más adelante los textos que aparecen en el resultado de búsqueda (título y
   descripción), edita el `title` y la `description` dentro del bloque `metadata` en `app/layout.js`.

## 8. Los formularios (adopción, acogida y voluntariado)

Esto ahora es muy sencillo: los botones de la web ("¡Quiero adoptarlo!", "¡Quiero acogerlo!",
"Hazte voluntario"...) son enlaces normales que abren tu Google Form correspondiente **en una
pestaña nueva**. No hay ninguna integración compleja ni envío automático: el visitante rellena el
formulario directamente en Google, y vosotros recibís la respuesta igual que siempre (por email o
en una hoja de cálculo si vinculas el formulario a Google Sheets).

Todos los enlaces se guardan en un único sitio: `lib/siteConfig.js`, apartado
`formulariosExternos`:

```js
formulariosExternos: {
  adopcion: {
    perro_cachorro: '...',
    perro_adulto: '...',
    gato_cachorro: '...',
    gato_adulto: '...',
  },
  acogida: '...',
  voluntariado: '...',
  voluntariadoUmu: '...',
},
```

**¿Cómo sabe la web a qué formulario enlazar el botón "¡Quiero adoptarlo!"?** Se calcula
automáticamente combinando dos datos de la ficha del animal:
- El **tipo de animal** (Perro o Gato).
- La **categoría** (Cachorro o Adulto), un campo obligatorio al crear o editar un animal.

Si en algún momento cambias alguno de los 7 enlaces (por ejemplo, si recreas un formulario en
Google Forms y te da una URL nueva), solo tienes que sustituir esa URL en este archivo, guardar,
y hacer `git add . && git commit -m "Actualizar enlaces de formularios" && git push`.

> 💡 Consejo: en cada Google Form, ve a la pestaña **Respuestas > vincular con Hojas de cálculo**
> para que todas las solicitudes que lleguen se guarden ordenadas en un Google Sheet automáticamente.

## 9. Cómo añadir y gestionar animales (uso diario)

1. Entra en tu web y ve a `/admin/login` (hay un enlace discreto "Acceso al panel (equipo)" al
   final de la página, en el pie).
2. Inicia sesión con el usuario y contraseña que configuraste.
3. Desde el panel puedes:
   - **Añadir animal**: nombre, tipo (Perro o Gato), sexo, edad, descripción, etiquetas y varias
     fotos.
   - **Categoría (obligatorio)**: además, hay que elegir siempre **Cachorro** o **Adulto**. Junto
     con el tipo de animal, esto decide automáticamente a cuál de los 4 formularios de adopción
     (perro cachorro / perro adulto / gato cachorro / gato adulto) enlaza el botón
     "¡Quiero adoptarlo!" de su ficha.
   - **Editar** cualquier ficha existente.
   - **Eliminar** un animal cuando ya ha sido adoptado.
4. Usa la etiqueta **"Acogida"** en los animales que también admitan acogida temporal: al hacerlo,
   aparecerá automáticamente el botón "¡Quiero acogerlo!" en su ficha (este es el mismo formulario
   de acogida para cualquier tipo de animal).

> 📌 Los animales que no sean perro ni gato (casos especiales) se gestionan en privado, sin
> formulario público: el desplegable de tipo de animal solo ofrece Perro y Gato a propósito.

### Gestionar campañas (campamentos, sorteos, merchandising...)

Desde el botón **"Gestionar campañas"** del panel puedes crear una campaña con título, fechas de
inicio y fin (la de fin es opcional; si la dejas vacía, la campaña se muestra como activa
indefinidamente), fotos, una descripción general y el cuadro **"¿Te interesa?"**, donde explicas
cómo participar o comprar (por ejemplo, a quién escribir, el precio, el enlace de compra, etc.).
Las campañas cuya fecha de hoy esté entre el inicio y el fin aparecen automáticamente en el
carrusel de la página principal y en la pestaña "Campañas".

### Carrusel de fotos de la portada

Desde **"Carrusel de portada"** en el panel puedes subir las fotos que quieras que roten
automáticamente en la imagen grande de la página principal, y eliminarlas cuando quieras. Si no
subes ninguna, se muestra una ilustración de ejemplo.

### URL personalizada de cada animal y campaña

Al crear un animal o una campaña, verás un campo **"URL de la ficha"** que se rellena solo a partir
del nombre (por ejemplo, "Elvis" → `elvis`), pero puedes escribir la que prefieras. Esto es útil
cuando hay dos animales con el mismo nombre a la vez: a uno le puedes poner `elvis` y al otro
`elvis-2`, por ejemplo. Si la URL que escribes ya está en uso, la web te avisará para que elijas
otra antes de guardar.

### Gestionar cuentas de voluntarios (solo superadmin)

Si tu cuenta es de tipo **superadmin**, verás un botón **"Gestionar cuentas"** en el panel. Ahí puedes:

- **Crear una cuenta nueva** para cada voluntario que se una, eligiendo su usuario, contraseña y
  rol (voluntario o superadmin).
- **Eliminar una cuenta** el día que esa persona deje la protectora: en cuanto la borres, dejará de
  poder iniciar sesión inmediatamente, sin que tengas que cambiar ninguna contraseña compartida.
- El sistema no te dejará eliminar tu propia cuenta mientras la tienes abierta, ni eliminar el
  último superadmin que quede, para que nunca os quedéis sin acceso al panel por error.
- Las contraseñas nunca se muestran en ningún sitio (ni en esta pantalla, ni en la base de datos):
  se cifran en el momento de crearlas y no se pueden volver a leer, solo comprobar al iniciar sesión.

---

## 10. Cómo personalizar la web en el futuro

Todo lo que un voluntario nuevo necesita tocar está muy localizado, para que no haga falta saber
programar:

- **Textos generales, contacto, redes sociales, formularios de Google y datos de donación**:
  archivo `lib/siteConfig.js` (IBAN, código de Bizum y enlace de Teaming se editan en el apartado
  `donaciones`).
- **Colores de la marca**: archivo `tailwind.config.js`, apartado `colors.brand`
  (`cream` y `dark`; el blanco es el fondo por defecto).
- **Imagen de portada de la home**: sustituye el archivo `public/hero-animals.svg` por tu propia
  imagen (puede ser `.jpg` o `.png`, solo cambia también la referencia en `app/page.js`).
- **Icono de la pestaña del navegador (favicon)**: se genera automáticamente a partir de
  `public/logo.svg`. El día que sustituyas el logo por el definitivo, regenera también
  `favicon.ico`, `favicon-32x32.png` y `apple-touch-icon.png` ejecutando
  `python scripts/generate-favicons.py` (requiere Python y `pip install cairosvg pillow` una vez),
  o subiendo tu logo a https://realfavicongenerator.net si no tienes Python a mano.
- **Formulario de "Hazte voluntario"**: de momento tiene nombre, email, teléfono, disponibilidad y
  un mensaje libre. En cuanto nos digas los campos exactos que quieres, se ajusta el formulario y
  su `googleForms.voluntariado` en `lib/siteConfig.js` igual que se hizo con adopción/acogida.
- **Cambiar la contraseña de una cuenta**: de momento no hay un botón de "cambiar contraseña", así
  que la forma más sencilla es que el superadmin elimine esa cuenta desde "Gestionar cuentas" y
  cree una nueva para esa misma persona con la contraseña nueva.
- **Pasar el proyecto a otro equipo de voluntarios**: solo tienen que tener acceso al repositorio
  de GitHub y a las cuentas de Vercel/Supabase (o se les puede invitar como miembros del equipo
  dentro de esas plataformas, sin compartir contraseñas).

---

## 11. Seguridad: cómo funcionan las cuentas y el login

- Cada voluntario tiene su **propia cuenta** (usuario + contraseña), guardada en la tabla
  `admin_users` de Supabase. La contraseña **nunca se guarda como texto plano**: se guarda cifrada
  (hash bcrypt) desde el momento en que se crea, tanto si la crea el superadmin desde el panel como
  si se creó la primera cuenta a mano. Nadie puede leer la contraseña original a partir de la base
  de datos, ni siquiera con acceso completo a Supabase.
- Hay dos roles: **voluntario** (gestiona animales) y **superadmin** (además, gestiona las cuentas
  de los demás). Esto permite que, cuando un voluntario deja la protectora, el superadmin elimine
  su cuenta y esa persona pierda el acceso al instante, sin tener que cambiar una contraseña
  compartida entre todo el equipo.
- La tabla `admin_users` tiene la seguridad a nivel de fila (RLS) activada **sin ninguna política
  pública**: eso significa que nadie puede leerla ni modificarla usando la clave pública del
  navegador, solo el servidor (con la service_role key) puede hacerlo, y siempre después de
  comprobar la sesión y el rol.
- Las páginas de administración (`/admin/*`) están protegidas por un middleware que comprueba la
  sesión en cada visita; si no has iniciado sesión, te redirige al login automáticamente. Además,
  crear/eliminar cuentas se comprueba también en el propio servidor (no solo en la pantalla), así
  que un voluntario normal no puede acceder a "Gestionar cuentas" aunque cambiara la URL a mano.
- La clave "todopoderosa" de la base de datos (`service_role`) solo existe en el servidor (Vercel),
  nunca llega al navegador del visitante.
- Las visitas normales a la web solo pueden **leer** los animales (a través de una clave pública de
  solo lectura protegida por las políticas de seguridad de Supabase), nunca modificar nada.

---

## 12. Resumen de costes estimados

| Concepto | Coste aproximado |
|---|---|
| Dominio (.org / .es / .com) | 10-20 €/año |
| Hosting en Vercel (plan Hobby) | Gratis (de sobra para una protectora) |
| Base de datos + fotos en Supabase (plan Free) | Gratis (hasta 500 MB de base de datos y 1 GB de fotos; si algún día se queda corto, el plan de pago empieza en unos 25 $/mes) |
| Google Forms | Gratis |
| **Total aproximado** | **10-20 € al año** |

Si en el futuro la protectora tiene presupuesto y quiere quitar cualquier límite del plan gratuito
(por ejemplo, si sube muchísimas fotos en alta resolución), se puede pasar a un plan de pago de
Supabase o Vercel sin tener que cambiar nada del código.

---

## 13. ¿Y si algo falla?

- Si la web no arranca en Vercel, mira la pestaña **Deployments > (último deploy) > Building** para
  ver el error exacto: casi siempre es una variable de entorno mal copiada.
- Si no puedes iniciar sesión en el panel: comprueba que existe la cuenta en la tabla
  `admin_users` de Supabase (Table Editor > admin_users) y que escribes bien el usuario y la
  contraseña. Si necesitas crear otra cuenta superadmin de emergencia, repite el paso 4 con un
  nuevo usuario.
- Si las fotos no se suben: revisa en Supabase > Storage que el bucket `animal-photos` existe y es
  público, y que `SUPABASE_SERVICE_ROLE_KEY` está bien copiada.
- Si el formulario de adopción no llega a Google: repasa el paso 7, sobre todo que la URL termine
  en `/formResponse` y que los `entry.XXXXX` coincidan exactamente con el orden de tus campos.

¡Y con esto ya tienes todo lo necesario para que la web funcione durante años, pase quien pase por
la protectora! 🐾
