import api from './api'

export const animeService = {
  // ── Catalog ──
  getSeasonNow() {
    return api.get('/animes/season')
  },

  getTopAnime() {
    return api.get('/animes/top')
  },

  searchAnime(params) {
    return api.get('/animes/search', { params })
  },

  getAnimeById(id) {
    return api.get(`/animes/${id}`)
  },

  // ── Ratings ──
  submitRating(animeId, score) {
    return api.post(`/animes/${animeId}/rating`, { score })
  },

  getRating(animeId) {
    return api.get(`/animes/${animeId}/rating`)
  },

  // ── Favorites ──
  toggleFavorite(animeId) {
    return api.post(`/animes/${animeId}/favorite`)
  },

  getFavorites() {
    return api.get('/user/favorites')
  },

  // ── Comments ──
  getComments(animeId) {
    return api.get(`/animes/${animeId}/comments`)
  },

  createComment(animeId, content) {
    return api.post(`/animes/${animeId}/comments`, { content })
  },

  updateComment(commentId, content) {
    return api.put(`/comments/${commentId}`, { content })
  },

  deleteComment(commentId) {
    return api.delete(`/comments/${commentId}`)
  },

  // ── My List ──
  updateListStatus(animeId, status) {
    return api.post('/user/list', { animeId, status })
  },

  getUserList(status) {
    const params = status ? { status } : {}
    return api.get('/user/list', { params })
  },

  removeFromList(animeId) {
    return api.delete(`/user/list/${animeId}`)
  },
}
