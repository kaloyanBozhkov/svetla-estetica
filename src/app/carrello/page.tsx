"use client";

import Link from "next/link";
import { useCartStore, useAuthStore } from "@/stores";
import { CartItem } from "@/components/molecules";
import { ActionButton, Button, Card } from "@/components/atoms";
import { formatPrice } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, getTotal, clearCart } = useCartStore();
  const { isAuthenticated, isLoading } = useAuthStore();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckout = async () => {
    setError("");
    setCheckoutLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Errore checkout");
      }

      clearCart();
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore checkout");
      setCheckoutLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated()) {
      router.push("/accedi");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-12">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <div className="text-6xl mb-6">🛒</div>
          <h1 className="font-display text-3xl font-bold text-gray-900">
            Il tuo carrello è vuoto
          </h1>
          <p className="mt-4 text-gray-600">
            Aggiungi qualche prodotto per iniziare!
          </p>
          <Link href="/prodotti" className="mt-8 inline-block">
            <Button>Vai ai Prodotti</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-8">
          Carrello
        </h1>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              {items.map((item) => (
                <CartItem
                  key={item.productId}
                  name={item.name}
                  price={item.price}
                  quantity={item.quantity}
                  imageUrl={item.imageUrl}
                  productUuid={item.productUuid}
                  onIncrease={() => updateQuantity(item.productId, item.quantity + 1)}
                  onDecrease={() => updateQuantity(item.productId, item.quantity - 1)}
                  onRemove={() => removeItem(item.productId)}
                />
              ))}
            </Card>

            <button
              onClick={clearCart}
              className="mt-4 text-sm text-gray-500 hover:text-red-500 transition-colors"
            >
              Svuota carrello
            </button>
          </div>

          <div>
            <Card className="sticky top-24">
              <h2 className="font-display text-xl font-bold text-gray-900 mb-4">
                Riepilogo
              </h2>

              <div className="space-y-3 border-b border-gray-100 pb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotale</span>
                  <span>{formatPrice(getTotal())}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Spedizione</span>
                  <span>Da calcolare</span>
                </div>
              </div>

              <div className="flex justify-between py-4 text-lg font-bold text-gray-900">
                <span>Totale</span>
                <span>{formatPrice(getTotal())}</span>
              </div>

              {error && (
                <p className="mb-3 text-sm text-red-600 text-center">{error}</p>
              )}

              <ActionButton
                className="w-full whitespace-nowrap"
                size="lg"
                onClick={handleCheckout}
                isLoading={checkoutLoading}
              >
                Procedi al Checkout
              </ActionButton>

              <p className="mt-4 text-xs text-center text-gray-500">
                Pagamento sicuro con Stripe
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

