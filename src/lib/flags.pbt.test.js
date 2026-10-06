/**
 * Pruebas de propiedades (PBT) con fast-check para el módulo flags.
 * Property 1: Invariante del tablero generado por buildBoard
 * Property 5: Nunca-crash en arePair
 */
import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { buildBoard, arePair } from './flags'

// Nombres que colisionan con propiedades del prototipo de Object — los excluimos
// para evitar bugs falsos al usar objetos literales como contadores.
const OBJECT_PROTO_KEYS = new Set(
  Object.getOwnPropertyNames(Object.prototype)
)

// Arbitrario de bandera con nombre seguro (no colisiona con Object.prototype)
const flagArbitrary = fc.record({
  name: fc
    .string({ minLength: 1, maxLength: 30 })
    .filter((s) => s.trim().length > 0 && !OBJECT_PROTO_KEYS.has(s)),
  flag: fc.webUrl(),
})

// Arbitrario de lista de banderas con nombres únicos y longitud >= 10.
const flagListArbitrary = fc.uniqueArray(flagArbitrary, {
  minLength: 10,
  maxLength: 30,
  selector: (f) => f.name,
})

// Arbitrario de dificultad
const difficultyArbitrary = fc.constantFrom('easy', 'medium', 'hard')

const PAIRS_BY_DIFFICULTY = { easy: 6, medium: 8, hard: 10 }

// --------------- Property 1: Invariante del tablero generado ---------------

describe('Property 1 — invariante del tablero generado', () => {
  it('el tablero tiene exactamente 2*N cartas según la dificultad', () => {
    fc.assert(
      fc.property(flagListArbitrary, difficultyArbitrary, (flags, difficulty) => {
        const n = PAIRS_BY_DIFFICULTY[difficulty]
        const cards = buildBoard(flags, difficulty)
        return cards.length === 2 * n
      })
    )
  })

  it('cada bandera seleccionada aparece exactamente 2 veces', () => {
    fc.assert(
      fc.property(flagListArbitrary, difficultyArbitrary, (flags, difficulty) => {
        const cards = buildBoard(flags, difficulty)
        // Usamos Map para evitar colisiones con Object.prototype
        const counts = new Map()
        for (const c of cards) {
          counts.set(c.flag.name, (counts.get(c.flag.name) ?? 0) + 1)
        }
        return [...counts.values()].every((count) => count === 2)
      })
    )
  })

  it('todas las banderas del tablero provienen del conjunto de entrada', () => {
    fc.assert(
      fc.property(flagListArbitrary, difficultyArbitrary, (flags, difficulty) => {
        const inputNames = new Set(flags.map((f) => f.name))
        const cards = buildBoard(flags, difficulty)
        return cards.every((c) => inputNames.has(c.flag.name))
      })
    )
  })

  it('los ids son únicos en el tablero', () => {
    fc.assert(
      fc.property(flagListArbitrary, difficultyArbitrary, (flags, difficulty) => {
        const cards = buildBoard(flags, difficulty)
        const ids = cards.map((c) => c.id)
        return new Set(ids).size === ids.length
      })
    )
  })
})

// --------------- Property 5: Nunca-crash en arePair ---------------

const cardStateArbitrary = fc.record({
  id: fc.integer(),
  flag: flagArbitrary,
  isFlipped: fc.boolean(),
  isMatched: fc.boolean(),
})

describe('Property 5 — nunca-crash en arePair', () => {
  it('arePair nunca lanza excepción y siempre retorna boolean', () => {
    fc.assert(
      fc.property(cardStateArbitrary, cardStateArbitrary, (a, b) => {
        let result
        expect(() => { result = arePair(a, b) }).not.toThrow()
        expect(typeof result).toBe('boolean')
      })
    )
  })

  it('arePair es reflexivo (misma referencia de bandera)', () => {
    fc.assert(
      fc.property(cardStateArbitrary, (card) => {
        return arePair(card, card) === true
      })
    )
  })

  it('arePair es simétrico', () => {
    fc.assert(
      fc.property(cardStateArbitrary, cardStateArbitrary, (a, b) => {
        return arePair(a, b) === arePair(b, a)
      })
    )
  })
})
