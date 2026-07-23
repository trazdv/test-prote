"""
Regenera favicon.ico, apple-touch-icon.png y favicon-32x32.png a partir de
public/logo.svg. Solo hace falta ejecutarlo cuando cambiéis el logo.

Requiere Python 3 instalado. Instala las dependencias una vez con:
    pip install cairosvg pillow

Y ejecuta el script con:
    python scripts/generate-favicons.py

Si no tenéis Python a mano, también podéis generar estos mismos archivos
subiendo vuestro logo.svg a una web como https://realfavicongenerator.net
y guardando los resultados directamente en la carpeta public/.
"""
import io
import cairosvg
from PIL import Image

SVG_PATH = "public/logo.svg"

sizes = [16, 32, 48, 180]
pngs = {}
for s in sizes:
    png_bytes = cairosvg.svg2png(url=SVG_PATH, output_width=s, output_height=s)
    pngs[s] = Image.open(io.BytesIO(png_bytes)).convert("RGBA")

pngs[16].save("public/favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
pngs[180].save("public/apple-touch-icon.png", format="PNG")
pngs[32].save("public/favicon-32x32.png", format="PNG")

print("Listo: favicon.ico, apple-touch-icon.png y favicon-32x32.png actualizados.")
