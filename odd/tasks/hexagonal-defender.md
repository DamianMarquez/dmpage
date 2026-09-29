# Hexagonal Defender

## Objetivo

Agregar un catálogo `/games` y su primer juego educativo, Hexagonal Defender, a la web existente. El juego clasifica ejemplos de Arquitectura Hexagonal en seis zonas con controles de teclado y táctiles.

## Problema y motivación

La aplicación no tiene una sección de juegos. Hexagonal Defender debe enseñar las responsabilidades de Domain, Input Adapter, Input Port, Application Service, Output Port y Output Adapter, además de las dependencias válidas entre ellas.

## Alcance autorizado

- Agregar navegación de escritorio y móvil, catálogo `/games` y acceso al juego.
- Implementar la experiencia arcade en React/TypeScript del cliente; sin backend de juego ni librerías de juegos.
- Añadir el tratamiento de rutas/SEO que el sitio requiere para carga directa y recarga.
- Preservar cambios preexistentes, en particular `client/public/sitemap.xml`.

## Restricciones y decisiones

- TDD: desactivado por elección explícita del usuario («nunca pedi tdd, mandale»); runner: ninguno configurado.
- Verificación acordada: `npm run build`, `npm run lint` y comprobaciones funcionales de navegación y mecánicas.
- Mecánica: mover la nave entre carriles y atrapar cada componente en su zona; seis zonas, incluyendo Input Adapter como zona independiente.
- RDD: habilitado globalmente (modo consultado: on, deciding source global). No cambiar la preferencia.
- Ruta ODD: delegated direct para HD-1. Evidencia: la integración requiere editar más de dos archivos no mecánicos y la comprensión del área implicó router, navbar, SEO del cliente y fallback Express (mapping delegado ya realizado); el escritor de implementación fue delegado.
- Estrategia de entrega: `ask-on-risk` (predeterminada); estimación inicial ~380; recuento observado ~490 líneas de trabajo (adiciones + eliminaciones, excluidos generados y el sitemap preexistente). La pregunta de cadena quedó sin respuesta; dado que el usuario no pidió PR, se asume `feature-branch-chain` si se necesitara una cadena futura. No se hará ninguna operación remota.
- Espejo Engram `odd/hexagonal-defender/tasks`: pendiente; no hay herramienta Engram disponible en esta sesión.

## Criterios de aceptación

- `/games` aparece en navegación desktop/móvil y carga directamente; el catálogo muestra Hexagonal Defender y la descripción exacta solicitada.
- El juego enseña las seis zonas, los siete componentes solicitados y sus responsabilidades/dependencias.
- Flechas/A-D y controles táctiles permiten cambiar de carril; captura correcta/incorrecta da feedback, y se puede iniciar, pausar y reiniciar.
- La partida está implementada en frontend y no rompe funcionalidades existentes.
- Build y lint pasan; las comprobaciones funcionales acordadas se observan y documentan.

## Tareas

- [ ] HD-1 — Entregar `/games` y Hexagonal Defender como una función integrada y buildable: navegación, catálogo, ruta de partida, metadatos SEO, seis carriles, controles, feedback y ciclo de partida. Ruta: delegated direct. Trigger: integración de más de dos archivos y mapeo de 4+ superficies; la pantalla, su ruta y los metadatos dependen unos de otros para compilar y cargar directamente, por lo que se mantienen en un commit coherente.

## Evidencia y progreso

- Exploración: React 19, TypeScript y React Router; rutas explícitas en `client/src/router/router.tsx`. Navbar sólo se monta actualmente desde Home; Express registra metadatos por ruta.
- Evaluación inicial RDD de sólo lectura: `risk=medium`, motivo `executable_change` en `client/public/sitemap.xml`, cambio preexistente del usuario; se excluyeron explícitamente archivos sin seguimiento para identificar el inventario; `review_due=false`, motivo `under_budget`. No se revisó ni modificó ese archivo.
- HD-1 está implementado; `/games` y `/games/hexagonal-defender` se cargaron directamente en el navegador y Express devolvió títulos, canonical y fallback `noscript` correctos. Catálogo, descripción exacta, enlace de inicio y navegación móvil quedaron visibles; la navegación móvil no muestra un control Login inactivo.
- El juego incluye seis carriles y siete componentes. En navegador, teclado movió la selección a Input Adapter y la partida sumó 100 puntos al clasificar `UserController`; también se observaron errores que reducen vidas y finalizan la partida.
- Verificación: `npm run build` pasó (emite aviso de bundle >500 kB); `npm run lint` pasó; `git diff --check` pasó. Pendiente confirmar manualmente pausa/reanudación y selección por control táctil; no hay runner de tests configurado.
- Commits: pendientes.

## Próximo paso

Completar las comprobaciones funcionales faltantes, cerrar HD-1 con un commit de unidad de trabajo, ejecutar la evaluación RDD del commit y registrar su identidad. Sincronizar el espejo cuando haya una herramienta Engram disponible.
