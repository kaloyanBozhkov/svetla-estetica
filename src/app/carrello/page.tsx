import { Suspense } from "react";
import { CartContent } from "./CartContent";
import { Card } from "@/components/atoms";

function CartSkeleton() {
  return (
    <div className="py-12 overflow-x-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Title skeleton */}
        <div className="h-9 w-32 bg-gray-200 rounded-lg animate-pulse mb-6 sm:mb-8" />

        <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
          {/* Cart items skeleton */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden divide-y divide-gray-100">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 flex gap-4">
                  {/* Image */}
                  <div className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse flex-shrink-0" />
                  {/* Content */}
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
                    <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
                  </div>
                  {/* Price */}
                  <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </Card>
          </div>

          {/* Summary skeleton */}
          <div>
            <Card className="sticky top-24">
              <div className="h-7 w-28 bg-gray-200 rounded animate-pulse mb-4" />
              
              <div className="space-y-3 border-b border-gray-100 pb-4">
                <div className="flex justify-between">
                  <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
                  <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="flex justify-between">
                  <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
                  <div className="h-5 w-14 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>

              <div className="flex justify-between py-4">
                <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
                <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
              </div>

              <div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse" />
              
              <div className="h-4 w-40 bg-gray-200 rounded animate-pulse mx-auto mt-4" />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={<CartSkeleton />}>
      <CartContent />
    </Suspense>
  );
}
