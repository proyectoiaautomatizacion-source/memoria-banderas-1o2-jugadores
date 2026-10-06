---
inclusion: always
---

# Product Steering

## Propósito

Juego de memoria de banderas para 1 o 2 jugadores, jugable en el navegador. El objetivo del producto es ofrecer una experiencia breve, visualmente atractiva y competitiva, donde el jugador (o los dos jugadores) encuentran pares de banderas sobre un tablero de cartas. En modo 1 jugador la meta es completar el tablero en el menor tiempo posible; en modo 2 jugadores gana quien encuentre más pares.

## Usuarios

- **Jugador individual:** busca una partida rápida contra el reloj, sin registro ni configuración compleja.
- **Dos jugadores locales:** comparten un mismo dispositivo y compiten por turnos.
- **Público general:** sin conocimiento técnico; se espera que puedan jugar sin tutorial.

## Casos de Uso

1. Elegir modo (1 o 2 jugadores) y dificultad (fácil/medio/difícil) desde un menú inicial animado.
2. Jugar una partida de memoria con banderas cargadas desde REST Countries API.
3. Alternar turnos entre dos jugadores en el mismo dispositivo y ver el marcador.
4. Ver el resultado final (ganador y pares en modo versus; tiempo final en modo individual) con confeti.
5. Sobrevivir a una recarga accidental de la pestaña sin perder el progreso.

## Funcionalidades

- Menú inicial animado con selección de modo y dificultad.
- Carga de banderas desde REST Countries API según dificultad (6 / 8 / 10 pares).
- Tablero de cartas con volteo 3D animado (Framer Motion).
- Comparación de pares con feedback visual y `setTimeout()`.
- Modo versus con cambio de turno al fallar y marcador con jugador activo iluminado.
- Modo individual con timer que arranca al primer volteo.
- Pantalla de resultado con ganador/tiempo y confeti (canvas-confetti).
- Persistencia del progreso en `sessionStorage`.

## Límites del Producto

Este es un MVP estricto. **No forma parte del alcance:**

- Cuentas de usuario, login o perfiles.
- Modo multijugador en red / online.
- Ranking global, estadísticas históricas o logros.
- Múltiples mazos más allá de banderas (animales, letras, etc.).
- Internacionalización / selector de idioma.
- Modo oscuro / claro configurable.
- Tutorial interactivo o pantallas de ayuda.
- Backend propio: toda la lógica vive en el cliente.
- Publicación en tiendas de aplicaciones.

Cualquier funcionalidad no listada arriba se considera fuera de alcance y no debe implementarse sin una actualización explícita de este documento y de `requirements.md`.

## Referencias

- Requisitos detallados: `#[[file:../specs/memoria-banderas/requirements.md]]`
