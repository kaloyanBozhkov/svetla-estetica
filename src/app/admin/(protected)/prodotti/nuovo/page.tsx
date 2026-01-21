import { db } from '@/lib/db';
import { ProductForm } from '../ProductForm';
import Link from 'next/link';

export default async function NewProductPage() {
  const brands = await db.brand.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/prodotti" className="text-sm text-gray-500 hover:text-gray-700">
          ← Torna ai prodotti
        </Link>
        <h1 className="font-display text-3xl font-bold text-gray-900 mt-2">Nuovo Prodotto</h1>
      </div>

      <ProductForm brands={brands} />
    </div>
  );
}
