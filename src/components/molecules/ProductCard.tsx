"use client";

import { Card, CardContent, CardFooter, Button, Badge } from "@/components/atoms";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";

interface ProductCardProps {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  stock: number;
  category: string;
  isAuthenticated: boolean;
  onAddToCart?: () => void;
}

export function ProductCard({
  name,
  description,
  price,
  imageUrl,
  stock,
  category,
  isAuthenticated,
  onAddToCart,
}: ProductCardProps) {
  const isOutOfStock = stock <= 0;

  return (
    <Card hover className="flex flex-col h-full overflow-hidden p-0">
      <div className="relative aspect-square bg-gray-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            <svg
              className="h-16 w-16"
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
        <Badge
          variant="default"
          className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm"
        >
          {category}
        </Badge>
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <Badge variant="danger" className="text-sm">
              Esaurito
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="flex-1 p-4">
        <h3 className="font-display text-lg font-semibold text-gray-900 line-clamp-2">
          {name}
        </h3>
        {description && (
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">{description}</p>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between p-4 pt-0 mt-auto border-0">
        {isAuthenticated ? (
          <span className="font-display text-xl font-bold text-primary-600">
            {formatPrice(price)}
          </span>
        ) : (
          <span className="text-sm text-gray-500 italic">Accedi per i prezzi</span>
        )}

        {isAuthenticated && !isOutOfStock && onAddToCart && (
          <Button size="sm" onClick={onAddToCart}>
            Aggiungi
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

