import { useEffect, useState } from 'react'
import './index.css'
import ErrorState from './components/ErrorState'
import LoadingState from './components/LoadingState'
import { loadFlags } from './lib/flags'
import { clearState, loadState, saveState } from './lib/persistence'
import GameScreen from './screens/GameScreen'
import MenuScreen from './screens/MenuScreen'
import ResultScreen from './screens/ResultScreen'

/**
 * @typedef {'single' | 'versus'} Mode
 * @typedef {'easy' | 'medium' | 'hard'} Difficulty
 *
 * @typedef {{ name: string, flag: string }} FlagData
 *
 * @typedef {{
 *   id: number,
 *   flag: FlagData,
 *   isFlipped: boolean,
 *   isMatched: boolean
 * }} CardState
 *
 * @typedef {{
 *   screen: 'menu' | 'game' | 'result',
 *   mode: Mode | null,
 *   difficulty: Difficulty | null,
 *   cards: CardState[],
 *   flippedIds: number[],
 *   currentPlayer: 1 | 2,
 *   pairsP1: number,
 *   pairsP2: number,
 *   elapsedSeconds: number
 * }} GameState
 */

/** @returns {GameState} */
function initialState() {
  return {
    screen: 'menu',
    mode: null,
    difficulty: null,
    cards: [],
    flippedIds: [],
    currentPlayer: 1,
    pairsP1: 0,
    pairsP2: 0,
    elapsedSeconds: 0,
  }
}

export default function App() {
  const [game, setGame] = useState(initialState)
  const [loadingFlags, setLoadingFlags] = useState(false)
  const [flagError, setFlagError] = useState(null)

  // Restaurar estado desde sessionStorage al montar
  useEffect(() => {
    const saved = loadState()
    if (saved) {
      setGame((prev) => ({ ...prev, ...saved, screen: 'game' }))
    }
  }, [])

  // Persistir cambios relevantes (solo cuando estamos en juego)
  useEffect(() => {
    if (game.screen === 'game') {
      const { screen: _screen, ...persistable } = game
      saveState(persistable)
    }
  }, [game])

  /**
   * Arranca una partida: carga banderas y genera el tablero.
   * @param {Mode} mode
   * @param {Difficulty} difficulty
   */
  async function startGame(mode, difficulty) {
    setLoadingFlags(true)
    setFlagError(null)
    try {
      const cards = await loadFlags(difficulty)
      setGame({
        screen: 'game',
        mode,
        difficulty,
        cards,
        flippedIds: [],
        currentPlayer: 1,
        pairsP1: 0,
        pairsP2: 0,
        elapsedSeconds: 0,
      })
    } catch (err) {
      console.info('[App] Error cargando banderas:', err.message)
      setFlagError(err.message)
    } finally {
      setLoadingFlags(false)
    }
  }

  /** Reintentar carga de banderas con los mismos parámetros guardados */
  function retryLoad() {
    if (game.mode && game.difficulty) {
      startGame(game.mode, game.difficulty)
    }
  }

  /** Volver al menú y limpiar estado persistido */
  function resetGame() {
    clearState()
    setGame(initialState())
    setFlagError(null)
  }

  if (loadingFlags) return <LoadingState />
  if (flagError)
    return <ErrorState message={flagError} onRetry={retryLoad} />

  if (game.screen === 'menu')
    return <MenuScreen onStart={startGame} />

  if (game.screen === 'game')
    return (
      <GameScreen
        game={game}
        setGame={setGame}
        onReset={resetGame}
      />
    )

  if (game.screen === 'result')
    return (
      <ResultScreen
        game={game}
        onReset={resetGame}
      />
    )

  return null
}
