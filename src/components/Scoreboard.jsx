import { motion } from 'framer-motion'

/**
 * Marcador para modo versus.
 * Resalta visualmente al jugador activo.
 *
 * @param {{
 *   pairsP1: number,
 *   pairsP2: number,
 *   currentPlayer: 1 | 2
 * }} props
 */
export default function Scoreboard({ pairsP1, pairsP2, currentPlayer }) {
  return (
    <div className="flex gap-3 w-full max-w-xs mx-auto" role="status" aria-live="polite" aria-label="Marcador">
      <PlayerScore
        label="Jugador 1"
        pairs={pairsP1}
        isActive={currentPlayer === 1}
        color="blue"
      />
      <PlayerScore
        label="Jugador 2"
        pairs={pairsP2}
        isActive={currentPlayer === 2}
        color="rose"
      />
    </div>
  )
}

function PlayerScore({ label, pairs, isActive, color }) {
  const activeClasses = {
    blue: 'bg-blue-500/30 border-blue-400 shadow-blue-500/30',
    rose: 'bg-rose-500/30 border-rose-400 shadow-rose-500/30',
  }
  const inactiveClasses = 'bg-white/5 border-white/15 opacity-60'

  return (
    <motion.div
      animate={{ scale: isActive ? 1 : 0.97 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`flex-1 rounded-xl border-2 p-3 flex flex-col items-center gap-1 shadow-md transition-colors
        ${isActive ? activeClasses[color] : inactiveClasses}`}
      aria-current={isActive ? 'true' : undefined}
    >
      {isActive && (
        <span className="text-xs font-bold text-yellow-300 uppercase tracking-widest">
          ▶ Turno
        </span>
      )}
      <span className="text-white/80 text-xs font-semibold">{label}</span>
      <span className="text-3xl font-extrabold text-white">{pairs}</span>
      <span className="text-white/50 text-xs">pares</span>
    </motion.div>
  )
}
