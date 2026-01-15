"use client";

import { Card, CardContent, CardFooter, Button, Badge } from "@/components/atoms";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";

interface ServiceCardProps {
  name: string;
  description?: string;
  price: number;
  durationMin: number;
  imageUrl?: string;
  category: string;
  isAuthenticated: boolean;
  onBook?: () => void;
}

export function ServiceCard({
  name,
  description,
  price,
  durationMin,
  imageUrl,
  category,
  isAuthenticated,
  onBook,
}: ServiceCardProps) {
  return (
    <Card hover className="flex flex-col h-full overflow-hidden p-0">
      <div className="relative aspect-[4/3] bg-gray-100">
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
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
      </div>

      <CardContent className="flex-1 p-4">
        <h3 className="font-display text-lg font-semibold text-gray-900 line-clamp-2">
          {name}
        </h3>
        {description && (
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">{description}</p>
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
      </CardContent>

      <CardFooter className="flex items-center justify-between p-4 pt-0 mt-auto border-0">
        {isAuthenticated ? (
          <span className="font-display text-xl font-bold text-primary-600">
            {formatPrice(price)}
          </span>
        ) : (
          <span className="text-sm text-gray-500 italic">Accedi per i prezzi</span>
        )}

        {isAuthenticated && onBook && (
          <Button size="sm" onClick={onBook}>
            Prenota
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

