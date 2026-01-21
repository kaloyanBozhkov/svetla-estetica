import { ServiceDetailSkeleton } from '@/components/atoms';

export default function Loading() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb skeleton */}
        <nav className="mb-8">
          <div className="flex items-center gap-2">
            <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
            <span className="text-gray-300">/</span>
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
            <span className="text-gray-300">/</span>
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
        </nav>

        <ServiceDetailSkeleton />
      </div>
    </div>
  );
}
