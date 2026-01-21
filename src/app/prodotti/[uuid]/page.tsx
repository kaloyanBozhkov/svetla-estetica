import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { ProductDetail } from './ProductDetail';
import type { Metadata } from 'next';
import { generateProductSchema, generateBreadcrumbSchema } from '@/lib/seo';
import { BASE_URL } from '@/lib/constants';

interface Props {
  params: Promise<{ uuid: string }>;
}

async function getProduct(uuid: string) {
  return db.product.findUnique({
    where: { uuid, deleted_at: null },
    include: { brand: true },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { uuid } = await params;
  const product = await getProduct(uuid);
  if (!product) return { title: 'Prodotto non trovato' };

  const title = `${product.name}${product.brand?.name ? ` - ${product.brand.name}` : ''}`;
  const description =
    product.description ||
    `Acquista ${product.name} da Svetla Estetica. Prodotti di bellezza professionali.`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Svetla Estetica`,
      description,
      images: product.image_url ? [{ url: product.image_url }] : undefined,
      type: 'website',
    },
    alternates: {
      canonical: `/prodotti/${uuid}`,
    },
  };
}

export async function generateStaticParams() {
  const products = await db.product.findMany({
    where: { active: true, deleted_at: null },
    select: { uuid: true },
  });
  return products.map((p) => ({ uuid: p.uuid }));
}

export default async function ProductPage({ params }: Props) {
  const { uuid } = await params;
  const product = await getProduct(uuid);

  if (!product) {
    notFound();
  }

  const productSchema = generateProductSchema({
    uuid: product.uuid,
    name: product.name,
    description: product.description,
    price: product.price,
    image_url: product.image_url,
    stock: product.stock,
    category: product.category,
    brand_name: product.brand?.name,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Prodotti', url: `${BASE_URL}/prodotti` },
    { name: product.name, url: `${BASE_URL}/prodotti/${product.uuid}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ProductDetail product={product} />
        </div>
      </div>
    </>
  );
}
