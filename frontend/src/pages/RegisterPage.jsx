import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError('Preencha todos os campos.')
      return
    }

    if (form.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    if (form.password !== form.confirmPassword) {
      setError('As senhas não conferem.')
      return
    }

    setLoading(true)
    try {
      await register(form.name, form.email, form.password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao criar conta. Tente novamente.')
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
            <h1 className="text-2xl font-bold text-text-primary">Criar Conta</h1>
            <p className="text-text-secondary mt-2 text-sm">
              Junte-se ao AnimaListy
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
              <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1.5">
                Nome
              </label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-bg-primary border border-border rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors"
                placeholder="Seu nome"
                autoComplete="name"
              />
            </div>

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
                placeholder="Mínimo 6 caracteres"
                autoComplete="new-password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-secondary mb-1.5">
                Confirmar Senha
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                className="w-full px-4 py-2.5 bg-bg-primary border border-border rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors"
                placeholder="Repita a senha"
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-accent hover:bg-accent-dark text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center mt-6 text-sm text-text-muted">
            Já tem conta?{' '}
            <Link to="/login" className="text-accent-light hover:text-accent transition-colors font-medium">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
