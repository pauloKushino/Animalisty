import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { animeService } from '../services/animeService'
import AnimeCard from '../components/AnimeCard'
import Spinner from '../components/Spinner'

const GENRES = [
  { mal_id: 1, name: 'Action' },
  { mal_id: 2, name: 'Adventure' },
  { mal_id: 4, name: 'Comedy' },
  { mal_id: 8, name: 'Drama' },
  { mal_id: 10, name: 'Fantasy' },
  { mal_id: 14, name: 'Horror' },
  { mal_id: 7, name: 'Mystery' },
  { mal_id: 22, name: 'Romance' },
  { mal_id: 24, name: 'Sci-Fi' },
  { mal_id: 36, name: 'Slice of Life' },
  { mal_id: 30, name: 'Sports' },
  { mal_id: 37, name: 'Supernatural' },
  { mal_id: 18, name: 'Mecha' },
  { mal_id: 23, name: 'School' },
]

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [animeList, setAnimeList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const query = searchParams.get('q') || ''
  const genre = searchParams.get('genre') || ''
  const year = searchParams.get('year') || ''
  const orderBy = searchParams.get('orderBy') || ''
  const page = parseInt(searchParams.get('page') || '1', 10)

  const [searchInput, setSearchInput] = useState(query)

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== query) {
        const params = new URLSearchParams(searchParams)
        if (searchInput) {
          params.set('q', searchInput)
        } else {
          params.delete('q')
        }
        params.set('page', '1')
        setSearchParams(params)
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [searchInput])

  const fetchAnimes = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await animeService.searchAnime({ q: query, genre, year, orderBy, page })
      if (res.data?.error) {
        setError(res.data.message || 'API de busca temporariamente indisponível.')
        setAnimeList([])
      } else {
        setAnimeList(res.data?.data || [])
      }
    } catch (err) {
      setError('Erro ao carregar catálogo. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }, [query, genre, year, orderBy, page])

  useEffect(() => {
    fetchAnimes()
  }, [fetchAnimes])

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.set('page', '1')
    setSearchParams(params)
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Catálogo</h1>
        <p className="text-text-secondary">Explore milhares de animes</p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Buscar animes..."
          className="w-full pl-12 pr-4 py-3 bg-bg-secondary border border-border rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8">
        {/* Genre Filter */}
        <select
          value={genre}
          onChange={(e) => updateFilter('genre', e.target.value)}
          className="px-4 py-2 bg-bg-secondary border border-border rounded-xl text-text-primary text-sm focus:outline-none focus:border-accent transition-colors"
        >
          <option value="">Todos os gêneros</option>
          {GENRES.map((g) => (
            <option key={g.mal_id} value={g.mal_id}>{g.name}</option>
          ))}
        </select>

        {/* Year Filter */}
        <select
          value={year}
          onChange={(e) => updateFilter('year', e.target.value)}
          className="px-4 py-2 bg-bg-secondary border border-border rounded-xl text-text-primary text-sm focus:outline-none focus:border-accent transition-colors"
        >
          <option value="">Todos os anos</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        {/* Order By */}
        <select
          value={orderBy}
          onChange={(e) => updateFilter('orderBy', e.target.value)}
          className="px-4 py-2 bg-bg-secondary border border-border rounded-xl text-text-primary text-sm focus:outline-none focus:border-accent transition-colors"
        >
          <option value="">Ordenar por</option>
          <option value="popularity">Popularidade</option>
          <option value="score">Nota</option>
          <option value="start_date">Mais Recentes</option>
          <option value="name">Nome</option>
        </select>

        {/* Clear Filters */}
        {(query || genre || year || orderBy) && (
          <button
            onClick={() => setSearchParams({})}
            className="px-4 py-2 text-sm text-accent-light hover:text-accent transition-colors"
          >
            Limpar filtros
          </button>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-text-secondary mb-4">{error}</p>
          <button
            onClick={fetchAnimes}
            className="px-4 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      ) : animeList.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-secondary text-lg">Nenhum anime encontrado.</p>
          <p className="text-text-muted text-sm mt-2">Tente ajustar os filtros ou buscar por outro termo.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {animeList.map((anime) => (
              <AnimeCard key={anime.mal_id} anime={anime} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              disabled={page <= 1}
              onClick={() => updateFilter('page', String(page - 1))}
              className="px-4 py-2 bg-bg-secondary border border-border rounded-xl text-text-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:border-accent transition-colors"
            >
              ← Anterior
            </button>
            <span className="text-text-secondary text-sm">Página {page}</span>
            <button
              disabled={animeList.length < 25}
              onClick={() => updateFilter('page', String(page + 1))}
              className="px-4 py-2 bg-bg-secondary border border-border rounded-xl text-text-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:border-accent transition-colors"
            >
              Próxima →
            </button>
          </div>
        </>
      )}
    </div>
  )
}
