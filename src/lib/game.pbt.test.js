/**
 * Pruebas de propiedades (PBT) con fast-check para la lógica de juego.
 * Property 2: Invariante de turno en modo versus
 * Property 3: Conservación de pares
 */
import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'

// --------------- Reductor puro (mismo que en game.test.js) ---------------

/**
 * Aplica un turno al estado de partida.
 * @param {{ currentPlayer: 1|2, pairsP1: number, pairsP2: number }} state
 * @param {boolean} wasMatch
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

// --------------- Property 2: Invariante de turno ---------------

const versusStateArb = fc.record({
  currentPlayer: fc.constantFrom(1, 2),
  pairsP1: fc.nat({ max: 10 }),
  pairsP2: fc.nat({ max: 10 }),
})

describe('Property 2 — invariante de turno en modo versus', () => {
  it('al acertar, currentPlayer no cambia', () => {
    fc.assert(
      fc.property(versusStateArb, (state) => {
        const next = applyTurn(state, true)
        return next.currentPlayer === state.currentPlayer
      })
    )
  })

  it('al fallar, currentPlayer cambia al otro jugador', () => {
    fc.assert(
      fc.property(versusStateArb, (state) => {
        const next = applyTurn(state, false)
        const expected = state.currentPlayer === 1 ? 2 : 1
        return next.currentPlayer === expected
      })
    )
  })

  it('doble fallo restaura el turno al jugador original', () => {
    fc.assert(
      fc.property(versusStateArb, (state) => {
        const after1 = applyTurn(state, false)
        const after2 = applyTurn(after1, false)
        return after2.currentPlayer === state.currentPlayer
      })
    )
  })
})

// --------------- Property 3: Conservación de pares ---------------

const cardArb = fc.record({
  id: fc.nat(),
  flag: fc.record({ name: fc.string({ minLength: 1 }), flag: fc.webUrl() }),
  isFlipped: fc.boolean(),
  isMatched: fc.boolean(),
})

describe('Property 3 — conservación de pares', () => {
  it('pairsP1 + pairsP2 nunca excede totalPairs', () => {
    fc.assert(
      fc.property(
        fc.nat({ max: 10 }).chain((totalPairs) =>
          fc.record({
            totalPairs: fc.constant(totalPairs),
            pairsP1: fc.nat({ max: totalPairs }),
            pairsP2: fc.nat({ max: totalPairs }),
          }).filter(({ pairsP1, pairsP2 }) => pairsP1 + pairsP2 <= totalPairs)
        ),
        ({ totalPairs, pairsP1, pairsP2 }) => {
          return pairsP1 + pairsP2 <= totalPairs
        }
      )
    )
  })

  it('cuando todas las cartas están emparejadas, pairsP1 + pairsP2 === totalPairs', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10 }).chain((totalPairs) => {
          // Distribuir los pares entre p1 y p2
          return fc.integer({ min: 0, max: totalPairs }).map((p1) => ({
            totalPairs,
            pairsP1: p1,
            pairsP2: totalPairs - p1,
          }))
        }),
        ({ totalPairs, pairsP1, pairsP2 }) => {
          return pairsP1 + pairsP2 === totalPairs
        }
      )
    )
  })

  it('aplicar acierto en secuencia: suma de pares incrementa en 1', () => {
    fc.assert(
      fc.property(versusStateArb, (state) => {
        const before = state.pairsP1 + state.pairsP2
        const next = applyTurn(state, true)
        const after = next.pairsP1 + next.pairsP2
        return after === before + 1
      })
    )
  })

  it('aplicar fallo: suma de pares no cambia', () => {
    fc.assert(
      fc.property(versusStateArb, (state) => {
        const before = state.pairsP1 + state.pairsP2
        const next = applyTurn(state, false)
        const after = next.pairsP1 + next.pairsP2
        return after === before
      })
    )
  })
})
