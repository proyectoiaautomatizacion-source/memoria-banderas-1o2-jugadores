---
name: game-implementation
description: Implementa el juego de memoria de banderas con sus animaciones y aspecto visual. Usar cuando se trabaje en los componentes del juego (Card, MenuScreen, GameScreen, ResultScreen), cuando se mencionen animaciones de cartas, volteo 3D, confeti de victoria, o cuando se pregunte cómo implementar alguna parte del juego.
---

# Implementación del Juego de Memoria de Banderas

## Propósito

Guiar la implementación del juego de memoria de banderas con el aspecto visual y las animaciones correctas, usando Framer Motion para todo el movimiento y canvas-confetti para la celebración final.

## Condiciones de activación

Activar este Skill cuando el usuario:

- Trabaje en los componentes del juego: `Card`, `MenuScreen`, `GameScreen`, `ResultScreen`, `Scoreboard`.
- Mencione animaciones de cartas, volteo 3D, transiciones de menú, feedback de turnos.
- Pregunte cómo implementar alguna parte del juego de memoria.
- Mencione confeti de victoria o celebración final.
- Use las keywords del Power: `memoria-banderas`, `memory-game`, `card-game`, `framer-motion`, `confetti`, `banderas`.

## Cuándo NO activar

- Si el usuario está trabajando en un proyecto diferente al juego de memoria de banderas.
- Si la consulta es sobre testing, despliegue o configuración de build (usar otros recursos).
- Si se pregunta por funcionalidades fuera del alcance del MVP (cuentas, ranking, multijugador online).

## Entradas

- Requisitos del juego: `.kiro/specs/memoria-banderas/requirements.md`
- Diseño técnico: `.kiro/specs/memoria-banderas/design.md`
- Convenciones del proyecto: `.kiro/steering/structure.md` y `.kiro/steering/tech.md`

## Pasos de trabajo

### 1. Implementar el volteo 3D de cartas

Cada carta debe usar `motion.div` de Framer Motion con:

- `animate={{ rotateY: isFlipped ? 180 : 0 }}` para el volteo.
- `transition` con spring physics o duración de 200-300ms [citation:4].
- `style={{ transformStyle: 'preserve-3d' }}` para el efecto 3D.
- Dos caras internas con `backfaceVisibility: 'hidden'`.
- El contenedor externo con `perspective: '1000px'` [citation:14].

Ver `references/animation-patterns.md` para el patrón completo.

### 2. Implementar transiciones de menú

El `MenuScreen` debe usar `AnimatePresence` para las transiciones de entrada/salida entre pantallas. Las tarjetas de modo pueden tener una rotación 3D sutil al hover o al seleccionar, usando `whileHover` y `whileTap` de Framer Motion.

### 3. Implementar feedback visual de turnos

En modo 2 jugadores, el `Scoreboard` debe iluminar el marcador del jugador activo. Usar `motion.div` con `animate={{ scale: isActive ? 1.05 : 1, boxShadow: isActive ? '0 0 20px rgba(...)' : 'none' }}` para el resaltado.

### 4. Implementar el confeti de victoria

Usar `canvas-confetti` al completar el tablero. La configuración debe incluir:

- `particleCount: 150`
- `spread: 70`
- `origin: { y: 0.6 }`
- `disableForReducedMotion: true` (accesibilidad) [citation:10][citation:19].

Ver `references/api-patterns.md` para el patrón completo.

### 5. Cargar banderas desde REST Countries API

Usar `fetch()` con `?fields=name,flags` para limitar la respuesta a solo los campos necesarios. El endpoint es `https://restcountries.com/v3.1/all?fields=name,flags` [citation:6].

Incluir timeout con `AbortController` (10 s) y caché en `sessionStorage` bajo `memoria-banderas-flags`.

Ver `references/api-patterns.md` para el patrón completo.

## Salidas esperadas

- Componentes `Card`, `MenuScreen`, `GameScreen`, `ResultScreen`, `Scoreboard` implementados.
- Animaciones funcionando: volteo 3D, transiciones de menú, feedback de turno, confeti.
- Integración con REST Countries API funcional.

## Límites

- No implementar funcionalidades fuera del MVP (ver `product.md`).
- No usar CSS animations personalizadas para el volteo: solo Framer Motion.
- No usar `localStorage`: solo `sessionStorage`.
- No añadir dependencias fuera del stack definido en `tech.md`.

## Dependencias

- Framer Motion (para todas las animaciones).
- canvas-confetti (para el confeti de victoria).
- REST Countries API (para las banderas).

## Recursos

- `references/animation-patterns.md`: patrones de Framer Motion aplicados al juego.
- `references/api-patterns.md`: integración con REST Countries API y configuración de canvas-confetti.
