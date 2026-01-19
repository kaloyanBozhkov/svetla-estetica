import { db } from "@/lib/db";
import { ProductsTable } from "./ProductsTable";
import { Button } from "@/components/atoms";
import Link from "next/link";
import { type product_category } from "@prisma/client";
import { Pagination } from "@/components/atoms/Pagination";
import { PRODUCT_CATEGORY_LABELS } from "@/lib/constants";

const ITEMS_PER_PAGE = 30;

const categoryLabels = PRODUCT_CATEGORY_LABELS as Record<product_category, string>;

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const { page: pageParam, q: searchQuery } = await searchParams;
  const page = parseInt(pageParam || "1");
  const skip = (page - 1) * ITEMS_PER_PAGE;

  const whereClause = searchQuery
    ? {
        OR: [
          { name: { contains: searchQuery, mode: "insensitive" as const } },
          { brand: { name: { contains: searchQuery, mode: "insensitive" as const } } },
        ],
      }
    : {};

  const [products, totalCount] = await Promise.all([
    db.product.findMany({
      where: whereClause,
      orderBy: [{ priority: "desc" }, { name: "asc" }],
      include: { brand: true },
      skip,
      take: ITEMS_PER_PAGE,
    }),
    db.product.count({ where: whereClause }),
  ]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const productsWithLabels = products.map((p) => ({
    id: p.id,
    uuid: p.uuid,
    name: p.name,
    price: p.price,
    stock: p.stock,
    category: p.category,
    categoryLabel: categoryLabels[p.category],
    brandName: p.brand.name,
    active: p.active,
  }));

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900">
            Gestione Prodotti
          </h1>
          <p className="mt-1 text-gray-500">
            {searchQuery ? `${totalCount} risultati per "${searchQuery}"` : `${totalCount} prodotti totali`}
          </p>
        </div>
        <Link href="/admin/prodotti/nuovo" className="shrink-0">
          <Button className="w-full sm:w-auto">Aggiungi Prodotto</Button>
        </Link>
      </div>

      <ProductsTable products={productsWithLabels} initialSearch={searchQuery || ""} />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        baseUrl="/admin/prodotti"
        preserveParams={{ q: searchQuery }}
      />
    </div>
  );
}
