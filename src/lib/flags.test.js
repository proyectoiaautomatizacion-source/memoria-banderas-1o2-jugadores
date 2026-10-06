import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { buildBoard, arePair, loadFlags } from './flags'

// --------------- buildBoard ---------------

const mockFlags = Array.from({ length: 15 }, (_, i) => ({
  name: `Country${i}`,
  flag: `https://example.com/flag${i}.png`,
}))

describe('buildBoard', () => {
  it('genera 12 cartas para dificultad easy (6 pares)', () => {
    const cards = buildBoard(mockFlags, 'easy')
    expect(cards).toHaveLength(12)
  })

  it('genera 16 cartas para dificultad medium (8 pares)', () => {
    const cards = buildBoard(mockFlags, 'medium')
    expect(cards).toHaveLength(16)
  })

  it('genera 20 cartas para dificultad hard (10 pares)', () => {
    const cards = buildBoard(mockFlags, 'hard')
    expect(cards).toHaveLength(20)
  })

  it('cada bandera aparece exactamente 2 veces', () => {
    const cards = buildBoard(mockFlags, 'easy')
    const counts = new Map()
    for (const c of cards) {
      counts.set(c.flag.name, (counts.get(c.flag.name) ?? 0) + 1)
    }
    for (const count of counts.values()) {
      expect(count).toBe(2)
    }
  })

  it('todas las banderas del tablero provienen del conjunto de entrada', () => {
    const inputNames = new Set(mockFlags.map((f) => f.name))
    const cards = buildBoard(mockFlags, 'hard')
    for (const c of cards) {
      expect(inputNames.has(c.flag.name)).toBe(true)
    }
  })

  it('las cartas comienzan boca abajo y sin emparejar', () => {
    const cards = buildBoard(mockFlags, 'easy')
    for (const c of cards) {
      expect(c.isFlipped).toBe(false)
      expect(c.isMatched).toBe(false)
    }
  })

  it('los ids son únicos', () => {
    const cards = buildBoard(mockFlags, 'medium')
    const ids = cards.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

// --------------- arePair ---------------

describe('arePair', () => {
  const flagA = { name: 'España', flag: 'https://x.com/es.png' }
  const flagB = { name: 'Francia', flag: 'https://x.com/fr.png' }

  it('retorna true para dos cartas con la misma bandera', () => {
    expect(arePair({ flag: flagA }, { flag: flagA })).toBe(true)
  })

  it('retorna false para dos cartas con banderas distintas', () => {
    expect(arePair({ flag: flagA }, { flag: flagB })).toBe(false)
  })

  it('siempre retorna un booleano', () => {
    const result = arePair({ flag: flagA }, { flag: flagB })
    expect(typeof result).toBe('boolean')
  })
})

// --------------- loadFlags ---------------

describe('loadFlags', () => {
  beforeEach(() => {
    // Mock de sessionStorage
    const store = {}
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation((k) => store[k] ?? null)
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation((k, v) => { store[k] = v })
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation((k) => { delete store[k] })

    // Mock de fetch — formato de la nueva API v5
    const mockObjects = Array.from({ length: 15 }, (_, i) => ({
      names: { common: `Country${i}` },
      flag: { url_png: `https://flags.example.com/flag${i}.png` },
    }))

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          objects: mockObjects,
          meta: { count: mockObjects.length, more: false, total: mockObjects.length },
        },
      }),
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('retorna el número correcto de cartas para easy', async () => {
    const cards = await loadFlags('easy')
    expect(cards).toHaveLength(12)
  })

  it('retorna el número correcto de cartas para medium', async () => {
    const cards = await loadFlags('medium')
    expect(cards).toHaveLength(16)
  })

  it('retorna el número correcto de cartas para hard', async () => {
    const cards = await loadFlags('hard')
    expect(cards).toHaveLength(20)
  })

  it('lanza error si fetch falla', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))
    await expect(loadFlags('easy')).rejects.toThrow()
  })

  it('lanza error si la respuesta no es ok', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => 'Internal Server Error',
    })
    await expect(loadFlags('easy')).rejects.toThrow()
  })
})
