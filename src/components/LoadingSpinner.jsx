export default function LoadingSpinner({ size = 'md', color = 'primary' }) {
  const sizes = { sm: 'w-5 h-5 border-2', md: 'w-8 h-8 border-4', lg: 'w-12 h-12 border-4' }
  const colors = { primary: 'border-primary/20 border-t-primary', emerald: 'border-emerald-500/20 border-t-emerald-500', white: 'border-white/20 border-t-white' }
  return (
    <div className={`${sizes[size]} ${colors[color]} rounded-full animate-spin`} />
  )
}
