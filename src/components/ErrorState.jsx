import { motion } from 'framer-motion'

/**
 * @param {{ message: string, onRetry: () => void }} props
 */
export default function ErrorState({ message, onRetry }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 flex flex-col items-center justify-center gap-6 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-red-900/40 border border-red-500/50 rounded-2xl p-8 max-w-md w-full text-center flex flex-col gap-4"
        role="alert"
      >
        <span className="text-4xl" aria-hidden="true">🚩</span>
        <h2 className="text-red-300 text-xl font-bold">No se pudieron cargar las banderas</h2>
        <p className="text-red-200/80 text-sm">{message}</p>
        <button
          onClick={onRetry}
          className="mt-2 px-6 py-3 bg-red-500 hover:bg-red-400 active:scale-95 transition-all rounded-xl text-white font-semibold"
        >
          Reintentar
        </button>
      </motion.div>
    </div>
  )
}
