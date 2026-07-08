import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { animeService } from '../services/animeService'
import Spinner from '../components/Spinner'

export default function AnimeDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [anime, setAnime] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Rating
  const [userScore, setUserScore] = useState(0)
  const [avgScore, setAvgScore] = useState(null)
  const [ratingLoading, setRatingLoading] = useState(false)

  // Favorite
  const [isFavorite, setIsFavorite] = useState(false)

  // Comments
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [editingComment, setEditingComment] = useState(null)
  const [editContent, setEditContent] = useState('')

  // My List
  const [listStatus, setListStatus] = useState('')

  useEffect(() => {
    async function fetchAnime() {
      setLoading(true)
      setError(null)
      try {
        const res = await animeService.getAnimeById(id)
        setAnime(res.data.data)
      } catch (err) {
        setError('Não foi possível carregar os detalhes do anime.')
      } finally {
        setLoading(false)
      }
    }
    fetchAnime()
  }, [id])

  useEffect(() => {
    if (!isAuthenticated) return

    async function fetchUserData() {
      try {
        const [ratingRes, favRes, commentsRes, listRes] = await Promise.all([
          animeService.getRating(id).catch(() => null),
          animeService.getFavorites().catch(() => null),
          animeService.getComments(id).catch(() => null),
          animeService.getUserList().catch(() => null),
        ])

        if (ratingRes?.data) {
          setAvgScore(ratingRes.data.average)
          setUserScore(ratingRes.data.userScore || 0)
        }

        if (favRes?.data) {
          setIsFavorite(favRes.data.some((f) => f.animeId === parseInt(id)))
        }

        if (commentsRes?.data) {
          setComments(commentsRes.data)
        }

        if (listRes?.data) {
          const entry = listRes.data.find((item) => item.animeId === parseInt(id))
          if (entry) setListStatus(entry.status)
        }
      } catch {
        // Silently fail for user-specific data
      }
    }
    fetchUserData()
  }, [id, isAuthenticated])

  // ── Rating Handler ──
  const handleRating = async (score) => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    setRatingLoading(true)
    try {
      await animeService.submitRating(id, score)
      setUserScore(score)
      // Refetch average
      const res = await animeService.getRating(id)
      setAvgScore(res.data.average)
    } catch {
      // Handle error silently
    } finally {
      setRatingLoading(false)
    }
  }

  // ── Favorite Handler ──
  const handleFavorite = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    try {
      await animeService.toggleFavorite(id)
      setIsFavorite(!isFavorite)
    } catch {
      // Handle error silently
    }
  }

  // ── Comment Handlers ──
  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return
    try {
      const res = await animeService.createComment(id, newComment)
      setComments((prev) => [...prev, res.data])
      setNewComment('')
    } catch {
      // Handle error silently
    }
  }

  const handleUpdateComment = async (commentId) => {
    if (!editContent.trim()) return
    try {
      const res = await animeService.updateComment(commentId, editContent)
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? { ...c, content: res.data.content, updatedAt: res.data.updatedAt } : c))
      )
      setEditingComment(null)
      setEditContent('')
    } catch {
      // Handle error silently
    }
  }

  const handleDeleteComment = async (commentId) => {
    try {
      await animeService.deleteComment(commentId)
      setComments((prev) => prev.filter((c) => c.id !== commentId))
    } catch {
      // Handle error silently
    }
  }

  // ── List Status Handler ──
  const handleListStatus = async (status) => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    try {
      if (status === 'REMOVE') {
        await animeService.removeFromList(id)
        setListStatus('')
      } else {
        await animeService.updateListStatus(id, status)
        setListStatus(status)
      }
    } catch {
      // Handle error silently
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !anime) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-text-secondary">{error || 'Anime não encontrado.'}</p>
        <button
          onClick={() => navigate('/catalog')}
          className="px-4 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg transition-colors"
        >
          Voltar ao catálogo
        </button>
      </div>
    )
  }

  const {
    title,
    title_japanese,
    images,
    synopsis,
    score,
    rank,
    popularity,
    status: animeStatus,
    episodes,
    type,
    source,
    season,
    year,
    studios,
    genres,
    themes,
    background,
    url,
  } = anime

  return (
    <div>
      {/* Banner Background */}
      <div className="relative h-64 md:h-96 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${images?.jpg?.large_image_url})`,
            filter: 'blur(20px)',
            transform: 'scale(1.1)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 md:-mt-48 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0 w-48 md:w-64">
            <img
              src={images?.jpg?.large_image_url}
              alt={title}
              className="w-full rounded-2xl shadow-2xl shadow-accent/10"
            />
          </div>

          {/* Info */}
          <div className="flex-1 pt-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-text-primary">{title}</h1>
                {title_japanese && (
                  <p className="text-text-muted text-lg mt-1">{title_japanese}</p>
                )}
              </div>

              {/* Favorite Button */}
              <button
                onClick={handleFavorite}
                className={`p-3 rounded-xl transition-all ${
                  isFavorite
                    ? 'bg-error/20 text-error'
                    : 'bg-bg-card text-text-muted hover:text-error hover:bg-error/10'
                }`}
              >
                <svg className="w-6 h-6" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* Genres */}
            {genres && genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {genres.map((g) => (
                  <span key={g.mal_id} className="px-3 py-1 text-xs font-medium bg-accent/10 text-accent-light rounded-full">
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            {/* Stats */}
            <div className="flex flex-wrap gap-6 mt-6">
              {score && (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-text-primary font-bold text-lg">{score}</span>
                </div>
              )}
              {rank && <span className="text-text-secondary">Rank #{rank}</span>}
              {popularity && <span className="text-text-secondary">Popularidade #{popularity}</span>}
              {episodes && <span className="text-text-secondary">{episodes} episódios</span>}
              {type && <span className="text-text-secondary">{type}</span>}
              {season && year && <span className="text-text-secondary">{season} {year}</span>}
            </div>

            {/* My List Status Selector */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-text-secondary mb-2">Minha Lista</label>
              <select
                value={listStatus}
                onChange={(e) => handleListStatus(e.target.value)}
                className="px-4 py-2 bg-bg-card border border-border rounded-xl text-text-primary text-sm focus:outline-none focus:border-accent transition-colors"
              >
                <option value="">Adicionar à lista</option>
                <option value="WATCHING">Assistindo</option>
                <option value="COMPLETED">Concluído</option>
                <option value="PLAN_TO_WATCH">Planejo Assistir</option>
                <option value="DROPPED">Dropado</option>
                {listStatus && <option value="REMOVE">Remover da lista</option>}
              </select>
            </div>

            {/* Rating */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Sua Nota {userScore > 0 && `— ${userScore}/10`}
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRating(star)}
                    disabled={ratingLoading}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                      star <= userScore
                        ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30'
                        : 'bg-bg-card text-text-muted border border-border hover:border-yellow-400/30 hover:text-yellow-400'
                    }`}
                  >
                    {star}
                  </button>
                ))}
                {avgScore && (
                  <span className="ml-4 text-text-muted text-sm flex items-center">
                    Média: <span className="text-yellow-400 font-bold ml-1">{avgScore.toFixed(1)}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Synopsys */}
            {synopsis && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-text-primary mb-2">Sinopse</h3>
                <p className="text-text-secondary leading-relaxed">{synopsis}</p>
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8 p-4 bg-bg-card rounded-xl">
              {studios && studios.length > 0 && (
                <div>
                  <p className="text-text-muted text-xs uppercase tracking-wider">Estúdio</p>
                  <p className="text-text-primary text-sm font-medium">{studios.map((s) => s.name).join(', ')}</p>
                </div>
              )}
              {source && (
                <div>
                  <p className="text-text-muted text-xs uppercase tracking-wider">Origem</p>
                  <p className="text-text-primary text-sm font-medium">{source}</p>
                </div>
              )}
              {animeStatus && (
                <div>
                  <p className="text-text-muted text-xs uppercase tracking-wider">Status</p>
                  <p className="text-text-primary text-sm font-medium">{animeStatus}</p>
                </div>
              )}
              {url && (
                <div>
                  <p className="text-text-muted text-xs uppercase tracking-wider">Links</p>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="text-accent-light hover:text-accent text-sm font-medium transition-colors">
                    MyAnimeList ↗
                  </a>
                </div>
              )}
            </div>

            {/* Comments Section */}
            <div className="mt-10">
              <h3 className="text-xl font-bold text-text-primary mb-6">Comentários</h3>

              {isAuthenticated ? (
                <form onSubmit={handleAddComment} className="mb-8">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="O que você achou deste anime?"
                    rows={3}
                    className="w-full px-4 py-3 bg-bg-card border border-border rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors resize-none"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      type="submit"
                      disabled={!newComment.trim()}
                      className="px-5 py-2 bg-accent hover:bg-accent-dark text-white text-sm font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Comentar
                    </button>
                  </div>
                </form>
              ) : (
                <p className="text-text-muted mb-8 text-sm">
                  <button onClick={() => navigate('/login')} className="text-accent-light hover:text-accent transition-colors font-medium">
                    Faça login
                  </button>{' '}
                  para deixar um comentário.
                </p>
              )}

              {comments.length === 0 ? (
                <p className="text-text-muted text-center py-8">Nenhum comentário ainda. Seja o primeiro!</p>
              ) : (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="bg-bg-card rounded-xl p-4 border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent-light text-sm font-bold">
                            {comment.user?.name?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                          <span className="text-text-primary text-sm font-medium">{comment.user?.name || 'Usuário'}</span>
                        </div>
                        <span className="text-text-muted text-xs">
                          {new Date(comment.createdAt).toLocaleDateString('pt-BR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>

                      {editingComment === comment.id ? (
                        <div className="mt-2">
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-accent transition-colors resize-none"
                          />
                          <div className="flex justify-end gap-2 mt-2">
                            <button
                              onClick={() => { setEditingComment(null); setEditContent('') }}
                              className="px-3 py-1 text-sm text-text-muted hover:text-text-primary transition-colors"
                            >
                              Cancelar
                            </button>
                            <button
                              onClick={() => handleUpdateComment(comment.id)}
                              className="px-3 py-1 text-sm bg-accent hover:bg-accent-dark text-white rounded-lg transition-colors"
                            >
                              Salvar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-text-secondary text-sm leading-relaxed mt-1">{comment.content}</p>
                      )}

                      {comment.user?.id === user?.id && editingComment !== comment.id && (
                        <div className="flex gap-3 mt-3">
                          <button
                            onClick={() => { setEditingComment(comment.id); setEditContent(comment.content) }}
                            className="text-xs text-text-muted hover:text-accent-light transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-xs text-text-muted hover:text-error transition-colors"
                          >
                            Excluir
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
