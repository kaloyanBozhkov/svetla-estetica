import { db } from "@/lib/db";
import { ProductsGrid } from "./ProductsGrid";
import { type product_category } from "@prisma/client";
import type { Metadata } from "next";
import { generateProductListSchema } from "@/lib/seo";
import { PRODUCT_CATEGORY_LABELS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Prodotti di Bellezza",
  description: "Scopri la nostra selezione di prodotti professionali per la cura della pelle e del corpo. Creme viso, prodotti corpo, solari, tisane, profumi e molto altro.",
  openGraph: {
    title: "Prodotti di Bellezza | Svetla Estetica",
    description: "Prodotti professionali per la cura della pelle e del corpo. Qualità garantita.",
  },
  alternates: {
    canonical: "/prodotti",
  },
};

export default async function ProductsPage() {
  const products = await db.product.findMany({
    where: { active: true },
    orderBy: [{ priority: "desc" }, { name: "asc" }],
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
    categoryLabel: PRODUCT_CATEGORY_LABELS[p.category],
  }));

  const jsonLd = generateProductListSchema(
    products.map((p) => ({
      uuid: p.uuid,
      name: p.name,
      price: p.price,
      image_url: p.image_url,
    }))
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="relative py-12 min-h-screen overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-0 right-[10%] w-80 h-80 bg-gradient-to-br from-primary-200 to-violet-200 rounded-full blur-3xl opacity-40 pointer-events-none" />
      <div className="absolute top-[30%] left-[-5%] w-72 h-72 bg-gradient-to-br from-fuchsia-200 to-pink-200 rounded-full blur-3xl opacity-30 pointer-events-none" />
      <div className="absolute bottom-[20%] right-[5%] w-64 h-64 bg-gradient-to-br from-violet-200 to-purple-200 rounded-full blur-3xl opacity-35 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
          categories={Object.entries(PRODUCT_CATEGORY_LABELS).map(([value, label]) => ({
            value: value as product_category,
            label,
          }))}
        />
      </div>
    </div>
    </>
  );
}

