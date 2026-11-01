# THE ATTIC · v1.0

Una pequeña PWA **para móvil, en vertical**, con habitaciones originales de pixel art, mascotas, una ventana interactiva y una colección personal de películas, series, libros, videojuegos, cómics, manga, hobbies, música y recuerdos.

## Publicar gratis en GitHub Pages

1. Crea un repositorio nuevo en GitHub, por ejemplo `the-attic`.
2. Sube **el contenido de esta carpeta** a la raíz del repositorio. Deben quedar `index.html`, `app.js`, `pixel-world.js`, `styles.css`, `manifest.webmanifest`, `sw.js` y la carpeta `assets` en la raíz.
3. En GitHub entra en **Settings → Pages**. En *Build and deployment*, elige **Deploy from a branch**, selecciona la rama `main` y `/ (root)` y guarda.
4. Cuando GitHub Pages termine de publicar, abre la URL indicada en Settings → Pages. Normalmente será `https://TU-USUARIO.github.io/the-attic/`.
5. En el iPhone, abre esa web desde **Safari → Compartir → Añadir a pantalla de inicio**.

No hace falta `npm`, Node, Firebase, API ni cuenta para usar The Attic.

## Funciones

- 5 ambientes: Manhattan, Kyoto, iglú, cabaña y observatorio.
- 6 mascotas: gato, perro, pingüino, zorro, conejo o cuervo. Puedes ponerles nombre.
- Habitación pixelada con objetos interactivos y acceso a rincones.
- Paisajes pixel art de día, al atardecer y de noche, con ambiente animado opcional. Se pueden guardar como postal PNG.
- Biblioteca con 9 tipos de tesoros: título, valoración 0–5 estrellas, opinión, favorito, estado, fecha, detalle, foto/portada, búsqueda, filtros y ordenación.
- Guardado local automático (IndexedDB; fallback de `localStorage`).
- Exportación e importación de copia `.json` con imágenes incluidas.
- Soporte offline tras abrirla desde una dirección HTTPS al menos una vez.
- Adaptada a la pantalla del iPhone; en ordenador aparece como una aplicación estrecha centrada.

## Privacidad y límites

**Tus datos permanecen en el navegador del dispositivo.** No hay servidor ni sincronización entre móviles. Eliminar datos de Safari, usar navegación privada o borrar la web app puede hacer que desaparezcan. **Descarga periódicamente una copia de seguridad** en `Mi mundo` y guárdala en Archivos/iCloud Drive si quieres conservarla.

Las fotos se comprimen para reducir el espacio ocupado. Si el dispositivo está lleno o el navegador rechaza el guardado, se muestra un aviso.

Para actualizar tras publicar una nueva versión, cambia `CACHE` dentro de `sw.js`; el navegador podrá recibir la nueva versión al abrir la app con conexión.

## Desarrollar

Puedes editar todos los archivos directamente. La ilustración pixel art se genera en `pixel-world.js`, sin usar imágenes, recursos comerciales ni librerías externas. El código de la aplicación está en `app.js`. Los iconos están preparados en la carpeta `assets`.

Licencia: uso y adaptación permitidos por la persona que reciba este proyecto. Los dibujos son originales y no dependen de marcas de terceros.
