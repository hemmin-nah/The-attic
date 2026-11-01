# The Attic · v2

PWA en formato vertical para iPhone / móvil, lista para GitHub Pages.

## Novedades principales de esta versión

- **Ático mucho más amplio** y tratado como un pequeño universo.
- **Cada tipo de tesoro tiene su propio rincón**: películas, series, libros, videojuegos, cómics, manga, hobbies y recuerdos.
- **Diario independiente** con entradas, fecha, estado de ánimo y favoritos.
- **Estéticas diferenciadas**:
  - Ático melancólico en Manhattan
  - Ático folk en Kyoto
  - Iglú con pingüino
  - Cabaña entre pinos
  - Observatorio nocturno
- **Ventana temática** con paisaje acorde al mundo elegido.
- **Exportar / importar copia** en JSON.
- **PWA offline** con service worker.

## Instalación en GitHub Pages

1. Sube **todos los archivos** de esta carpeta a la raíz de un repositorio.
2. Ve a **Settings → Pages**.
3. En **Build and deployment**, selecciona:
   - **Source:** Deploy from a branch
   - **Branch:** `main`
   - **Folder:** `/ (root)`
4. Guarda y espera a que GitHub publique la web.
5. Abre la URL desde Safari en iPhone y usa **Compartir → Añadir a pantalla de inicio**.

## Estructura de archivos

- `index.html` → shell de la app
- `styles.css` → estilos móviles
- `app.js` → lógica de la PWA
- `pixel-world.js` → escenas y pixel art por temas / rincones
- `manifest.webmanifest` → configuración PWA
- `sw.js` → cache offline
- `assets/` → iconos

## Importante

- Los datos se guardan **en el navegador/dispositivo**.
- Si cambias de móvil o borras los datos del navegador, podrías perderlos si no exportas copia.
- Las imágenes de portada se reducen automáticamente para ocupar menos.

## Ideas para una v3

- Decoración desbloqueable por categorías.
- Más habitaciones / temas.
- Más mascotas y animaciones.
- Filtros avanzados y etiquetas.
- “Objeto físico” en la habitación para favoritos.
- Música ambiente opcional.
