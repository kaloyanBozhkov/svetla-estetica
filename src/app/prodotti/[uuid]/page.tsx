import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ProductDetail } from "./ProductDetail";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ uuid: string }>;
}

async function getProduct(uuid: string) {
  return db.product.findUnique({
    where: { uuid },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { uuid } = await params;
  const product = await getProduct(uuid);
  if (!product) return { title: "Prodotto non trovato" };

  return {
    title: product.name,
    description: product.description || `Acquista ${product.name} da Svetla Estetica`,
  };
}

export default async function ProductPage({ params }: Props) {
  const { uuid } = await params;
  const product = await getProduct(uuid);

  if (!product) {
    notFound();
  }

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ProductDetail product={product} />
      </div>
    </div>
  );
}

