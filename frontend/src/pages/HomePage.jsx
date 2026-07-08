import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { animeService } from '../services/animeService'
import AnimeCard from '../components/AnimeCard'
import Spinner from '../components/Spinner'

export default function HomePage() {
  const [seasonAnime, setSeasonAnime] = useState([])
  const [topAnime, setTopAnime] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [seasonRes, topRes] = await Promise.all([
          animeService.getSeasonNow(),
          animeService.getTopAnime(),
        ])
        const season = seasonRes.data?.data || []
        const top = topRes.data?.data || []
        // Deduplicate by mal_id to avoid React key conflicts
        setSeasonAnime(season.filter((a, i, arr) => arr.findIndex((x) => x.mal_id === a.mal_id) === i))
        setTopAnime(top.filter((a, i, arr) => arr.findIndex((x) => x.mal_id === a.mal_id) === i))
      } catch (err) {
        setError('Não foi possível carregar os animes. Tente novamente mais tarde.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-text-secondary">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12 md:py-20">
        <h1 className="text-4xl md:text-6xl font-bold text-text-primary mb-4">
          Descubra{' '}
          <span className="bg-gradient-to-r from-accent-light to-accent bg-clip-text text-transparent">
            Animes
          </span>{' '}
          Incríveis
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto mb-8">
          Explore o vasto mundo dos animes. Avalie, comente e organize sua lista pessoal com os animes que você ama.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            to="/catalog"
            className="px-6 py-3 bg-accent hover:bg-accent-dark text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-accent/20"
          >
            Explorar Catálogo
          </Link>
          <Link
            to="/register"
            className="px-6 py-3 border border-border hover:border-accent text-text-primary font-semibold rounded-xl transition-all"
          >
            Criar Conta
          </Link>
        </div>
      </section>

      {/* Season Anime */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-text-primary">📺 Animes da Temporada</h2>
          <Link to="/catalog" className="text-sm text-accent-light hover:text-accent transition-colors">
            Ver todos →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {seasonAnime.slice(0, 10).map((anime) => (
            <AnimeCard key={anime.mal_id} anime={anime} />
          ))}
        </div>
      </section>

      {/* Top Anime */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-text-primary">🏆 Mais Populares</h2>
          <Link to="/catalog" className="text-sm text-accent-light hover:text-accent transition-colors">
            Ver todos →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {topAnime.slice(0, 10).map((anime) => (
            <AnimeCard key={anime.mal_id} anime={anime} />
          ))}
        </div>
      </section>
    </div>
  )
}
