import { ServiceGridSkeleton } from "@/components/atoms";

export default function Loading() {
  return (
    <div className="relative py-12 min-h-screen overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-0 left-[5%] w-80 h-80 bg-gradient-to-br from-violet-200 to-primary-200 rounded-full blur-3xl opacity-40 pointer-events-none" />
      <div className="absolute top-[40%] right-[-5%] w-72 h-72 bg-gradient-to-br from-pink-200 to-fuchsia-200 rounded-full blur-3xl opacity-30 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold text-gray-900">
            I Nostri Trattamenti
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Scopri i nostri trattamenti estetici professionali
          </p>
        </div>

        {/* Skeleton filters */}
        <div className="mb-6 flex flex-wrap gap-2 justify-center">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-9 w-20 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>

        {/* Skeleton controls */}
        <div className="mb-6 flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="flex items-center gap-4">
            <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-10 w-20 bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </div>

        <ServiceGridSkeleton count={12} />
      </div>
    </div>
  );
}

