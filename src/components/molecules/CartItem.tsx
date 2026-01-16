"use client";

import { Button } from "@/components/atoms";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface CartItemProps {
  name: string;
  price: number;
  quantity: number;
  stock: number;
  imageUrl?: string;
  productUuid: string;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

export function CartItem({
  name,
  price,
  quantity,
  stock,
  imageUrl,
  productUuid,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemProps) {
  const isAtMax = stock > 0 && quantity >= stock;
  return (
    <div className="flex gap-4 py-4 border-b border-gray-100 last:border-0">
      <Link
        href={`/prodotti/${productUuid}`}
        className="relative h-20 w-20 flex-shrink-0 rounded-lg bg-gray-100 overflow-hidden hover:opacity-80 transition-opacity"
      >
        {imageUrl ? (
          <Image src={imageUrl} alt={name} fill className="object-contain p-1" />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <h4 className="font-medium text-gray-900 truncate">{name}</h4>
        <p className="mt-1 text-sm text-primary-600 font-semibold">
          {formatPrice(price)}
        </p>
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onDecrease}
            className="h-8 w-8 p-0"
          >
            −
          </Button>
          <span className="w-8 text-center font-medium">{quantity}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={onIncrease}
            className="h-8 w-8 p-0"
            disabled={isAtMax}
          >
            +
          </Button>
        </div>
        {isAtMax && (
          <span className="text-xs text-amber-600">Max disponibile</span>
        )}
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

