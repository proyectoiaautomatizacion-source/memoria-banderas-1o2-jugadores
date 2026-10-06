import { motion } from 'framer-motion'

/**
 * Carta individual del tablero con animación de volteo 3D.
 *
 * @param {{
 *   card: import('../App.jsx').CardState,
 *   onClick: (id: number) => void,
 *   disabled: boolean
 * }} props
 */
export default function Card({ card, onClick, disabled }) {
  const isInteractable = !card.isFlipped && !card.isMatched && !disabled

  function handleClick() {
    if (isInteractable) onClick(card.id)
  }

  function handleKeyDown(e) {
    if (isInteractable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      onClick(card.id)
    }
  }

  return (
    <div
      className="perspective w-full aspect-[3/2]"
      style={{ perspective: '900px' }}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
        transition={{ duration: 0.45, type: 'spring', stiffness: 220, damping: 22 }}
      >
        {/* Cara trasera (boca abajo) */}
        <div
          className={`absolute inset-0 rounded-xl flex items-center justify-center cursor-pointer
            select-none backface-hidden transition-shadow
            ${isInteractable
              ? 'bg-gradient-to-br from-blue-700 to-indigo-800 hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-blue-700/50'
              : 'bg-gradient-to-br from-blue-800 to-indigo-900 opacity-70 cursor-default'}
            ${card.isMatched ? 'ring-2 ring-emerald-400/60' : ''}`}
          style={{ backfaceVisibility: 'hidden' }}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          role="button"
          tabIndex={isInteractable ? 0 : -1}
          aria-label="Carta boca abajo"
          aria-pressed={false}
        >
          <span className="text-3xl select-none" aria-hidden="true">🌐</span>
        </div>

        {/* Cara delantera (bandera) */}
        <div
          className={`absolute inset-0 rounded-xl overflow-hidden flex items-center justify-center
            backface-hidden shadow-md
            ${card.isMatched ? 'ring-2 ring-emerald-400 shadow-emerald-500/40' : ''}`}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
          aria-label={`Bandera de ${card.flag.name}`}
        >
          <img
            src={card.flag.flag}
            alt={`Bandera de ${card.flag.name}`}
            className="w-full h-full object-cover"
            draggable={false}
          />
          {card.isMatched && (
            <div className="absolute inset-0 bg-emerald-400/20 flex items-end justify-center pb-1">
              <span className="text-xs font-bold text-white bg-emerald-600/80 px-2 py-0.5 rounded-full truncate max-w-full">
                {card.flag.name}
              </span>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
