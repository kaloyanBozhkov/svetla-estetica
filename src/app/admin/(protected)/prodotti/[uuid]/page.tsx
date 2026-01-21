import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { ProductForm } from '../ProductForm';
import Link from 'next/link';

interface Props {
  params: Promise<{ uuid: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { uuid } = await params;

  const [product, brands] = await Promise.all([
    db.product.findUnique({ where: { uuid } }),
    db.brand.findMany({ orderBy: { name: 'asc' } }),
  ]);

  if (!product) {
    notFound();
  }

  const initialData = {
    uuid: product.uuid,
    name: product.name,
    description: product.description || '',
    price: product.price / 100,
    discountPercent: product.discount_percent,
    stock: product.stock,
    priority: product.priority,
    category: product.category,
    brandId: product.brand_id,
    imageUrl: product.image_url || '',
    active: product.active,
  };

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/prodotti" className="text-sm text-gray-500 hover:text-gray-700">
          ← Torna ai prodotti
        </Link>
        <h1 className="font-display text-3xl font-bold text-gray-900 mt-2">Modifica Prodotto</h1>
      </div>

      <ProductForm initialData={initialData} brands={brands} isEdit />
    </div>
  );
}
