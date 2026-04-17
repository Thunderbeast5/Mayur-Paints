import { motion } from 'framer-motion'

const LoadingSkeleton = ({ 
  className = '', 
  variant = 'default',
  lines = 3,
  height = 'h-4',
  width = 'w-full'
}) => {
  const baseClasses = "bg-slate-200 dark:bg-slate-700 rounded animate-pulse"
  
  if (variant === 'card') {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 ${className}`}
      >
        <div className="space-y-4">
          <div className={`${baseClasses} h-48 w-full rounded-xl`} />
          <div className={`${baseClasses} h-6 w-3/4`} />
          <div className={`${baseClasses} h-4 w-full`} />
          <div className={`${baseClasses} h-4 w-2/3`} />
        </div>
      </motion.div>
    )
  }

  if (variant === 'product') {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden ${className}`}
      >
        <div className={`${baseClasses} h-48 w-full`} />
        <div className="p-5 space-y-3">
          <div className={`${baseClasses} h-5 w-3/4`} />
          <div className={`${baseClasses} h-4 w-1/2`} />
          <div className={`${baseClasses} h-6 w-1/3`} />
        </div>
      </motion.div>
    )
  }

  if (variant === 'text') {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`${baseClasses} ${height} ${i === lines - 1 ? 'w-3/4' : width}`}
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    )
  }

  if (variant === 'avatar') {
    return (
      <div className={`${baseClasses} w-12 h-12 rounded-full ${className}`} />
    )
  }

  if (variant === 'button') {
    return (
      <div className={`${baseClasses} h-10 w-24 rounded-lg ${className}`} />
    )
  }

  // Default variant
  return (
    <div className={`${baseClasses} ${height} ${width} ${className}`} />
  )
}

export default LoadingSkeleton
