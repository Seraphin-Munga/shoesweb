export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-white animate-pulse">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-4">
        <div className="flex items-center gap-2">
          <div className="h-3 w-10 bg-zinc-100 rounded-full" />
          <div className="h-3 w-2 bg-zinc-100 rounded-full" />
          <div className="h-3 w-20 bg-zinc-100 rounded-full" />
          <div className="h-3 w-2 bg-zinc-100 rounded-full" />
          <div className="h-3 w-28 bg-zinc-100 rounded-full" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-16">

          {/* Left – image skeleton */}
          <div className="space-y-4">
            <div className="rounded-3xl bg-zinc-100" style={{ minHeight: 420 }} />
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-2xl h-16 bg-zinc-100" />
              ))}
            </div>
          </div>

          {/* Right – info skeleton */}
          <div className="flex flex-col gap-4 pt-2">
            <div className="h-3 w-20 bg-zinc-100 rounded-full" />
            <div className="h-10 w-3/4 bg-zinc-100 rounded-xl" />
            <div className="h-4 w-40 bg-zinc-100 rounded-full" />
            <div className="h-8 w-32 bg-zinc-100 rounded-xl mt-2" />

            {/* Color */}
            <div className="mt-4 space-y-3">
              <div className="h-3 w-16 bg-zinc-100 rounded-full" />
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-zinc-100" />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="mt-2 space-y-3">
              <div className="h-3 w-20 bg-zinc-100 rounded-full" />
              <div className="grid grid-cols-6 gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-10 bg-zinc-100 rounded-xl" />
                ))}
              </div>
            </div>

            {/* Add to cart */}
            <div className="mt-4 h-14 bg-zinc-100 rounded-2xl" />
            <div className="h-12 bg-zinc-100 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
