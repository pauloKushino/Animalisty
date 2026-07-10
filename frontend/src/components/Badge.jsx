const variants = {
  accent: 'bg-accent/10 text-accent-light',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  error: 'bg-error/10 text-error',
  info: 'bg-accent/10 text-accent-light',
  default: 'bg-bg-card text-text-secondary border border-border',
}

const sizes = {
  sm: 'text-[10px] px-1.5 py-0.5',
  md: 'text-xs px-2.5 py-1',
  lg: 'text-sm px-3 py-1.5',
}

export default function Badge({ children, variant = 'accent', size = 'sm', className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${variants[variant] || variants.default} ${sizes[size] || sizes.sm} ${className}`}
    >
      {children}
    </span>
  )
}
