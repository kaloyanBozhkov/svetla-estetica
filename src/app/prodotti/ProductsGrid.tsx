"use client";

import { useState } from "react";
import { ProductCard } from "@/components/molecules";
import { Button } from "@/components/atoms";
import { useCartStore } from "@/stores";
import { type product_category } from "@prisma/client";

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

export function ProductsGrid({
  products,
  isAuthenticated,
  categories,
}: ProductsGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<product_category | null>(
    null
  );
  const addItem = useCartStore((s) => s.addItem);

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

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
      <div className="mb-8 flex flex-wrap gap-2 justify-center">
        <Button
          variant={selectedCategory === null ? "primary" : "ghost"}
          size="sm"
          onClick={() => setSelectedCategory(null)}
        >
          Tutti
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat.value}
            variant={selectedCategory === cat.value ? "primary" : "ghost"}
            size="sm"
            onClick={() => setSelectedCategory(cat.value)}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Nessun prodotto trovato</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
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
      )}
    </>
  );
}
