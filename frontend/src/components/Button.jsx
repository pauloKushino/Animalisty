import { Link } from 'react-router-dom'

const variants = {
  primary: 'bg-accent hover:bg-accent-dark text-white shadow-lg shadow-accent/20 hover:shadow-accent/30',
  secondary: 'bg-bg-secondary border border-border hover:border-accent text-text-primary',
  ghost: 'text-text-secondary hover:text-text-primary hover:bg-bg-card',
  danger: 'bg-error/20 border border-error/40 text-error hover:bg-error/30',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base font-semibold',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  to,
  href,
  disabled = false,
  loading = false,
  className = '',
  ...props
}) {
  const base = `inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent/30 ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`

  if (to) {
    return (
      <Link to={to} className={base} {...props}>
        {loading && <SpinnerIcon />}
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={base} {...props}>
        {loading && <SpinnerIcon />}
        {children}
      </a>
    )
  }

  return (
    <button disabled={disabled || loading} className={base} {...props}>
      {loading && <SpinnerIcon />}
      {children}
    </button>
  )
}

function SpinnerIcon() {
  return (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}
