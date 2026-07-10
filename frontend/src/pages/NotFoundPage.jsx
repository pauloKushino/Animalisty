import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="text-8xl font-bold text-accent/20 mb-4">404</div>
      <h1 className="text-3xl font-bold text-text-primary mb-2">Página não encontrada</h1>
      <p className="text-text-secondary mb-8 max-w-md">
        Ops! A página que você está procurando não existe ou foi movida.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-accent hover:bg-accent-dark text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-accent/20"
      >
        Voltar ao Início
      </Link>
    </div>
  )
}
