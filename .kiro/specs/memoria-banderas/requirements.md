# Documento de Requisitos

## Introducción

Juego de memoria de banderas para 1 o 2 jugadores. En modo 1 jugador, el objetivo es completar el tablero en el menor tiempo posible; en modo 2 jugadores, los turnos alternan al fallar un par y gana quien encuentre más pares. El menú inicial permite elegir modo y dificultad, el tablero carga banderas desde REST Countries API según la dificultad, y el cierre de partida muestra el marcador final con confeti.

## Requisitos

### Requisito 1

**Historia de Usuario:** Como jugador, quiero elegir modo (1 o 2 jugadores) y dificultad (fácil, medio, difícil) desde un menú inicial animado, para configurar la partida antes de empezar.

#### Criterios de Aceptación

1.1. WHEN el usuario abre la aplicación THEN el sistema SHALL mostrar un menú inicial con selección de modo y de dificultad, animado con Framer Motion.

1.2. WHEN el usuario selecciona modo 1 jugador y una dificultad THEN el sistema SHALL iniciar la partida en modo individual con el número de pares correspondiente a la dificultad elegida.

1.3. WHEN el usuario selecciona modo 2 jugadores y una dificultad THEN el sistema SHALL iniciar la partida en modo competitivo, inicializando `jugadorActual` en 1, `paresJugador1` en 0 y `paresJugador2` en 0.

1.4. IF el usuario intenta iniciar la partida sin haber seleccionado modo y dificultad THEN el sistema SHALL impedir el inicio y mantener el botón de inicio deshabilitado.

### Requisito 2

**Historia de Usuario:** Como jugador, quiero que el juego cargue banderas desde un servicio web según la dificultad, para que cada partida use un conjunto de banderas reales y acorde al tamaño del tablero.

#### Criterios de Aceptación

2.1. WHEN el usuario inicia una partida con dificultad fácil THEN el sistema SHALL cargar 6 banderas distintas desde REST Countries API mediante `fetch()`.

2.2. WHEN el usuario inicia una partida con dificultad medio THEN el sistema SHALL cargar 8 banderas distintas desde REST Countries API mediante `fetch()`.

2.3. WHEN el usuario inicia una partida con dificultad difícil THEN el sistema SHALL cargar 10 banderas distintas desde REST Countries API mediante `fetch()`.

2.4. WHILE las banderas se están cargando EL sistema SHALL mostrar un estado de carga visible en pantalla.

2.5. IF la petición a REST Countries API falla THEN el sistema SHALL mostrar un mensaje de error y ofrecer un botón para reintentar la carga.

### Requisito 3

**Historia de Usuario:** Como jugador, quiero voltear una carta para revelar su bandera, para intentar encontrar su par.

#### Criterios de Aceptación

3.1. WHEN el usuario hace clic sobre una carta boca abajo THEN el sistema SHALL voltearla con una animación de Framer Motion y revelar la bandera correspondiente.

3.2. WHILE una carta está volteada EL sistema SHALL impedir que esa misma carta vuelva a voltearse hasta que se resuelva la comparación.

3.3. IF el usuario intenta voltear una tercera carta mientras hay dos cartas volteadas sin resolver THEN el sistema SHALL ignorar la acción.

### Requisito 4

**Historia de Usuario:** Como jugador, quiero que el sistema compare dos banderas y determine acierto o fallo, para saber si formé un par.

#### Criterios de Aceptación

4.1. WHEN el usuario voltea una segunda carta THEN el sistema SHALL comparar ambas cartas y determinar si coinciden como par, usando React con `setTimeout()` para dar tiempo a ver el resultado.

4.2. IF ambas cartas coinciden THEN el sistema SHALL marcar el par como emparejado y SHALL mantener ambas cartas visibles.

4.3. IF ambas cartas no coinciden THEN el sistema SHALL ocultar ambas cartas tras el intervalo de `setTimeout()` y SHALL devolver el tablero al estado previo al volteo.

### Requisito 5

**Historia de Usuario:** Como jugador en modo 2 jugadores, quiero que el turno cambie al otro jugador si no acierto, para que la partida sea competitiva y alterna.

#### Criterios de Aceptación

5.1. WHILE la partida está en modo 2 jugadores EL sistema SHALL indicar visualmente cuál es el jugador activo mediante iluminación del marcador correspondiente.

5.2. WHEN un jugador no acierta un par en modo 2 jugadores THEN el sistema SHALL alternar `jugadorActual` al otro jugador.

5.3. WHEN un jugador acierta un par en modo 2 jugadores THEN el sistema SHALL incrementar únicamente el contador `paresJugador1` o `paresJugador2` del jugador activo y SHALL mantener el turno en ese mismo jugador.

### Requisito 6

**Historia de Usuario:** Como jugador, quiero ver quién ganó o mi tiempo final al completar el tablero, para conocer el resultado de la partida.

#### Criterios de Aceptación

6.1. WHEN el tablero se completa en modo 1 jugador THEN el sistema SHALL mostrar el tiempo final transcurrido y SHALL disparar confeti con canvas-confetti.

6.2. WHEN el tablero se completa en modo 2 jugadores THEN el sistema SHALL determinar al ganador como el jugador con mayor cantidad de pares y SHALL disparar confeti con canvas-confetti.

6.3. IF el tablero se completa en modo 2 jugadores con `paresJugador1` igual a `paresJugador2` THEN el sistema SHALL declarar empate y SHALL mostrar ambos marcadores igualados.

6.4. WHEN el usuario solicita reiniciar la partida desde la pantalla de resultado THEN el sistema SHALL limpiar el estado persistido y SHALL devolver al usuario al menú inicial.

### Requisito 7

**Historia de Usuario:** Como jugador, quiero que el progreso de mi partida se conserve ante una recarga accidental, para no perder el avance.

#### Criterios de Aceptación

7.1. WHEN el estado de la partida cambia (tablero, turno, pares, modo, dificultad, tiempo transcurrido) THEN el sistema SHALL persistirlo en `sessionStorage` bajo la clave `memoria-banderas-state`.

7.2. WHEN el usuario recarga la página con una partida en curso THEN el sistema SHALL restaurar el estado desde `sessionStorage` y SHALL continuar la partida desde el punto guardado.

7.3. WHEN el usuario completa la partida o vuelve al menú inicial THEN el sistema SHALL limpiar el estado persistido en `sessionStorage`.
