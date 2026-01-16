"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ServiceCard } from "@/components/molecules";
import { Button, Badge, Card } from "@/components/atoms";
import { formatPrice } from "@/lib/utils";
import { type service_category } from "@prisma/client";

const ITEMS_PER_PAGE = 30;

interface Service {
  id: number;
  uuid: string;
  name: string;
  description: string | null;
  price: number;
  durationMin: number;
  imageUrl: string | null;
  category: service_category;
  categoryLabel: string;
}

interface ServicesGridProps {
  services: Service[];
  isAuthenticated: boolean;
  categories: { value: service_category; label: string }[];
}

type SortOption = "default" | "price-asc" | "price-desc";
type ViewMode = "grid" | "list";

export function ServicesGrid({
  services,
  isAuthenticated,
  categories,
}: ServicesGridProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] =
    useState<service_category | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredAndSortedServices = useMemo(() => {
    const result = selectedCategory
      ? services.filter((s) => s.category === selectedCategory)
      : [...services];

    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [services, selectedCategory, sortBy]);

  const totalPages = Math.ceil(
    filteredAndSortedServices.length / ITEMS_PER_PAGE
  );
  const paginatedServices = filteredAndSortedServices.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleCategoryChange = (cat: service_category | null) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleBook = (service: Service) => {
    router.push(`/prenota/${service.uuid}`);
  };

  return (
    <>
      {/* Category filters */}
      <div className="mb-6 flex flex-wrap gap-2 justify-center">
        <Button
          variant={selectedCategory === null ? "primary" : "ghost"}
          size="sm"
          onClick={() => handleCategoryChange(null)}
        >
          Tutti
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat.value}
            variant={selectedCategory === cat.value ? "primary" : "ghost"}
            size="sm"
            onClick={() => handleCategoryChange(cat.value)}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Controls bar */}
      <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          {filteredAndSortedServices.length} trattamenti
        </p>

        <div className="flex items-center gap-4">
          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value as SortOption);
              setCurrentPage(1);
            }}
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="default">Ordina per</option>
            <option value="price-asc">Prezzo: basso → alto</option>
            <option value="price-desc">Prezzo: alto → basso</option>
          </select>

          {/* View toggle */}
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 ${
                viewMode === "grid"
                  ? "bg-primary-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
              aria-label="Grid view"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 ${
                viewMode === "list"
                  ? "bg-primary-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
              aria-label="List view"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Services */}
      {paginatedServices.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Nessun trattamento trovato</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {paginatedServices.map((service) => (
            <ServiceCard
              key={service.id}
              uuid={service.uuid}
              name={service.name}
              description={service.description ?? undefined}
              price={service.price}
              durationMin={service.durationMin}
              imageUrl={service.imageUrl ?? undefined}
              category={service.categoryLabel}
              isAuthenticated={isAuthenticated}
              onBook={() => handleBook(service)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {paginatedServices.map((service) => (
            <ServiceListItem
              key={service.id}
              service={service}
              isAuthenticated={isAuthenticated}
              onBook={() => handleBook(service)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            ← Prec
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === page
                        ? "bg-primary-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                );
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return (
                  <span key={page} className="px-2 text-gray-400">
                    ...
                  </span>
                );
              }
              return null;
            })}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Succ →
          </Button>
        </div>
      )}
    </>
  );
}

function ServiceListItem({
  service,
  isAuthenticated,
  onBook,
}: {
  service: Service;
  isAuthenticated: boolean;
  onBook: () => void;
}) {
  return (
    <Card className="flex flex-col sm:flex-row overflow-hidden p-0">
      <Link
        href={`/trattamenti/${service.uuid}`}
        className="relative w-full sm:w-48 h-48 sm:h-auto bg-gradient-to-br from-primary-100 to-primary-50 flex-shrink-0"
      >
        {service.imageUrl ? (
          <Image
            src={service.imageUrl}
            alt={service.name}
            fill
            className="object-contain p-4"
            sizes="200px"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-primary-300">
            <svg
              className="w-16 h-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
          </div>
        )}
      </Link>

      <div className="flex flex-col flex-1 p-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="default">{service.categoryLabel}</Badge>
            <span className="text-sm text-gray-500">
              {service.durationMin} min
            </span>
          </div>
          <Link href={`/trattamenti/${service.uuid}`}>
            <h3 className="font-display text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors">
              {service.name}
            </h3>
          </Link>
          {service.description && (
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
              {service.description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          {isAuthenticated ? (
            <span className="font-display text-xl font-bold text-primary-600">
              {formatPrice(service.price)}
            </span>
          ) : (
            <span className="text-sm text-gray-500 italic">
              Accedi per i prezzi
            </span>
          )}

          {isAuthenticated && (
            <Button size="sm" onClick={onBook}>
              Prenota
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
