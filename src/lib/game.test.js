/**
 * Tests de lógica pura de juego:
 * - Cambio de turno en modo versus
 * - Determinación de ganador / empate
 */
import { describe, it, expect } from 'vitest'

// --------------- Lógica de turno (reductor puro) ---------------

/**
 * Aplica un turno al estado de partida.
 * @param {{ currentPlayer: 1|2, pairsP1: number, pairsP2: number }} state
 * @param {boolean} wasMatch
 * @returns {{ currentPlayer: 1|2, pairsP1: number, pairsP2: number }}
 */
function applyTurn(state, wasMatch) {
  if (wasMatch) {
    return {
      ...state,
      pairsP1: state.currentPlayer === 1 ? state.pairsP1 + 1 : state.pairsP1,
      pairsP2: state.currentPlayer === 2 ? state.pairsP2 + 1 : state.pairsP2,
    }
  }
  return {
    ...state,
    currentPlayer: state.currentPlayer === 1 ? 2 : 1,
  }
}

/**
 * Determina el ganador dado el marcador final.
 * @param {number} p1 
 * @param {number} p2 
 * @returns {'player1' | 'player2' | 'draw'}
 */
function determineWinner(p1, p2) {
  if (p1 > p2) return 'player1'
  if (p2 > p1) return 'player2'
  return 'draw'
}

describe('applyTurn (modo versus)', () => {
  const initial = { currentPlayer: 1, pairsP1: 0, pairsP2: 0 }

  it('al acertar, el turno NO cambia', () => {
    const next = applyTurn(initial, true)
    expect(next.currentPlayer).toBe(1)
  })

  it('al fallar, el turno cambia al otro jugador', () => {
    const next = applyTurn(initial, false)
    expect(next.currentPlayer).toBe(2)
  })

  it('al fallar siendo jugador 2, el turno vuelve al jugador 1', () => {
    const state = { currentPlayer: 2, pairsP1: 0, pairsP2: 0 }
    const next = applyTurn(state, false)
    expect(next.currentPlayer).toBe(1)
  })

  it('al acertar siendo jugador 1, incrementa pairsP1', () => {
    const next = applyTurn(initial, true)
    expect(next.pairsP1).toBe(1)
    expect(next.pairsP2).toBe(0)
  })

  it('al acertar siendo jugador 2, incrementa pairsP2', () => {
    const state = { currentPlayer: 2, pairsP1: 3, pairsP2: 2 }
    const next = applyTurn(state, true)
    expect(next.pairsP2).toBe(3)
    expect(next.pairsP1).toBe(3)
  })

  it('al fallar, los pares no cambian', () => {
    const state = { currentPlayer: 1, pairsP1: 2, pairsP2: 3 }
    const next = applyTurn(state, false)
    expect(next.pairsP1).toBe(2)
    expect(next.pairsP2).toBe(3)
  })
})

describe('determineWinner', () => {
  it('jugador 1 gana cuando tiene más pares', () => {
    expect(determineWinner(5, 3)).toBe('player1')
  })

  it('jugador 2 gana cuando tiene más pares', () => {
    expect(determineWinner(3, 7)).toBe('player2')
  })

  it('empate cuando tienen los mismos pares', () => {
    expect(determineWinner(4, 4)).toBe('draw')
  })

  it('empate con 0 pares cada uno', () => {
    expect(determineWinner(0, 0)).toBe('draw')
  })
})
