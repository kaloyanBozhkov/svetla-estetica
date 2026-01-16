import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-gray-200",
        className
      )}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col h-full overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
      <div className="relative aspect-square bg-gray-100">
        <Skeleton className="absolute inset-0 rounded-none" />
        <Skeleton className="absolute top-3 left-3 h-6 w-16" />
      </div>
      <div className="flex-1 p-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="flex items-center justify-between p-4 pt-0">
        <Skeleton className="h-7 w-20" />
        <Skeleton className="h-9 w-24 rounded-xl" />
      </div>
    </div>
  );
}

export function ServiceCardSkeleton() {
  return (
    <div className="flex flex-col h-full overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
      <div className="relative aspect-[4/3] bg-gray-100">
        <Skeleton className="absolute inset-0 rounded-none" />
        <Skeleton className="absolute top-3 left-3 h-6 w-16" />
      </div>
      <div className="flex-1 p-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
      <div className="flex items-center justify-between p-4 pt-0">
        <Skeleton className="h-7 w-20" />
        <Skeleton className="h-9 w-24 rounded-xl" />
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="grid gap-12 lg:grid-cols-2">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-gray-100">
        <Skeleton className="absolute inset-0 rounded-none" />
      </div>

      {/* Details */}
      <div className="flex flex-col">
        <Skeleton className="h-6 w-20 mb-4" />
        <Skeleton className="h-10 w-3/4 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3 mb-8" />

        <div className="p-6 rounded-2xl bg-gray-50">
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="mt-8 space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-12 w-32 rounded-xl" />
          </div>
          <Skeleton className="h-14 w-full rounded-xl" />
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 space-y-4">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-5 w-52" />
        </div>
      </div>
    </div>
  );
}

export function ServiceDetailSkeleton() {
  return (
    <div className="grid gap-12 lg:grid-cols-2">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-gray-100">
        <Skeleton className="absolute inset-0 rounded-none" />
      </div>

      {/* Details */}
      <div className="flex flex-col">
        <Skeleton className="h-6 w-20 mb-4" />
        <Skeleton className="h-10 w-3/4 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3 mb-8" />

        <div className="p-6 rounded-2xl bg-primary-600/10">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Skeleton className="h-4 w-16 mb-2 bg-primary-200" />
              <Skeleton className="h-8 w-24 bg-primary-200" />
            </div>
            <div>
              <Skeleton className="h-4 w-16 mb-2 bg-primary-200" />
              <Skeleton className="h-8 w-24 bg-primary-200" />
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Skeleton className="h-14 w-full rounded-xl" />
        </div>

        <div className="mt-8 p-6 rounded-2xl bg-gray-50">
          <Skeleton className="h-5 w-64 mb-3" />
          <Skeleton className="h-5 w-40" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ServiceGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ServiceCardSkeleton key={i} />
      ))}
    </div>
  );
}

