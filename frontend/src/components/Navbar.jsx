import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 bg-bg-secondary/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-accent-light hover:text-accent transition-colors">
            <span className="text-2xl">🎬</span>
            <span>AnimaListy</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-text-secondary hover:text-text-primary transition-colors text-sm font-medium">
              Home
            </Link>
            <Link to="/catalog" className="text-text-secondary hover:text-text-primary transition-colors text-sm font-medium">
              Catálogo
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="text-text-secondary hover:text-text-primary transition-colors text-sm font-medium">
                  Perfil
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-text-primary bg-accent hover:bg-accent-dark rounded-lg transition-colors"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-text-primary border border-border hover:border-accent rounded-lg transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-text-primary bg-accent hover:bg-accent-dark rounded-lg transition-colors"
                >
                  Cadastrar
                </Link>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden p-2 text-text-secondary hover:text-text-primary transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-bg-secondary border-t border-border px-4 py-4 space-y-3">
          <Link to="/" onClick={() => setMenuOpen(false)} className="block text-text-secondary hover:text-text-primary transition-colors text-sm font-medium">
            Home
          </Link>
          <Link to="/catalog" onClick={() => setMenuOpen(false)} className="block text-text-secondary hover:text-text-primary transition-colors text-sm font-medium">
            Catálogo
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="block text-text-secondary hover:text-text-primary transition-colors text-sm font-medium">
                Perfil
              </Link>
              <button onClick={handleLogout} className="w-full px-4 py-2 text-sm font-medium text-text-primary bg-accent hover:bg-accent-dark rounded-lg transition-colors">
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block text-center px-4 py-2 text-sm font-medium text-text-primary border border-border hover:border-accent rounded-lg transition-colors">
                Entrar
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="block text-center px-4 py-2 text-sm font-medium text-text-primary bg-accent hover:bg-accent-dark rounded-lg transition-colors">
                Cadastrar
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
