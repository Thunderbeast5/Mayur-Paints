import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'

const Toast = ({ 
  message, 
  type = 'info', 
  duration = 3000, 
  onClose,
  position = 'bottom-right'
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const typeStyles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-amber-500 text-white',
    info: 'bg-blue-500 text-white'
  }

  const icons = {
    success: 'check_circle',
    error: 'error',
    warning: 'warning',
    info: 'info'
  }

  const positions = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2'
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.3 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.5, transition: { duration: 0.2 } }}
        className={`fixed z-50 ${positions[position]} px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 ${typeStyles[type]}`}
      >
        <span className="material-symbols-outlined text-xl">
          {icons[type]}
        </span>
        <div>
          <div className="font-bold">{message.title}</div>
          {message.description && (
            <div className="text-sm opacity-90">{message.description}</div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

// Toast Container Component
export const ToastContainer = ({ toasts, position = 'bottom-right' }) => {
  return (
    <div className={`fixed ${position} z-50 space-y-2`}>
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            position={position}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

export default Toast
