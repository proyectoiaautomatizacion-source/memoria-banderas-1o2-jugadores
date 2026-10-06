import { useEffect, useRef, useState } from 'react'
import Card from '../components/Card'
import Scoreboard from '../components/Scoreboard'
import { arePair } from '../lib/flags'
import { useTimer, formatTime } from '../hooks/useTimer'

const FLIP_DELAY_MS = 1000

/** Número de columnas del grid según cantidad de cartas */
function gridCols(total) {
  if (total <= 12) return 'grid-cols-4'
  if (total <= 16) return 'grid-cols-4'
  return 'grid-cols-5'
}

/**
 * @param {{
 *   game: import('../App.jsx').GameState,
 *   setGame: React.Dispatch<React.SetStateAction<import('../App.jsx').GameState>>,
 *   onReset: () => void
 * }} props
 */
export default function GameScreen({ game, setGame, onReset }) {
  const { cards, flippedIds, currentPlayer, pairsP1, pairsP2, mode, difficulty } = game

  // El timer solo corre en modo single
  const [timerRunning, setTimerRunning] = useState(false)
  const [timerStarted, setTimerStarted] = useState(false)
  const resolving = useRef(false)

  // Sincronizar elapsedSeconds desde el estado del juego al timer
  useTimer(timerRunning, (updater) => {
    setGame((prev) => {
      const next = updater(prev.elapsedSeconds)
      return { ...prev, elapsedSeconds: next }
    })
  })

  // Si restauramos un juego en curso en modo single, arrancamos el timer
  useEffect(() => {
    if (mode === 'single' && cards.some((c) => c.isFlipped || c.isMatched)) {
      setTimerRunning(true)
      setTimerStarted(true)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function handleCardClick(id) {
    // Ignorar si ya hay dos cartas en evaluación
    if (flippedIds.length >= 2 || resolving.current) return

    const card = cards.find((c) => c.id === id)
    if (!card || card.isFlipped || card.isMatched) return

    // Arrancar timer en modo single al primer volteo
    if (mode === 'single' && !timerStarted) {
      setTimerRunning(true)
      setTimerStarted(true)
    }

    const newFlipped = [...flippedIds, id]

    // Voltear la carta en el estado
    const updatedCards = cards.map((c) =>
      c.id === id ? { ...c, isFlipped: true } : c
    )

    if (newFlipped.length < 2) {
      setGame((prev) => ({ ...prev, cards: updatedCards, flippedIds: newFlipped }))
      return
    }

    // Tenemos 2 cartas volteadas — comparar
    resolving.current = true
    const [firstId, secondId] = newFlipped
    const first = updatedCards.find((c) => c.id === firstId)
    const second = updatedCards.find((c) => c.id === secondId)
    const matched = arePair(first, second)

    setGame((prev) => ({ ...prev, cards: updatedCards, flippedIds: newFlipped }))

    setTimeout(() => {
      resolving.current = false
      setGame((prev) => {
        let nextCards
        let nextP1 = prev.pairsP1
        let nextP2 = prev.pairsP2
        let nextPlayer = prev.currentPlayer

        if (matched) {
          // Marcar ambas cartas como emparejadas
          nextCards = prev.cards.map((c) =>
            c.id === firstId || c.id === secondId
              ? { ...c, isFlipped: true, isMatched: true }
              : c
          )
          // Incrementar pares del jugador activo
          if (prev.currentPlayer === 1) nextP1 += 1
          else nextP2 += 1
          // Mantener turno (no cambia al acertar)
        } else {
          // Voltear las cartas de vuelta
          nextCards = prev.cards.map((c) =>
            c.id === firstId || c.id === secondId
              ? { ...c, isFlipped: false }
              : c
          )
          // Cambiar turno solo en modo versus al fallar
          if (prev.mode === 'versus') {
            nextPlayer = prev.currentPlayer === 1 ? 2 : 1
          }
        }

        const allMatched = nextCards.every((c) => c.isMatched)

        if (allMatched) {
          // Detener timer
          setTimerRunning(false)
          console.info('[game] Partida completada.')
          return {
            ...prev,
            cards: nextCards,
            flippedIds: [],
            pairsP1: nextP1,
            pairsP2: nextP2,
            currentPlayer: nextPlayer,
            screen: 'result',
          }
        }

        return {
          ...prev,
          cards: nextCards,
          flippedIds: [],
          pairsP1: nextP1,
          pairsP2: nextP2,
          currentPlayer: nextPlayer,
        }
      })
    }, FLIP_DELAY_MS)
  }

  const totalPairs = cards.length / 2
  const matchedCount = cards.filter((c) => c.isMatched).length / 2
  const boardDisabled = flippedIds.length >= 2 || resolving.current

  const difficultyLabel = { easy: 'Fácil', medium: 'Medio', hard: 'Difícil' }[difficulty]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 flex flex-col items-center p-4 gap-4">
      {/* Header */}
      <header className="w-full max-w-2xl flex items-center justify-between">
        <button
          onClick={onReset}
          className="text-blue-300 hover:text-white text-sm font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-white/10 cursor-pointer"
          aria-label="Volver al menú"
        >
          ← Menú
        </button>

        <div className="flex items-center gap-3">
          <span className="text-blue-300 text-xs font-medium bg-white/10 px-2.5 py-1 rounded-full">
            {difficultyLabel}
          </span>
          {mode === 'single' && (
            <span
              className="text-white font-mono text-lg font-bold tabular-nums"
              aria-label={`Tiempo: ${formatTime(game.elapsedSeconds)}`}
            >
              ⏱ {formatTime(game.elapsedSeconds)}
            </span>
          )}
        </div>

        <span className="text-blue-300 text-xs font-medium bg-white/10 px-2.5 py-1 rounded-full">
          {matchedCount}/{totalPairs} pares
        </span>
      </header>

      {/* Scoreboard modo versus */}
      {mode === 'versus' && (
        <Scoreboard
          pairsP1={pairsP1}
          pairsP2={pairsP2}
          currentPlayer={currentPlayer}
        />
      )}

      {/* Tablero */}
      <main
        className={`grid gap-3 w-full max-w-2xl ${gridCols(cards.length)}`}
        aria-label="Tablero de juego"
      >
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            onClick={handleCardClick}
            disabled={boardDisabled}
          />
        ))}
      </main>
    </div>
  )
}
