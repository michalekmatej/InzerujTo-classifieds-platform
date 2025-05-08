export default function SearchSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-48 animate-pulse rounded-md bg-muted"></div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-[300px] rounded-lg bg-muted animate-pulse"></div>
        ))}
      </div>
    </div>
  )
}
