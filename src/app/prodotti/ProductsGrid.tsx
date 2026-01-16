"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ProductCard } from "@/components/molecules";
import { Button, Badge, Card } from "@/components/atoms";
import { useCartStore } from "@/stores";
import { formatPrice } from "@/lib/utils";
import { type product_category } from "@prisma/client";

const ITEMS_PER_PAGE = 30;

interface Product {
  id: number;
  uuid: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  imageUrl: string | null;
  category: product_category;
  categoryLabel: string;
}

interface ProductsGridProps {
  products: Product[];
  isAuthenticated: boolean;
  categories: { value: product_category; label: string }[];
}

type SortOption = "default" | "price-asc" | "price-desc";
type ViewMode = "grid" | "list";

export function ProductsGrid({
  products,
  isAuthenticated,
  categories,
}: ProductsGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<product_category | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  const filteredAndSortedProducts = useMemo(() => {
    let result = selectedCategory
      ? products.filter((p) => p.category === selectedCategory)
      : [...products];

    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, selectedCategory, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleCategoryChange = (cat: product_category | null) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleAddToCart = (product: Product) => {
    addItem({
      productId: product.id,
      productUuid: product.uuid,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl ?? undefined,
    });
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
          {filteredAndSortedProducts.length} prodotti
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
              className={`p-2 ${viewMode === "grid" ? "bg-primary-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100"}`}
              aria-label="Grid view"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 ${viewMode === "list" ? "bg-primary-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100"}`}
              aria-label="List view"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Products */}
      {paginatedProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Nessun prodotto trovato</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {paginatedProducts.map((product) => (
            <ProductCard
              key={product.id}
              uuid={product.uuid}
              name={product.name}
              description={product.description ?? undefined}
              price={product.price}
              imageUrl={product.imageUrl ?? undefined}
              stock={product.stock}
              category={product.categoryLabel}
              isAuthenticated={isAuthenticated}
              onAddToCart={() => handleAddToCart(product)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {paginatedProducts.map((product) => (
            <ProductListItem
              key={product.id}
              product={product}
              isAuthenticated={isAuthenticated}
              onAddToCart={() => handleAddToCart(product)}
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

function ProductListItem({
  product,
  isAuthenticated,
  onAddToCart,
}: {
  product: Product;
  isAuthenticated: boolean;
  onAddToCart: () => void;
}) {
  const isOutOfStock = product.stock <= 0;

  return (
    <Card className="flex flex-col sm:flex-row overflow-hidden p-0">
      <Link
        href={`/prodotti/${product.uuid}`}
        className="relative w-full sm:w-48 h-48 sm:h-auto bg-gray-50 flex-shrink-0"
      >
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-contain p-4"
            sizes="200px"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-2xl font-display font-bold text-gray-400">
                {product.name.charAt(0)}
              </span>
            </div>
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <Badge variant="danger">Esaurito</Badge>
          </div>
        )}
      </Link>

      <div className="flex flex-col flex-1 p-4">
        <div className="flex-1">
          <Badge variant="default" className="mb-2">
            {product.categoryLabel}
          </Badge>
          <Link href={`/prodotti/${product.uuid}`}>
            <h3 className="font-display text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors">
              {product.name}
            </h3>
          </Link>
          {product.description && (
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
              {product.description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          {isAuthenticated ? (
            <span className="font-display text-xl font-bold text-primary-600">
              {formatPrice(product.price)}
            </span>
          ) : (
            <span className="text-sm text-gray-500 italic">Accedi per i prezzi</span>
          )}

          {isAuthenticated && !isOutOfStock && (
            <Button size="sm" onClick={onAddToCart}>
              Aggiungi
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
