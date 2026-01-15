import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { ProductsGrid } from "./ProductsGrid";
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

export default async function ProductsPage() {
  const user = await getSession();
  const products = await db.product.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  });

  const productsWithLabels = products.map((p) => ({
    id: p.id,
    uuid: p.uuid,
    name: p.name,
    description: p.description,
    price: p.price,
    stock: p.stock,
    imageUrl: p.image_url,
    category: p.category,
    categoryLabel: categoryLabels[p.category],
  }));

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold text-gray-900">
            I Nostri Prodotti
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Scopri la nostra selezione di prodotti per la cura della pelle e del corpo
          </p>
        </div>

        <ProductsGrid
          products={productsWithLabels}
          isAuthenticated={!!user}
          categories={Object.entries(categoryLabels).map(([value, label]) => ({
            value: value as product_category,
            label,
          }))}
        />
      </div>
    </div>
  );
}

