import { db } from "@/lib/db";
import { ProductsTable } from "./ProductsTable";
import { Button } from "@/components/atoms";
import Link from "next/link";
import { type product_category } from "@prisma/client";

const categoryLabels: Record<product_category, string> = {
  viso: "Viso",
  corpo: "Corpo",
  solari: "Solari",
  tisane: "Tisane",
  make_up: "Make Up",
  profumi: "Profumi",
  mani_e_piedi: "Mani e Piedi",
};

export default async function AdminProductsPage() {
  const products = await db.product.findMany({
    orderBy: [{ priority: "desc" }, { name: "asc" }],
    include: { brand: true },
  });

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
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900">
          Gestione Prodotti
        </h1>
        <Link href="/admin/prodotti/nuovo" className="shrink-0">
          <Button className="w-full sm:w-auto">Aggiungi Prodotto</Button>
        </Link>
      </div>

      <ProductsTable products={productsWithLabels} />
    </div>
  );
}

