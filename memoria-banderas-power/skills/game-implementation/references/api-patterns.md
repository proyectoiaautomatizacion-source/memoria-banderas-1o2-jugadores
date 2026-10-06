# Patrones de API y Confeti

Referencia de integración con REST Countries API y configuración de canvas-confetti para el juego de memoria de banderas. Cargar cuando se implemente la carga de banderas o el efecto de celebración final.

## 1. REST Countries API

### Endpoint

```
https://restcountries.com/v3.1/all?fields=name,flags
```

El parámetro `fields` limita la respuesta a solo los campos necesarios (`name` y `flags`), reduciendo drásticamente el tamaño del payload. Sin este parámetro, la API devuelve más de 90 campos por país[citation:9][citation:15].

### Estructura de respuesta

Cada país se devuelve como un objeto con:

```json
{
  "name": {
    "common": "Canada",
    "official": "Canada"
  },
  "flags": {
    "png": "https://flagcdn.com/w320/ca.png",
    "svg": "https://flagcdn.com/ca.svg",
    "alt": "The flag of Canada..."
  }
}
```

Para el juego, se usa `name.common` como etiqueta y `flags.png` como imagen de la carta.

### Implementación con timeout

```js
export async function loadFlags() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(
      'https://restcountries.com/v3.1/all?fields=name,flags',
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Validar que la respuesta tenga el formato esperado
    if (!Array.isArray(data) || data.length < 10) {
      throw new Error('Respuesta de banderas insuficiente');
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Tiempo de espera agotado al cargar banderas');
    }
    throw error;
  }
}
```

**Puntos clave:**

- `AbortController` con timeout de 10 s evita que la UI quede colgada si la API no responde.
- Validar que la respuesta sea un array con al menos 10 entradas (mínimo para dificultad `hard`).
- Distinguir el error de timeout (`AbortError`) del error de red para mostrar mensajes distintos.

### Caché en sessionStorage

Para evitar llamadas repetidas a la API durante la misma sesión de navegador (por ejemplo, al reiniciar una partida), cachear las banderas descargadas:

```js
const FLAGS_CACHE_KEY = 'memoria-banderas-flags';

export async function loadFlagsWithCache() {
  // Intentar leer de caché primero
  const cached = sessionStorage.getItem(FLAGS_CACHE_KEY);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length >= 10) {
        return parsed;
      }
    } catch {
      // Caché corrupta: ignorar y recargar
    }
  }

  // Descargar de la API
  const flags = await loadFlags();

  // Guardar en caché
  try {
    sessionStorage.setItem(FLAGS_CACHE_KEY, JSON.stringify(flags));
  } catch {
    // sessionStorage lleno o no disponible: no es crítico, continuar sin caché
  }

  return flags;
}
```

**Puntos clave:**

- La caché se lee primero; solo se llama a la API si no hay caché válida.
- Si la caché está corrupta, se descarta y se recarga (no lanzar error).
- Si `sessionStorage` falla al guardar (cuota llena, modo privado), no interrumpir el juego.

### Selección aleatoria y generación del tablero

```js
const PAIRS_BY_DIFFICULTY = {
  easy: 6,
  medium: 8,
  hard: 10,
};

export function buildBoard(allFlags, difficulty) {
  const pairsNeeded = PAIRS_BY_DIFFICULTY[difficulty];

  // Validar que haya suficientes banderas
  if (!Array.isArray(allFlags) || allFlags.length < pairsNeeded) {
    throw new Error('Banderas insuficientes para la dificultad seleccionada');
  }

  // Mezclar y tomar las primeras N
  const shuffled = [...allFlags].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, pairsNeeded);

  // Duplicar cada bandera para formar pares
  const cards = selected.flatMap((flag, index) => [
    {
      id: index * 2,
      flag: {
        name: flag.name.common,
        flag: flag.flags.png,
      },
      isFlipped: false,
      isMatched: false,
    },
    {
      id: index * 2 + 1,
      flag: {
        name: flag.name.common,
        flag: flag.flags.png,
      },
      isFlipped: false,
      isMatched: false,
    },
  ]);

  // Mezclar las cartas duplicadas
  return cards.sort(() => Math.random() - 0.5);
}
```

**Puntos clave:**

- `flatMap` para duplicar cada bandera en dos cartas.
- IDs únicos por carta (`index * 2` y `index * 2 + 1`) para que React pueda trackearlas.
- Mezclar dos veces: primero las banderas seleccionadas, después las cartas duplicadas, para que los pares no queden adyacentes.

## 2. Canvas Confetti

### Configuración base para victoria

```js
import confetti from 'canvas-confetti';

export function triggerWinConfetti() {
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 },
    disableForReducedMotion: true,
  });
}
```

**Puntos clave:**

- `particleCount: 150` da una celebración visible sin saturar la pantalla[citation:10].
- `spread: 70` distribuye las partículas en un cono amplio pero enfocado[citation:10].
- `origin: { y: 0.6 }` dispara desde el centro-inferior de la pantalla[citation:10].
- `disableForReducedMotion: true` respeta la preferencia `prefers-reduced-motion` del sistema operativo, deshabilitando el confeti para usuarios que han pedido reducir animaciones[citation:10].

### Efecto de doble ráfaga (para modo 2 jugadores)

Para hacer la celebración más dramática en modo versus, disparar dos ráfagas con un pequeño retraso:

```js
export function triggerVersusWinConfetti() {
  // Ráfaga central
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    disableForReducedMotion: true,
  });

  // Ráfaga lateral izquierda con retraso
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      disableForReducedMotion: true,
    });
  }, 200);

  // Ráfaga lateral derecha con retraso
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      disableForReducedMotion: true,
    });
  }, 200);
}
```

**Puntos clave:**

- El `setTimeout` de 200 ms entre la ráfaga central y las laterales crea un efecto de eco.
- Los ángulos 60° y 120° disparan hacia afuera desde los laterales.
- Mantener `disableForReducedMotion: true` en todas las llamadas.

### Verificación de accesibilidad

```js
export function triggerWinConfetti() {
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (prefersReducedMotion) {
    return; // No disparar confeti si el usuario lo ha desactivado
  }

  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 },
  });
}
```

Aunque `canvas-confetti` ya soporta `disableForReducedMotion`, verificar la preferencia antes de llamar evita el costo de inicializar el canvas innecesariamente[citation:10].

## 3. Patrón de integración en el flujo del juego

El flujo completo desde que el usuario inicia una partida hasta que se muestra el confeti:

```js
// 1. Usuario selecciona modo y dificultad en MenuScreen
// 2. App.jsx llama a loadFlagsWithCache()
// 3. Con las banderas, llama a buildBoard(flags, difficulty)
// 4. Se persiste el estado en sessionStorage
// 5. GameScreen renderiza el tablero
// 6. Al completar todas las cartas (isMatched === true):
//    - Modo single: triggerWinConfetti()
//    - Modo versus: triggerVersusWinConfetti()
// 7. ResultScreen se muestra con el marcador final
```

**Puntos clave:**

- La carga de banderas y la construcción del tablero ocurren en `App.jsx` (estado global).
- El confeti se dispara desde `ResultScreen` en un `useEffect` que corre al montar.
- La caché evita que un reinicio de partida vuelva a llamar a la API.
