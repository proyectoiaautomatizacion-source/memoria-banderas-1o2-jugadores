/**
 * Pruebas de propiedades (PBT) con fast-check para el módulo persistence.
 * Property 4: Round-trip de persistencia
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import * as fc from 'fast-check'
import { saveState, loadState, clearState } from './persistence'

// Mock de sessionStorage en memoria
function createStorageMock() {
  let store = {}
  return {
    getItem: vi.fn((k) => store[k] ?? null),
    setItem: vi.fn((k, v) => { store[k] = v }),
    removeItem: vi.fn((k) => { delete store[k] }),
    reset: () => { store = {} },
  }
}

let storageMock

beforeEach(() => {
  storageMock = createStorageMock()
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(storageMock.getItem)
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(storageMock.setItem)
  vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(storageMock.removeItem)
})

afterEach(() => {
  vi.restoreAllMocks()
})

// Arbitrario de CardState
const cardStateArb = fc.record({
  id: fc.nat(),
  flag: fc.record({
    name: fc.string({ minLength: 1, maxLength: 30 }).filter((s) => s.trim().length > 0),
    flag: fc.webUrl(),
  }),
  isFlipped: fc.boolean(),
  isMatched: fc.boolean(),
})

// Arbitrario de GameState sin `screen`
const gameStateArb = fc.record({
  mode: fc.constantFrom('single', 'versus'),
  difficulty: fc.constantFrom('easy', 'medium', 'hard'),
  cards: fc.array(cardStateArb, { minLength: 0, maxLength: 20 }),
  flippedIds: fc.array(fc.nat(), { maxLength: 2 }),
  currentPlayer: fc.constantFrom(1, 2),
  pairsP1: fc.nat({ max: 10 }),
  pairsP2: fc.nat({ max: 10 }),
  elapsedSeconds: fc.nat({ max: 3600 }),
})

describe('Property 4 — round-trip de persistencia', () => {
  it('loadState(saveState(state)) retorna un objeto idéntico al original', () => {
    fc.assert(
      fc.property(gameStateArb, (state) => {
        storageMock.reset()
        saveState(state)
        const restored = loadState()
        expect(restored).not.toBeNull()
        expect(restored.mode).toBe(state.mode)
        expect(restored.difficulty).toBe(state.difficulty)
        expect(restored.currentPlayer).toBe(state.currentPlayer)
        expect(restored.pairsP1).toBe(state.pairsP1)
        expect(restored.pairsP2).toBe(state.pairsP2)
        expect(restored.elapsedSeconds).toBe(state.elapsedSeconds)
        expect(restored.cards).toHaveLength(state.cards.length)
        for (let i = 0; i < state.cards.length; i++) {
          expect(restored.cards[i].id).toBe(state.cards[i].id)
          expect(restored.cards[i].flag.name).toBe(state.cards[i].flag.name)
          expect(restored.cards[i].isFlipped).toBe(state.cards[i].isFlipped)
          expect(restored.cards[i].isMatched).toBe(state.cards[i].isMatched)
        }
      })
    )
  })
})
