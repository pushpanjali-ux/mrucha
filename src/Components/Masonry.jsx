import { motion, AnimatePresence } from "framer-motion"

export default function Masonry({ children, className = "" }) {
  return (
    <div className={`columns-1 sm:columns-2 md:columns-3 gap-8 ${className}`}>
      <AnimatePresence>
        {children.map((child, i) => (
          <motion.div
            key={i}
            layout
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="mb-4 break-inside-avoid"
          >
            {child}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

