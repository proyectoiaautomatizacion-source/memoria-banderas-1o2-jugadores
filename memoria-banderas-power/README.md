# memoria-banderas-game

Power de Kiro que empaqueta patrones de implementación para el juego de memoria de banderas: animaciones de volteo 3D con Framer Motion, transiciones de menú, feedback visual de turnos y confeti de victoria con canvas-confetti.

## Propósito

Este Power resuelve un problema concreto: cuando se construye el juego de memoria de banderas, los patrones visuales y de interacción (volteo 3D de cartas, resaltado del jugador activo, confeti de victoria) se repiten en varios componentes (`Card`, `MenuScreen`, `ResultScreen`). Sin un Power, cada generación de código tendría que reinventar estos patrones o depender de la memoria del agente, lo que genera inconsistencias visuales y consumo innecesario de créditos en correcciones.

Este Power encapsula el conocimiento específico del proyecto para que Kiro lo aplique automáticamente cuando se trabajen los componentes del juego.

## Problema que resuelve

- **Inconsistencia visual:** el volteo de cartas, las transiciones de menú y el feedback de turno requieren patrones específicos que, sin guía, se implementan de formas distintas cada vez.
- **Dependencia de librerías correctas:** Framer Motion y canvas-confetti tienen APIs que conviene usar de forma idiomática; el Power documenta los patrones probados.
- **Contexto de proyecto:** el juego tiene convenciones propias (estado global solo en `App.jsx`, animaciones exclusivamente con Framer Motion, sin CSS animations ad-hoc) que el Power refuerza.

## Requisitos previos

- Kiro IDE con soporte para Powers (formato Agent Plugins).
- Proyecto React + Vite + Tailwind CSS + Framer Motion + canvas-confetti ya configurado.
- Node.js 20 LTS o superior (para instalar dependencias del juego).

No se requieren credenciales ni servicios externos.

## Instalación

### Desde carpeta local (recomendado para desarrollo)

1. Abre Kiro IDE.
2. Abre el panel de **Powers** (icono de fantasma con rayo).
3. Selecciona **Add Custom Power**.
4. Elige **Import power from a folder**.
5. Selecciona la carpeta `memoria-banderas-power/` (debe contener `plugin.json` en su raíz).
6. Haz clic en **Install**.

### Verificar activación

Una vez instalado, el Power se activa automáticamente cuando aparecen sus keywords en la conversación. Para comprobar que funciona:

1. En el chat de Kiro, menciona alguno de los keywords: `memoria-banderas`, `memory-game`, `card-game`, `framer-motion`, `confetti`, `banderas`.
2. Kiro debería cargar el contexto del Power y el Skill `game-implementation`.

## Configuración

No requiere configuración adicional. El Power no incluye servidores MCP ni variables de entorno.

## Skills incluidos

### `game-implementation`

**Propósito:** Guiar la implementación del juego de memoria de banderas con el aspecto visual y las animaciones correctas.

**Cuándo se activa:** Cuando el usuario trabaja en componentes del juego (`Card`, `MenuScreen`, `GameScreen`, `ResultScreen`), menciona animaciones de cartas, volteo 3D, confeti de victoria, o pregunta cómo implementar alguna parte del juego.

**Qué contiene:**

- Instrucciones paso a paso para el volteo 3D de cartas con Framer Motion.
- Patrones de transición de menú y feedback de turno activo.
- Guía de integración de canvas-confetti al ganar/completar.
- Referencia de REST Countries API para la carga de banderas.
- Referencia de animaciones (`references/animation-patterns.md`).
- Referencia de API y confeti (`references/api-patterns.md`).

## Recursos incluidos

### `references/animation-patterns.md`

Patrones de Framer Motion aplicados al juego: volteo 3D (`rotateY` con `preserve-3d`), física de resorte para cartas, transiciones de menú, resaltado del jugador activo, animaciones de aparición/desaparición del tablero.

### `references/api-patterns.md`

Patrones de integración: llamada a REST Countries API con `fields=name,flags`, timeout con `AbortController`, caché en `sessionStorage`, configuración de canvas-confetti (`particleCount`, `spread`, `origin`, `disableForReducedMotion`).

## Configuración MCP

Este Power **no incluye** `mcp.json`. No necesita servidores MCP porque su valor está exclusivamente en el conocimiento e instrucciones del Skill, no en herramientas externas.

Si en el futuro el proyecto requiere documentación técnica actual (por ejemplo, consultar la API de Framer Motion en tiempo real), se podría añadir un MCP de documentación, pero no es necesario para el alcance actual.

## Ejemplos de uso

### Ejemplo 1: Implementar el volteo de cartas

**Prompt:** "Implementa el componente `Card` con volteo 3D usando Framer Motion para el juego de memoria de banderas."

**Resultado esperado:** Kiro activa el Power, carga el Skill `game-implementation`, y genera el componente con el patrón de volteo 3D documentado (`rotateY`, `preserve-3d`, spring physics, duración ~250ms).

### Ejemplo 2: Añadir confeti de victoria

**Prompt:** "Añade confeti al ganar en el modo 2 jugadores del juego de memoria."

**Resultado esperado:** Kiro genera la llamada a canvas-confetti con la configuración documentada en `references/api-patterns.md`, incluyendo `disableForReducedMotion` para accesibilidad.

### Ejemplo 3: Consultar patrón de animación de menú

**Prompt:** "¿Cómo debería animar las transiciones del menú inicial de memoria-banderas?"

**Resultado esperado:** Kiro consulta `references/animation-patterns.md` y explica el patrón de rotación 3D de tarjetas de modo y transiciones de entrada/salida.

## Validación

Para verificar que el Power funciona correctamente:

1. **Instalación:** el Power aparece en el panel de Powers de Kiro.
2. **Activación:** al mencionar keywords, Kiro carga el contexto del Skill.
3. **Contenido:** al pedir una implementación específica (ej. "volteo 3D de cartas"), Kiro usa los patrones documentados en lugar de generar código genérico.

**Prompt de prueba funcional:**

```
Usando el Power memoria-banderas-game, implementa el componente Card con volteo 3D para el juego de memoria de banderas. Debe respetar las convenciones del proyecto: animaciones solo con Framer Motion, sin CSS animations ad-hoc.
```

**Resultado esperado:** Kiro genera `Card.jsx` usando `motion.div` con `rotateY`, `transformStyle: 'preserve-3d'`, y spring physics, siguiendo el patrón documentado.

## Seguridad

- **Sin credenciales:** el Power no maneja tokens, API keys ni secretos.
- **Sin MCP:** no ejecuta procesos externos ni accede a servicios.
- **Sin escrituras no autorizadas:** el Power solo provee conocimiento e instrucciones; no modifica archivos por sí solo.
- **Contenido estático:** todos los archivos son Markdown/JSON de solo lectura una vez instalado.

## Limitaciones conocidas

- **Específico del proyecto:** este Power está diseñado para el juego de memoria de banderas. Los patrones pueden ser útiles para otros juegos de cartas, pero no es un Power genérico de "memory game".
- **Sin MCP:** no incluye herramientas externas. Si se necesita consultar documentación actualizada de Framer Motion o canvas-confetti, habría que añadir un MCP de documentación por separado.
- **Depende de Framer Motion y canvas-confetti:** los patrones asumen que estas librerías están instaladas y configuradas.
- **No cubre testing:** el Skill se enfoca en implementación visual y de interacción, no en pruebas automatizadas.

## Desinstalación o reversión

1. Abre el panel de **Powers** en Kiro.
2. Selecciona `memoria-banderas-game`.
3. Elige **Uninstall** o **Remove**.
4. El Power deja de cargarse en futuras conversaciones.

No modifica archivos del proyecto, por lo que la desinstalación no requiere limpieza adicional.

## Licencia

MIT
