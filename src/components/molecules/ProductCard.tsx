'use client';

import { useState, type MouseEvent } from 'react';
import Link from 'next/link';
import { Card, CardFooter, Button, Badge } from '@/components/atoms';
import { formatPrice, cn, stripHtml, calculateDiscountedPrice } from '@/lib/utils';
import Image from 'next/image';
import { CheckIcon } from '@/components/atoms/icons';

interface ProductCardProps {
  uuid: string;
  name: string;
  description?: string;
  price: number;
  discountPercent?: number;
  imageUrl?: string;
  stock: number;
  category: string;
  onAddToCart?: () => void;
}

export function ProductCard({
  uuid,
  name,
  description,
  price,
  discountPercent = 0,
  imageUrl,
  stock,
  category,
  onAddToCart,
}: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false);
  const isOutOfStock = stock <= 0;
  const hasDiscount = discountPercent > 0;
  const finalPrice = hasDiscount ? calculateDiscountedPrice(price, discountPercent) : price;

  const handleAddToCart = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart();
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1500);
    }
  };

  return (
    <Card hover className="group relative flex flex-col h-full overflow-hidden p-0">
      {/* Invisible link covering entire card */}
      <Link
        href={`/prodotti/${uuid}`}
        className="absolute inset-0 z-0"
        aria-label={`Vai a ${name}`}
      />

      <div className="relative z-0 aspect-square bg-gray-50 overflow-hidden pointer-events-none">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            unoptimized
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
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
        <Badge variant="default" className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm">
          {category}
        </Badge>
        {hasDiscount && (
          <Badge
            variant="danger"
            className="absolute top-3 right-3 bg-red-500 text-white font-bold"
          >
            -{discountPercent}%
          </Badge>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <Badge variant="danger" className="text-sm">
              Esaurito
            </Badge>
          </div>
        )}
      </div>

      <div className="flex-1 p-4">
        <h3 className="font-display text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {name}
        </h3>
        {description && (
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">{stripHtml(description)}</p>
        )}
      </div>

      <CardFooter className="relative z-10 flex items-center justify-between p-4 pt-0 mt-auto border-0">
        <div className="flex flex-col">
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">{formatPrice(price)}</span>
          )}
          <span
            className={cn(
              'font-display text-xl font-bold',
              hasDiscount ? 'text-red-600' : 'text-primary-600'
            )}
          >
            {formatPrice(finalPrice)}
          </span>
        </div>

        {!isOutOfStock && onAddToCart && (
          <Button
            size="sm"
            onClick={handleAddToCart}
            className={cn(
              'min-w-[100px] transition-all duration-300',
              isAdded && '!bg-green-600 hover:!bg-green-700'
            )}
          >
            {isAdded ? (
              <span className="flex items-center gap-1">
                <CheckIcon className="w-4 h-4" />
                Aggiunto
              </span>
            ) : (
              'Aggiungi'
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
