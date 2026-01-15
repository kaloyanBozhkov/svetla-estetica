"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter, Button, Badge } from "@/components/atoms";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";

interface ProductCardProps {
  uuid: string;
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
  uuid,
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
    <Card hover className="group flex flex-col h-full overflow-hidden p-0">
      <Link href={`/prodotti/${uuid}`} className="relative aspect-square bg-gray-50 block overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-3xl font-display font-bold text-gray-400">
                {name.charAt(0)}
              </span>
            </div>
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
      </Link>

      <CardContent className="flex-1 p-4">
        <Link href={`/prodotti/${uuid}`}>
          <h3 className="font-display text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {name}
          </h3>
        </Link>
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
