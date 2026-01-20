"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, Badge, Button, Input } from "@/components/atoms";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { type product_category } from "@prisma/client";

interface Product {
  id: number;
  uuid: string;
  name: string;
  price: number;
  discountPercent: number;
  stock: number;
  category: product_category;
  categoryLabel: string;
  brandName: string;
  active: boolean;
}

interface ProductsTableProps {
  products: Product[];
  initialSearch?: string;
}

type SortKey = "name" | "brand" | "category" | "price" | "discount" | "stock" | "active";
type SortOrder = "asc" | "desc";

function SortIcon({ active, order }: { active: boolean; order: SortOrder }) {
  return (
    <span className={`block text-nowrap text-xs mt-0.5 ${active ? "text-primary-600" : "text-gray-400 opacity-0 group-hover:opacity-100"}`}>
      {active ? (order === "asc" ? "↑ cresc" : "↓ decresc") : "↕"}
    </span>
  );
}

export function ProductsTable({ products, initialSearch = "" }: ProductsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(initialSearch);
  const [sortBy, setSortBy] = useState<SortKey>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // Debounced search - update URL after typing stops
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== initialSearch) {
        const params = new URLSearchParams(searchParams.toString());
        if (search) {
          params.set("q", search);
          params.delete("page"); // Reset to page 1 on new search
        } else {
          params.delete("q");
        }
        router.push(`/admin/prodotti?${params.toString()}`);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [search, initialSearch, router, searchParams]);

  const handleSort = (key: SortKey) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  };

  const sorted = useMemo(() => {
    return [...products].sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "brand":
          comparison = a.brandName.localeCompare(b.brandName);
          break;
        case "category":
          comparison = a.categoryLabel.localeCompare(b.categoryLabel);
          break;
        case "price":
          comparison = a.price - b.price;
          break;
        case "discount":
          comparison = a.discountPercent - b.discountPercent;
          break;
        case "stock":
          comparison = a.stock - b.stock;
          break;
        case "active":
          comparison = (a.active ? 1 : 0) - (b.active ? 1 : 0);
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });
  }, [products, sortBy, sortOrder]);

  const thClass =
    "px-6 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors select-none group";

  return (
    <div className="space-y-4">
      <Input
        placeholder="Cerca prodotti..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      {sorted.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-gray-500">Nessun prodotto trovato</p>
        </Card>
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className={thClass} onClick={() => handleSort("name")}>
                    <span>Nome</span>
                    <SortIcon active={sortBy === "name"} order={sortOrder} />
                  </th>
                  <th className={thClass} onClick={() => handleSort("brand")}>
                    <span>Brand</span>
                    <SortIcon active={sortBy === "brand"} order={sortOrder} />
                  </th>
                  <th className={thClass} onClick={() => handleSort("category")}>
                    <span>Categoria</span>
                    <SortIcon active={sortBy === "category"} order={sortOrder} />
                  </th>
                  <th className={thClass} onClick={() => handleSort("price")}>
                    <span>Prezzo</span>
                    <SortIcon active={sortBy === "price"} order={sortOrder} />
                  </th>
                  <th className={thClass} onClick={() => handleSort("discount")}>
                    <span>Sconto</span>
                    <SortIcon active={sortBy === "discount"} order={sortOrder} />
                  </th>
                  <th className={thClass} onClick={() => handleSort("stock")}>
                    <span>Disponibile</span>
                    <SortIcon active={sortBy === "stock"} order={sortOrder} />
                  </th>
                  <th className={thClass} onClick={() => handleSort("active")}>
                    <span>Stato</span>
                    <SortIcon active={sortBy === "active"} order={sortOrder} />
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                    Azioni
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sorted.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {product.brandName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {product.categoryLabel}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {product.discountPercent > 0 ? (
                        <Badge variant="danger" className="bg-red-100 text-red-700">
                          -{product.discountPercent}%
                        </Badge>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={product.active ? "success" : "default"}>
                        {product.active ? "Attivo" : "Inattivo"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/prodotti/${product.uuid}`}>
                        <Button variant="ghost" size="sm">
                          Modifica
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
