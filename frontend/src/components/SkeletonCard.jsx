export default function SkeletonCard() {
  return (
    <div className="bg-bg-card rounded-xl overflow-hidden">
      {/* Poster skeleton */}
      <div className="aspect-[3/4] skeleton" />
      {/* Info skeleton */}
      <div className="p-3 space-y-2">
        <div className="h-4 skeleton w-3/4" />
        <div className="h-3 skeleton w-1/2" />
        <div className="h-3 skeleton w-full" />
        <div className="h-3 skeleton w-2/3" />
      </div>
    </div>
  )
}
