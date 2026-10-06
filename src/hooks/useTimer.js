import { useEffect, useRef } from 'react'

/**
 * Hook de temporizador para el modo 1 jugador.
 * Arranca cuando `running` es true; se detiene cuando es false.
 * Llama a `onTick(seconds)` cada segundo.
 *
 * @param {boolean} running
 * @param {(seconds: number) => void} onTick
 */
export function useTimer(running, onTick) {
  const onTickRef = useRef(onTick)
  onTickRef.current = onTick

  useEffect(() => {
    if (!running) return

    const id = setInterval(() => {
      onTickRef.current((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(id)
  }, [running])
}

/**
 * Formatea segundos como MM:SS.
 * @param {number} totalSeconds
 * @returns {string}
 */
export function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0')
  const s = (totalSeconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}
