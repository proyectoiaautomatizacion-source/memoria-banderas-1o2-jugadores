---
inclusion: fileMatch
fileMatchPattern: 'src/**'
---

# Structure Steering

## Árbol de carpetas

```
memoria-banderas/
├── .kiro/
│   ├── specs/
│   │   └── memoria-banderas/
│   │       ├── requirements.md
│   │       ├── design.md
│   │       └── tasks.md
│   └── steering/
│       ├── product.md
│       ├── tech.md
│       └── structure.md
├── public/
├── src/
│   ├── components/
│   │   ├── Card.jsx
│   │   ├── Scoreboard.jsx
│   │   ├── LoadingState.jsx
│   │   └── ErrorState.jsx
│   ├── screens/
│   │   ├── MenuScreen.jsx
│   │   ├── GameScreen.jsx
│   │   └── ResultScreen.jsx
│   ├── hooks/
│   │   └── useTimer.js
│   ├── lib/
│   │   ├── flags.js
│   │   └── persistence.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Responsabilidades

| Ruta | Responsabilidad |
|---|---|
| `src/App.jsx` | Fuente única de verdad del estado de partida; decide qué pantalla renderizar. |
| `src/screens/MenuScreen.jsx` | Selección de modo y dificultad; botón de inicio. |
| `src/screens/GameScreen.jsx` | Tablero, lógica de volteo, comparación de pares, cambio de turno, timer. |
| `src/screens/ResultScreen.jsx` | Marcador final, confeti, botón de reinicio. |
| `src/components/Card.jsx` | Carta individual con animación de volteo 3D. |
| `src/components/Scoreboard.jsx` | Pares por jugador y resaltado del jugador activo. |
| `src/components/LoadingState.jsx` | Estado de carga de banderas. |
| `src/components/ErrorState.jsx` | Estado de error con botón de reintento. |
| `src/hooks/useTimer.js` | Lógica del timer del modo 1 jugador. |
| `src/lib/flags.js` | Carga de banderas desde REST Countries API, generación del tablero. |
| `src/lib/persistence.js` | Serialización, lectura y limpieza del estado en `sessionStorage`. |
| `src/main.jsx` | Punto de entrada; monta `<App />`. |
| `src/index.css` | Directivas de Tailwind + estilos globales mínimos. |

## Convenciones

- **Componentes y pantallas:** PascalCase, un componente por archivo, extensión `.jsx`.
- **Hooks:** camelCase empezando con `use`, extensión `.js`.
- **Módulos utilitarios:** camelCase, extensión `.js`.
- **Tests:** junto al archivo probado con sufijo `.test.jsx` / `.test.js`.
- **Imports:** rutas relativas dentro de `src/`; no se configuran aliases en este MVP.
- **Estilos:** Tailwind en `className`; no se escriben archivos `.module.css` ni CSS-in-JS.
- **Animaciones:** siempre vía Framer Motion (`motion.*`, `AnimatePresence`); no se usan animaciones CSS personalizadas para el volteo de cartas.
- **Estado:** estado global en `App.jsx` pasado por props; no se usa Context API ni stores externos.
- **Claves de `sessionStorage`:** prefijadas con `memoria-banderas-` (`memoria-banderas-state`, `memoria-banderas-flags`).

## Patrones

- **Composición sobre herencia:** no se usan class components.
- **Un solo nivel de anidamiento de estado:** `App` es el único que mantiene `useState` de partida; los hijos reciben props y emiten callbacks.
- **Efectos secundarios aislados:** `fetch`, `setInterval`, `sessionStorage` y `canvas-confetti` se invocan dentro de `useEffect` o módulos `lib/`, nunca en el cuerpo del render.
- **Comparación de pares:** siempre mediante `setTimeout()` con un intervalo único y claro, cancelable si el componente se desmonta.

## Ubicación de pruebas

- Tests de componentes y pantallas: junto al archivo (`src/components/Card.test.jsx`).
- Tests de lógica pura: junto al módulo (`src/lib/flags.test.js`).
- No se crea una carpeta global `tests/` en la raíz.

## Archivos que no deben tocarse

- `.kiro/specs/memoria-banderas/requirements.md` — fuente de verdad de los requisitos.
- `.kiro/steering/product.md`, `tech.md`, `structure.md` — contexto del proyecto; si hay que cambiarlos, hacerlo explícitamente y no como efecto colateral de una tarea de código.
- `package-lock.json` — no editar a mano.
- Archivos generados por Vite (`dist/`) — no editar.

## Referencias

- Stack y comandos: `#[[file:tech.md]]`
- Límites del producto: `#[[file:product.md]]`
