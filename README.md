# pwa-geo-modular

Práctica de Geolocalización Consciente y Reutilizable.

## Responsabilidad de cada archivo

- `index.html`: estructura de la interfaz, pre-permiso, resultados y selector manual.
- `styles.css`: estilos sencillos y responsive.
- `geo-helper.js`: módulo reutilizable que encapsula `navigator.geolocation` y la consulta de permisos.
- `app.js`: lógica de UI, consumo del helper, estados y plan manual.
- `sw.js`: Service Worker con caché estática `geo-estatica-v1`.
- `manifest.json`: manifiesto de la PWA.
- `icons/`: iconos PNG de 192 y 512.

## Ejecución

Servir por HTTP local (no `file://`). Publicación en GitHub Pages desde `main` y `/ (root)`.

URL esperada: https://loreley100.github.io/pwa-geo-modular/

## Pruebas laptop y teléfono

1. Abrir la URL en Chrome de laptop y en Chrome de Android.
2. Pulsar "Adjuntar mi ubicación" y seguir el flujo de pre-permiso.
3. Probar denegación y plan manual.
4. Comparar el margen de precisión mostrado.

## Pre-permiso, denegación y plan manual

- La tarjeta de pre-permiso explica el uso y ofrece "Compartir mi ubicación" y "Seleccionar zona manualmente".
- Si el permiso está denegado, se muestra el selector manual y se indica cómo reactivar el permiso.
- Ante errores `PERMISSION_DENIED`, `POSITION_UNAVAILABLE`, `TIMEOUT` o navegador sin geolocalización, se habilita el selector manual.

## accuracy y precisionMetros

`precisionMetros` es el valor redondeado de `coords.accuracy`, el margen de error en metros (radio de confianza del 95%).

## Opciones de posición

- `enableHighAccuracy`: solicita máxima precisión (GPS si existe).
- `timeout`: tiempo máximo de espera en ms antes de error `TIMEOUT`.
- `maximumAge`: edad máxima aceptable de una lectura cacheada del SO.

## Permiso vs coordenadas

`consultarEstadoPermisoGeo()` solo consulta el estado del permiso; no obtiene coordenadas ni dispara la solicitud nativa. `obtenerUbicacionActual()` sí solicita coordenadas.

## Wrapper con new Promise

`getCurrentPosition` usa callbacks; el wrapper lo convierte en Promesa consumible con `.then()`/`.catch()`.

## Decisiones mínimas de ensamblado

- Opciones de zona: Cuernavaca, Jiutepec, Emiliano Zapata, Temixco, Otra zona.
- Caso de 30 metros: `precisionMetros < 30` se clasifica como "Precisión GPS Alta"; `precisionMetros >= 30` (incluido 30) como "Ubicación Aproximada (Wi-Fi / IP)".
- Ejemplo de opciones menos exigentes del profesor:
  `obtenerUbicacionActual({ enableHighAccuracy: false, maximumAge: 60000 })`.

La clasificación es orientativa según el margen de precisión; no identifica el sensor utilizado.

## Instalación en iPhone (iOS)

- En iPhone no instalada, se muestran instrucciones: pulsa el icono Compartir y selecciona "Agregar a inicio".
- En iPhone instalada o en Android, las instrucciones permanecen ocultas.
- Advertencia: Safari y la PWA instalada en la pantalla de inicio manejan permisos por separado; el permiso puede solicitarse nuevamente en la PWA instalada.