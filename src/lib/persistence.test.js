import { describe, it, expect, beforeEach, vi } from 'vitest'
import { saveState, loadState, clearState } from './persistence'

// Mock de sessionStorage en memoria
function createStorageMock() {
  let store = {}
  return {
    getItem: vi.fn((k) => store[k] ?? null),
    setItem: vi.fn((k, v) => { store[k] = v }),
    removeItem: vi.fn((k) => { delete store[k] }),
    clear: () => { store = {} },
  }
}

describe('persistence', () => {
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

  const sampleState = {
    mode: 'single',
    difficulty: 'easy',
    cards: [{ id: 0, flag: { name: 'España', flag: 'url' }, isFlipped: false, isMatched: false }],
    flippedIds: [],
    currentPlayer: 1,
    pairsP1: 0,
    pairsP2: 0,
    elapsedSeconds: 42,
  }

  it('saveState guarda en sessionStorage', () => {
    saveState(sampleState)
    expect(storageMock.setItem).toHaveBeenCalledWith(
      'memoria-banderas-state',
      expect.any(String)
    )
  })

  it('loadState retorna null cuando no hay estado guardado', () => {
    expect(loadState()).toBeNull()
  })

  it('loadState restaura el estado guardado correctamente', () => {
    saveState(sampleState)
    const restored = loadState()
    expect(restored).toMatchObject(sampleState)
  })

  it('round-trip: loadState(saveState(state)) devuelve estado idéntico', () => {
    saveState(sampleState)
    const restored = loadState()
    expect(restored.mode).toBe(sampleState.mode)
    expect(restored.difficulty).toBe(sampleState.difficulty)
    expect(restored.elapsedSeconds).toBe(sampleState.elapsedSeconds)
    expect(restored.currentPlayer).toBe(sampleState.currentPlayer)
    expect(restored.pairsP1).toBe(sampleState.pairsP1)
    expect(restored.pairsP2).toBe(sampleState.pairsP2)
    expect(restored.cards[0].id).toBe(sampleState.cards[0].id)
    expect(restored.cards[0].flag.name).toBe(sampleState.cards[0].flag.name)
  })

  it('clearState elimina el estado guardado', () => {
    saveState(sampleState)
    clearState()
    expect(loadState()).toBeNull()
  })

  it('loadState retorna null si el JSON está corrupto', () => {
    storageMock.getItem.mockReturnValue('{invalid json}')
    expect(loadState()).toBeNull()
  })

  it('loadState retorna null si la versión del esquema es diferente', () => {
    storageMock.getItem.mockReturnValue(JSON.stringify({ __v: 99, mode: 'single', difficulty: 'easy', cards: [] }))
    expect(loadState()).toBeNull()
  })
})
