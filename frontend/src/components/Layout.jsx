import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function Layout() {
  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-bg-secondary border-t border-border py-6 text-center text-sm text-text-muted">
        <div className="max-w-7xl mx-auto px-4">
          <p>AnimaListy &copy; {new Date().getFullYear()} — Dados fornecidos pela <a href="https://jikan.moe" target="_blank" rel="noopener noreferrer" className="text-accent-light hover:text-accent transition-colors">Jikan API</a></p>
        </div>
      </footer>
    </div>
  )
}
