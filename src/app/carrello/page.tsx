import { Suspense } from "react";
import { CartContent } from "./CartContent";

function CartLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full" />
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={<CartLoading />}>
      <CartContent />
    </Suspense>
  );
}
