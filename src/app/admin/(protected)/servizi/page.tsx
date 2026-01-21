import { db } from '@/lib/db';
import { ServicesTable } from './ServicesTable';
import { Button } from '@/components/atoms';
import Link from 'next/link';
import { type service_category } from '@prisma/client';
import { Pagination } from '@/components/atoms/Pagination';
import { SERVICE_CATEGORY_LABELS } from '@/lib/constants';

const ITEMS_PER_PAGE = 30;

const categoryLabels = SERVICE_CATEGORY_LABELS as Record<service_category, string>;

export default async function AdminServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const { page: pageParam, q: searchQuery } = await searchParams;
  const page = parseInt(pageParam || '1');
  const skip = (page - 1) * ITEMS_PER_PAGE;

  const whereClause = {
    deleted_at: null,
    ...(searchQuery
      ? {
          OR: [{ name: { contains: searchQuery, mode: 'insensitive' as const } }],
        }
      : {}),
  };

  const [services, totalCount] = await Promise.all([
    db.service.findMany({
      where: whereClause,
      orderBy: [{ priority: 'desc' }, { name: 'asc' }],
      skip,
      take: ITEMS_PER_PAGE,
    }),
    db.service.count({ where: whereClause }),
  ]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const servicesWithLabels = services.map((s) => ({
    id: s.id,
    uuid: s.uuid,
    name: s.name,
    price: s.price,
    durationMin: s.duration_min,
    category: s.category,
    categoryLabel: categoryLabels[s.category],
    active: s.active,
  }));

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900">
            Gestione Servizi
          </h1>
          <p className="mt-1 text-gray-500">
            {searchQuery
              ? `${totalCount} risultati per "${searchQuery}"`
              : `${totalCount} servizi totali`}
          </p>
        </div>
        <Link href="/admin/servizi/nuovo" className="shrink-0">
          <Button className="w-full sm:w-auto">Aggiungi Servizio</Button>
        </Link>
      </div>

      <ServicesTable services={servicesWithLabels} initialSearch={searchQuery || ''} />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        baseUrl="/admin/servizi"
        preserveParams={{ q: searchQuery }}
      />
    </div>
  );
}
