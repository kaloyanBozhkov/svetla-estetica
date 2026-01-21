'use client';

import { Button } from '@/components/atoms';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

interface CartItemProps {
  name: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  quantity: number;
  stock: number;
  imageUrl?: string;
  productUuid: string;
  outOfStock?: boolean;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

export function CartItem({
  name,
  price,
  originalPrice,
  discountPercent,
  quantity,
  stock,
  imageUrl,
  productUuid,
  outOfStock,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemProps) {
  const isAtMax = stock > 0 && quantity >= stock;
  const isOutOfStock = outOfStock || stock <= 0;
  const hasDiscount = Boolean(discountPercent && discountPercent > 0 && originalPrice);

  return (
    <div
      className={`py-4 border-b border-gray-100 last:border-0 ${isOutOfStock ? 'bg-red-50' : ''}`}
    >
      <div className="flex gap-3 sm:gap-4">
        <Link
          href={`/prodotti/${productUuid}`}
          className="relative h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 rounded-lg bg-gray-100 overflow-hidden hover:opacity-80 transition-opacity"
        >
          {imageUrl ? (
            <Image src={imageUrl} alt={name} fill unoptimized className="object-contain p-1" />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">
              <svg
                className="h-6 w-6 sm:h-8 sm:w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </Link>

        <div className="flex-1 min-w-0">
          <Link
            href={`/prodotti/${productUuid}`}
            className="font-medium text-gray-900 text-sm sm:text-base line-clamp-2 hover:text-primary-600 transition-colors"
          >
            {name}
          </Link>
          <div className="mt-1 flex items-center gap-2">
            {hasDiscount && (
              <>
                <span className="text-xs text-gray-400 line-through">
                  {formatPrice(originalPrice ?? price)}
                </span>
                <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-medium">
                  -{discountPercent}%
                </span>
              </>
            )}
            <span
              className={`text-sm font-semibold ${hasDiscount ? 'text-red-600' : 'text-primary-600'}`}
            >
              {formatPrice(price)}
            </span>
          </div>
          {isOutOfStock && (
            <p className="mt-1 text-xs text-red-600 font-medium">
              ⚠ Esaurito - Rimuovi per procedere
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pl-[76px] sm:pl-[96px]">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onDecrease} className="h-8 w-8 p-0">
            −
          </Button>
          <span className="w-6 sm:w-8 text-center font-medium text-sm">{quantity}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={onIncrease}
            className="h-8 w-8 p-0"
            disabled={isAtMax}
          >
            +
          </Button>
          {isAtMax && <span className="text-xs text-amber-600 ml-1">Max</span>}
        </div>
        <button
          onClick={onRemove}
          className="text-sm text-gray-400 hover:text-red-500 transition-colors"
        >
          Rimuovi
        </button>
      </div>
    </div>
  );
}
