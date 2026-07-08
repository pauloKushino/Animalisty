import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.email || !form.password) {
      setError('Preencha todos os campos.')
      return
    }

    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Email ou senha inválidos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-bg-secondary rounded-2xl p-8 border border-border">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-text-primary">Entrar</h1>
            <p className="text-text-secondary mt-2 text-sm">
              Bem-vindo de volta ao AnimaListy
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-3 bg-error/10 border border-error/30 rounded-lg text-error text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2.5 bg-bg-primary border border-border rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors"
                placeholder="seu@email.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-1.5">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-2.5 bg-bg-primary border border-border rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors"
                placeholder="Sua senha"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-accent hover:bg-accent-dark text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center mt-6 text-sm text-text-muted">
            Não tem conta?{' '}
            <Link to="/register" className="text-accent-light hover:text-accent transition-colors font-medium">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
