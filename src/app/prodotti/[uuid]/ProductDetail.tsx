"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Badge, HtmlContent } from "@/components/atoms";
import { useCartStore } from "@/stores";
import { formatPrice } from "@/lib/utils";
import { PRODUCT_CATEGORY_LABELS } from "@/lib/constants";
import type { product } from "@prisma/client";

interface Props {
  product: product;
}

export function ProductDetail({ product }: Props) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();

  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        productId: product.id,
        productUuid: product.uuid,
        name: product.name,
        price: product.price,
        stock: product.stock,
        imageUrl: product.image_url || undefined,
      });
    }

    router.push("/carrello");
  };

  return (
    <>
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center gap-2 text-sm text-gray-500">
          <li>
            <Link href="/" className="hover:text-primary-600">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/prodotti" className="hover:text-primary-600">
              Prodotti
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-900 font-medium truncate">{product.name}</li>
        </ol>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Image */}
        <div className="group relative aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-gray-100 to-gray-50 shadow-xl ring-1 ring-gray-200">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-contain p-6 transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-6xl font-display font-bold text-gray-400">
                  {product.name.charAt(0)}
                </span>
              </div>
            </div>
          )}
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Badge variant="danger" className="text-lg px-6 py-2">
                Esaurito
              </Badge>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <Badge variant="default" className="self-start mb-4">
            {PRODUCT_CATEGORY_LABELS[product.category] || product.category}
          </Badge>

          <h1 className="font-display text-3xl font-bold text-gray-900 sm:text-4xl">
            {product.name}
          </h1>

          {product.description && (
            <HtmlContent
              html={product.description}
              className="mt-4 text-lg text-gray-600 leading-relaxed [&>br]:block"
            />
          )}

          {/* Price */}
          <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-primary-50 to-white ring-1 ring-primary-100">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-4xl font-bold text-primary-600">
                {formatPrice(product.price)}
              </span>
              {product.stock > 0 && product.stock <= 5 && (
                <span className="text-sm text-amber-600">
                  Solo {product.stock} disponibili
                </span>
              )}
            </div>
          </div>

          {/* Quantity & Add to Cart */}
          {!isOutOfStock && (
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium text-gray-700">Quantità:</span>
                <div className="flex items-center rounded-xl bg-gray-100 p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 hover:bg-white hover:shadow transition-all"
                  >
                    −
                  </button>
                  <span className="w-12 text-center font-semibold text-lg">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 hover:bg-white hover:shadow transition-all"
                  >
                    +
                  </button>
                </div>
              </div>

              <Button size="lg" className="w-full" onClick={handleAddToCart}>
                <svg
                  className="mr-2 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Aggiungi al Carrello
              </Button>
            </div>
          )}

          {/* Info */}
          <div className="mt-8 pt-8 border-t border-gray-200 space-y-4">
            <div className="flex items-center gap-3 text-gray-600">
              <svg
                className="h-5 w-5 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Prodotto originale garantito</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <svg
                className="h-5 w-5 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Pagamento sicuro con Stripe</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <svg
                className="h-5 w-5 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Ritiro in negozio disponibile</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
