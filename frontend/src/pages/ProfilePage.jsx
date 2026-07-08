import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { animeService } from '../services/animeService'
import AnimeCard from '../components/AnimeCard'
import Spinner from '../components/Spinner'

const TABS = [
  { key: '', label: 'Todos', icon: '📋' },
  { key: 'WATCHING', label: 'Assistindo', icon: '▶️' },
  { key: 'COMPLETED', label: 'Concluído', icon: '✅' },
  { key: 'PLAN_TO_WATCH', label: 'Planejo Assistir', icon: '📌' },
  { key: 'DROPPED', label: 'Dropado', icon: '⛔' },
  { key: 'FAVORITES', label: 'Favoritos', icon: '❤️' },
]

export default function ProfilePage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('')
  const [animeList, setAnimeList] = useState([])
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({ watching: 0, completed: 0, planToWatch: 0, dropped: 0 })

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        if (activeTab === 'FAVORITES') {
          const res = await animeService.getFavorites()
          setFavorites(res.data || [])
        } else {
          const status = activeTab || undefined
          const res = await animeService.getUserList(status)
          setAnimeList(res.data || [])
        }
      } catch {
        // Handle error
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [activeTab])

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await animeService.getUserList()
        const list = res.data || []
        setStats({
          watching: list.filter((item) => item.status === 'WATCHING').length,
          completed: list.filter((item) => item.status === 'COMPLETED').length,
          planToWatch: list.filter((item) => item.status === 'PLAN_TO_WATCH').length,
          dropped: list.filter((item) => item.status === 'DROPPED').length,
        })
      } catch {
        // Handle error
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="bg-bg-secondary rounded-2xl p-8 border border-border mb-8">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent to-accent-light flex items-center justify-center text-white text-3xl font-bold">
            {user?.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">{user?.name || 'Usuário'}</h1>
            <p className="text-text-secondary text-sm">{user?.email}</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-bg-card rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-accent-light">{stats.completed}</p>
            <p className="text-text-muted text-xs mt-1">Concluídos</p>
          </div>
          <div className="bg-bg-card rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-accent-light">{stats.watching}</p>
            <p className="text-text-muted text-xs mt-1">Assistindo</p>
          </div>
          <div className="bg-bg-card rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-accent-light">{stats.planToWatch}</p>
            <p className="text-text-muted text-xs mt-1">Planejo Assistir</p>
          </div>
          <div className="bg-bg-card rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-accent-light">{stats.dropped}</p>
            <p className="text-text-muted text-xs mt-1">Dropados</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-accent text-white'
                : 'bg-bg-secondary text-text-secondary hover:text-text-primary border border-border'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <Spinner size="lg" />
        </div>
      ) : activeTab === 'FAVORITES' ? (
        favorites.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text-secondary">Nenhum favorito ainda.</p>
            <p className="text-text-muted text-sm mt-2">Explore o catálogo e favorite seus animes!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {favorites.map((fav) => (
              <AnimeCard key={fav.animeId} anime={fav} />
            ))}
          </div>
        )
      ) : animeList.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-secondary">Nenhum anime encontrado nesta lista.</p>
          <p className="text-text-muted text-sm mt-2">Adicione animes à sua lista na página de detalhes!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {animeList.map((item) => (
            <AnimeCard key={`${item.animeId}-${item.status}`} anime={item} />
          ))}
        </div>
      )}
    </div>
  )
}
