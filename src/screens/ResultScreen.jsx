import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { useEffect } from 'react'
import { formatTime } from '../hooks/useTimer'

/**
 * @param {{
 *   game: import('../App.jsx').GameState,
 *   onReset: () => void
 * }} props
 */
export default function ResultScreen({ game, onReset }) {
  const { mode, pairsP1, pairsP2, elapsedSeconds } = game

  // Determinar resultado
  let winner = null
  let isDraw = false
  if (mode === 'versus') {
    if (pairsP1 > pairsP2) winner = 1
    else if (pairsP2 > pairsP1) winner = 2
    else isDraw = true
  }

  // Disparar confeti al montar
  useEffect(() => {
    const duration = 2500
    const end = Date.now() + duration

    function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#60a5fa', '#818cf8', '#34d399'],
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#f472b6', '#fbbf24', '#60a5fa'],
      })
      if (Date.now() < end) requestAnimationFrame(frame)
    }

    frame()
    console.info('[result] Pantalla de resultado mostrada.')
  }, [])

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 20 } },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white/10 backdrop-blur border border-white/20 rounded-3xl p-8 max-w-sm w-full flex flex-col items-center gap-6 text-center shadow-2xl"
        role="main"
        aria-label="Resultado de la partida"
      >
        {/* Icono / emoji de resultado */}
        <motion.div
          className="text-6xl"
          animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
          transition={{ duration: 0.8, delay: 0.3 }}
          aria-hidden="true"
        >
          {mode === 'single' ? '🏆' : isDraw ? '🤝' : '🥇'}
        </motion.div>

        <div className="flex flex-col gap-2">
          <h1 className="text-white text-2xl font-extrabold">
            {mode === 'single' && '¡Partida completada!'}
            {mode === 'versus' && !isDraw && `¡Gana el Jugador ${winner}!`}
            {mode === 'versus' && isDraw && '¡Empate!'}
          </h1>
          <p className="text-blue-300 text-sm">
            {mode === 'single' ? 'Tiempo final' : 'Marcador final'}
          </p>
        </div>

        {/* Resultado */}
        {mode === 'single' && (
          <div className="bg-blue-500/20 border border-blue-400/30 rounded-2xl px-8 py-4 w-full">
            <p
              className="text-4xl font-mono font-extrabold text-white tabular-nums"
              aria-label={`Tiempo: ${formatTime(elapsedSeconds)}`}
            >
              {formatTime(elapsedSeconds)}
            </p>
            <p className="text-blue-300 text-xs mt-1">minutos : segundos</p>
          </div>
        )}

        {mode === 'versus' && (
          <div className="w-full flex gap-3">
            <ScoreCard
              label="Jugador 1"
              pairs={pairsP1}
              highlight={winner === 1}
              color="blue"
            />
            <ScoreCard
              label="Jugador 2"
              pairs={pairsP2}
              highlight={winner === 2}
              color="rose"
            />
          </div>
        )}

        {/* Botón reiniciar */}
        <motion.button
          onClick={onReset}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-white font-bold text-base shadow-lg cursor-pointer transition-all"
        >
          Volver al menú
        </motion.button>
      </motion.div>
    </div>
  )
}

function ScoreCard({ label, pairs, highlight, color }) {
  const highlighted = {
    blue: 'bg-blue-500/30 border-blue-400 ring-2 ring-blue-400/40',
    rose: 'bg-rose-500/30 border-rose-400 ring-2 ring-rose-400/40',
  }
  const normal = 'bg-white/5 border-white/15 opacity-70'

  return (
    <div
      className={`flex-1 rounded-xl border-2 p-4 flex flex-col items-center gap-1 transition-all
        ${highlight ? highlighted[color] : normal}`}
    >
      {highlight && (
        <span className="text-xs font-bold text-yellow-300 uppercase tracking-wider">🏆 Ganador</span>
      )}
      <span className="text-white/70 text-xs font-semibold">{label}</span>
      <span className="text-3xl font-extrabold text-white">{pairs}</span>
      <span className="text-white/50 text-xs">pares</span>
    </div>
  )
}
