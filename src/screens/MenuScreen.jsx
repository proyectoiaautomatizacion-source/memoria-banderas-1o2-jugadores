import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

const MODES = [
  { value: 'single', label: '1 Jugador', emoji: '🧑', desc: 'Contra el reloj' },
  { value: 'versus', label: '2 Jugadores', emoji: '🧑‍🤝‍🧑', desc: 'Por turnos' },
]

const DIFFICULTIES = [
  { value: 'easy', label: 'Fácil', emoji: '🌱', desc: '6 pares' },
  { value: 'medium', label: 'Medio', emoji: '🌿', desc: '8 pares' },
  { value: 'hard', label: 'Difícil', emoji: '🌳', desc: '10 pares' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } },
}

/**
 * @param {{ onStart: (mode: string, difficulty: string) => void }} props
 */
export default function MenuScreen({ onStart }) {
  const [selectedMode, setSelectedMode] = useState(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState(null)

  const canStart = selectedMode !== null && selectedDifficulty !== null

  function handleStart() {
    if (!canStart) return
    onStart(selectedMode, selectedDifficulty)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-lg flex flex-col gap-8"
      >
        {/* Título */}
        <motion.div variants={itemVariants} className="text-center">
          <motion.div
            className="text-6xl mb-3"
            animate={{ rotateY: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 4, ease: 'easeInOut' }}
            aria-hidden="true"
          >
            🌍
          </motion.div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Memoria de Banderas
          </h1>
          <p className="text-blue-300 mt-2 text-base">
            Encuentra todos los pares
          </p>
        </motion.div>

        {/* Selección de modo */}
        <motion.div variants={itemVariants}>
          <h2 className="text-blue-200 font-semibold text-sm uppercase tracking-widest mb-3">
            Modo de juego
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {MODES.map((m) => (
              <motion.button
                key={m.value}
                onClick={() => setSelectedMode(m.value)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`rounded-2xl p-4 flex flex-col items-center gap-2 border-2 transition-colors cursor-pointer
                  ${selectedMode === m.value
                    ? 'bg-blue-500/30 border-blue-400 text-white'
                    : 'bg-white/5 border-white/10 text-blue-100 hover:border-blue-400/60'}`}
                aria-pressed={selectedMode === m.value}
              >
                <span className="text-3xl" aria-hidden="true">{m.emoji}</span>
                <span className="font-bold text-sm">{m.label}</span>
                <span className="text-xs text-blue-300">{m.desc}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Selección de dificultad */}
        <motion.div variants={itemVariants}>
          <h2 className="text-blue-200 font-semibold text-sm uppercase tracking-widest mb-3">
            Dificultad
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {DIFFICULTIES.map((d) => (
              <motion.button
                key={d.value}
                onClick={() => setSelectedDifficulty(d.value)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`rounded-2xl p-4 flex flex-col items-center gap-2 border-2 transition-colors cursor-pointer
                  ${selectedDifficulty === d.value
                    ? 'bg-emerald-500/30 border-emerald-400 text-white'
                    : 'bg-white/5 border-white/10 text-blue-100 hover:border-emerald-400/60'}`}
                aria-pressed={selectedDifficulty === d.value}
              >
                <span className="text-2xl" aria-hidden="true">{d.emoji}</span>
                <span className="font-bold text-xs">{d.label}</span>
                <span className="text-xs text-blue-300">{d.desc}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Botón Iniciar */}
        <motion.div variants={itemVariants}>
          <AnimatePresence>
            {canStart && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <motion.button
                  onClick={handleStart}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-white font-bold text-lg shadow-lg shadow-blue-900/50 transition-all cursor-pointer"
                >
                  ¡Jugar!
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
          {!canStart && (
            <p className="text-center text-blue-400/70 text-sm mt-1">
              Selecciona modo y dificultad para continuar
            </p>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}
