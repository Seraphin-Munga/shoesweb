export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-white pt-20 animate-pulse">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Header skeleton */}
        <div className="mb-10 space-y-3">
          <div className="h-3 w-24 bg-zinc-100 rounded-full" />
          <div className="h-9 w-48 bg-zinc-100 rounded-xl" />
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white border border-zinc-100 rounded-2xl overflow-hidden">
              <div className="h-52 bg-zinc-100" />
              <div className="p-4 space-y-3">
                <div className="h-4 w-3/4 bg-zinc-100 rounded-full" />
                <div className="h-3 w-1/2 bg-zinc-100 rounded-full" />
                <div className="flex justify-between items-center pt-2">
                  <div className="h-5 w-24 bg-zinc-100 rounded-full" />
                  <div className="h-8 w-8 bg-zinc-100 rounded-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
