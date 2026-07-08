import { Link } from 'react-router-dom'

export default function AnimeCard({ anime }) {
  const { mal_id, images, title, score, genres, synopsis } = anime

  return (
    <Link
      to={`/anime/${mal_id}`}
      className="group bg-bg-card rounded-xl overflow-hidden border border-transparent hover:border-accent/30 transition-all duration-300 hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-1"
    >
      {/* Poster */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={images?.jpg?.large_image_url || images?.jpg?.image_url}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Score badge */}
        {score && (
          <div className="absolute top-2 right-2 bg-bg-primary/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-yellow-400 flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {score}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 space-y-1.5">
        <h3 className="text-sm font-semibold text-text-primary line-clamp-2 group-hover:text-accent-light transition-colors">
          {title}
        </h3>
        {genres && genres.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {genres.slice(0, 2).map((genre) => (
              <span
                key={genre.mal_id}
                className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent/10 text-accent-light"
              >
                {genre.name}
              </span>
            ))}
          </div>
        )}
        {synopsis && (
          <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
            {synopsis}
          </p>
        )}
      </div>
    </Link>
  )
}
