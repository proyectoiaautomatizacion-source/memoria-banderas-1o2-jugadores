/**
 * Módulo de persistencia del estado de partida en sessionStorage.
 * Clave principal: memoria-banderas-state
 * Versión del esquema: 1 (descarta automáticamente versiones anteriores)
 */

const STATE_KEY = 'memoria-banderas-state'
const SCHEMA_VERSION = 1

/**
 * Guarda el estado de partida en sessionStorage (sin el campo `screen`).
 * @param {object} state - GameState sin `screen`
 */
export function saveState(state) {
  try {
    const payload = JSON.stringify({ __v: SCHEMA_VERSION, ...state })
    sessionStorage.setItem(STATE_KEY, payload)
  } catch (err) {
    console.info('[persistence] No se pudo guardar el estado:', err.message)
  }
}

/**
 * Carga el estado desde sessionStorage.
 * Retorna null si no hay estado, está corrupto o es de versión incompatible.
 * @returns {object|null}
 */
export function loadState() {
  try {
    const raw = sessionStorage.getItem(STATE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed.__v !== SCHEMA_VERSION) {
      console.info('[persistence] Versión de estado incompatible; descartando.')
      clearState()
      return null
    }
    const { __v: _v, ...state } = parsed
    // Validación mínima de estructura
    if (!Array.isArray(state.cards) || !state.mode || !state.difficulty) {
      clearState()
      return null
    }
    return state
  } catch (err) {
    console.info('[persistence] Estado corrupto en sessionStorage; descartando:', err.message)
    clearState()
    return null
  }
}

/**
 * Elimina el estado de partida de sessionStorage.
 */
export function clearState() {
  try {
    sessionStorage.removeItem(STATE_KEY)
  } catch {
    // Silencioso: si no se puede limpiar no es crítico
  }
}
