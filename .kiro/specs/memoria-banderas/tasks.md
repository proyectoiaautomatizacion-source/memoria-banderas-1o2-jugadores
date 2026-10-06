# Plan de Implementación

- [x] 1. Inicializar proyecto React + Vite con Tailwind CSS
  - Crear proyecto con `npm create vite@latest . -- --template react`
  - Instalar y configurar Tailwind CSS
  - Instalar dependencias: `framer-motion`, `canvas-confetti`
  - _Requirements: 1.1_
  - _Kiro features: Specs_
  - _Evidence: `package.json` con dependencias, `vite.config.js`, `tailwind.config.js`, app base corriendo_

- [x] 2. Definir estado global de partida en `App.jsx`
  - Tipos `Mode`, `Difficulty`, `FlagData`, `CardState`, `GameState`
  - `useState` elevado + helpers `resetGame`, `startGame`
  - Render condicional de pantallas según `screen`
  - _Requirements: 1.2, 1.3_
  - _Depends on: 1_
  - _Kiro features: Specs_
  - _Evidence: `src/App.jsx` con el estado y switch de pantallas_

- [x] 3. Implementar persistencia con `sessionStorage`
  - Módulo `src/lib/persistence.js` con `saveState`, `loadState`, `clearState`
  - Clave `memoria-banderas-state` con versión
  - Restauración al montar `App`; limpieza al terminar o volver al menú
  - _Requirements: 7.1, 7.2, 7.3_
  - _Depends on: 2_
  - _Kiro features: Specs_
  - _Evidence: `src/lib/persistence.js` + tests unitarios_

- [x] 4. Implementar carga de banderas desde REST Countries API
  - Módulo `src/lib/flags.js` con `loadFlags(difficulty)` y `buildBoard(flags, difficulty)`
  - `fetch` a `https://restcountries.com/v3.1/all?fields=name,flags`
  - Selección aleatoria de N banderas (6/8/10), duplicación en pares y mezcla
  - `AbortController` con timeout de 10 s; caché en `sessionStorage`
  - Exportar funciones puras `buildBoard` y `arePair` para que sean testeables con fast-check
  - _Requirements: 2.1, 2.2, 2.3_
  - _Depends on: 1_
  - _Kiro features: Specs_
  - _Evidence: `src/lib/flags.js` + tests unitarios de generación de tablero_

- [x] 5. Construir `MenuScreen` con animaciones de Framer Motion
  - Selección de modo (1 o 2 jugadores) y dificultad (fácil/medio/difícil)
  - Botón de inicio deshabilitado hasta que ambas selecciones existan
  - Tarjetas con rotación 3D y transiciones animadas
  - _Requirements: 1.1, 1.4_
  - _Depends on: 2_
  - _Kiro features: Specs, Powers (Skill de juego)_
  - _Evidence: `src/screens/MenuScreen.jsx` visible y animado_

- [x] 6. Construir `Card` con volteo 3D
  - Componente con `rotateY` animado vía Framer Motion
  - Props: `card`, `onClick`, `disabled`
  - Ignora clics si la carta ya está volteada o emparejada
  - _Requirements: 3.1, 3.2, 3.3_
  - _Depends on: 1_
  - _Kiro features: Specs, Powers (Skill de juego)_
  - _Evidence: `src/components/Card.jsx` + demo visual_

- [x] 7. Construir `GameScreen` con lógica de volteo y comparación
  - Grid responsive del tablero
  - Manejo de `flippedIds`, comparación de pares con `setTimeout()`
  - Marcar pares emparejados o revertir volteo
  - _Requirements: 3.1, 3.2, 3.3, 4.1, 4.2, 4.3_
  - _Depends on: 4, 6_
  - _Kiro features: Specs, Powers (Skill de juego)_
  - _Evidence: `src/screens/GameScreen.jsx` funcional en ambos modos_

- [x] 8. Implementar `Scoreboard` y lógica de turnos en modo 2 jugadores
  - Marcador con pares por jugador, jugador activo iluminado
  - Incremento de pares solo al emparejar (jugador activo)
  - Cambio de turno solo al fallar en modo versus
  - _Requirements: 5.1, 5.2, 5.3_
  - _Depends on: 7_
  - _Kiro features: Specs_
  - _Evidence: `src/components/Scoreboard.jsx` + tests unitarios de la lógica de turnos_

- [x] 9. Implementar timer en modo 1 jugador
  - `setInterval` que arranca al primer volteo y se detiene al completar
  - Visualización en header del `GameScreen`
  - Persistencia de `elapsedSeconds` en `sessionStorage`
  - _Requirements: 6.1, 7.1_
  - _Depends on: 7_
  - _Kiro features: Specs_
  - _Evidence: `src/hooks/useTimer.js` + visualización en `GameScreen`_

- [x] 10. Construir `ResultScreen` con confeti y reinicio
  - Determinar ganador o empate en modo 2; mostrar tiempo final en modo 1
  - Disparar canvas-confetti al montar
  - Botón "Reiniciar" que limpia `sessionStorage` y vuelve al menú
  - _Requirements: 6.1, 6.2, 6.3, 6.4_
  - _Depends on: 8, 9_
  - _Kiro features: Specs, Powers (Skill de juego)_
  - _Evidence: `src/screens/ResultScreen.jsx` + confeti visible_

- [x] 11. Implementar `LoadingState` y `ErrorState`
  - Spinner visible durante la carga de banderas
  - Mensaje de error + botón "Reintentar" si falla el `fetch`
  - _Requirements: 2.4, 2.5_
  - _Depends on: 4_
  - _Kiro features: Specs_
  - _Evidence: `src/components/LoadingState.jsx`, `src/components/ErrorState.jsx`_

- [x] 12. Escribir pruebas unitarias con Vitest + React Testing Library
  - Generación de tablero por dificultad
  - Comparación de pares
  - Cambio de turno en modo versus
  - Determinación de ganador / empate
  - Serialización / restauración de `sessionStorage`
  - _Requirements: 2.1, 2.2, 2.3, 4.1, 4.2, 4.3, 5.2, 5.3, 6.2, 6.3, 7.1, 7.2_
  - _Depends on: 3, 4, 8_
  - _Kiro features: Specs_
  - _Evidence: `src/**/*.test.jsx` corriendo con `npm test`_

- [x] 13. Escribir pruebas de propiedades (PBT) con fast-check
  - Instalar `fast-check` como dependencia de desarrollo
  - Property 1: invariante del tablero generado por `buildBoard` (tamaño, duplicación, origen) — valida Req 2.1, 2.2, 2.3
  - Property 2: invariante de turno en modo versus con reductor puro `applyTurn` — valida Req 5.2, 5.3
  - Property 3: conservación de pares (`pairsP1 + pairsP2 <= totalPairs`; igualdad al completar) — valida Req 5.3, 6.2
  - Property 4: round-trip de persistencia `loadState(saveState(state)) deepEqual state` con `sessionStorage` mock — valida Req 7.1, 7.2
  - Property 5: nunca-crash en `arePair(a, b)` para cualquier par de `CardState` — valida Req 4.1, 4.2, 4.3
  - _Requirements: 2.1, 2.2, 2.3, 4.1, 4.2, 4.3, 5.2, 5.3, 6.2, 7.1, 7.2_
  - _Depends on: 3, 4, 8_
  - _Kiro features: Specs_
  - _Evidence: `src/lib/flags.pbt.test.js`, `src/lib/persistence.pbt.test.js`, `src/lib/game.pbt.test.js` corriendo con `npm test`_
