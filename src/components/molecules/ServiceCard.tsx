'use client';

import Link from 'next/link';
import { Card, CardFooter, Button, Badge } from '@/components/atoms';
import { formatPrice, stripHtml } from '@/lib/utils';
import Image from 'next/image';
import type { MouseEvent } from 'react';

interface ServiceCardProps {
  uuid: string;
  name: string;
  description?: string;
  price: number;
  durationMin: number;
  imageUrl?: string;
  category: string;
  isAuthenticated?: boolean;
  onBook?: () => void;
}

export function ServiceCard({
  uuid,
  name,
  description,
  price,
  durationMin,
  imageUrl,
  category,
  isAuthenticated = false,
  onBook,
}: ServiceCardProps) {
  const handleBook = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onBook) {
      onBook();
    }
  };

  return (
    <Card hover className="group relative flex flex-col h-full overflow-hidden p-0">
      {/* Invisible link covering entire card */}
      <Link
        href={`/trattamenti/${uuid}`}
        className="absolute inset-0 z-0"
        aria-label={`Vai a ${name}`}
      />

      <div className="relative z-0 aspect-[4/3] bg-gradient-to-br from-primary-50 to-gray-50 overflow-hidden pointer-events-none">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            unoptimized
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="h-16 w-16 rounded-full bg-primary-200 flex items-center justify-center">
              <svg
                className="h-8 w-8 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6z"
                />
              </svg>
            </div>
          </div>
        )}
        <Badge variant="default" className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm">
          {category}
        </Badge>
      </div>

      <div className="flex-1 p-4">
        <h3 className="font-display text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {name}
        </h3>
        {description && (
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">{stripHtml(description)}</p>
        )}
        <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{durationMin} min</span>
        </div>
      </div>

      <CardFooter className="relative z-10 flex items-center justify-between p-4 pt-0 mt-auto border-0">
        <span className="font-display text-xl font-bold text-primary-600">
          {formatPrice(price)}
        </span>

        {isAuthenticated && onBook ? (
          <Button size="sm" onClick={handleBook}>
            Prenota
          </Button>
        ) : !isAuthenticated ? (
          <Link
            href="/accedi"
            className="text-sm text-primary-600 hover:text-primary-700 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            Accedi per prenotare
          </Link>
        ) : null}
      </CardFooter>
    </Card>
  );
}
