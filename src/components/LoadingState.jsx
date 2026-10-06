import { motion } from 'framer-motion'

export default function LoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 flex flex-col items-center justify-center gap-6">
      <motion.div
        className="w-16 h-16 rounded-full border-4 border-blue-400 border-t-transparent"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
        aria-hidden="true"
      />
      <p className="text-blue-200 text-lg font-medium tracking-wide">
        Cargando banderas…
      </p>
    </div>
  )
}
