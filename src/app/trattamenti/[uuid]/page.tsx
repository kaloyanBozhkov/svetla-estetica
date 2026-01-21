import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { ServiceDetail } from './ServiceDetail';
import type { Metadata } from 'next';
import { generateServiceSchema, generateBreadcrumbSchema } from '@/lib/seo';
import { BASE_URL } from '@/lib/constants';

interface Props {
  params: Promise<{ uuid: string }>;
}

async function getService(uuid: string) {
  return db.service.findUnique({
    where: { uuid },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { uuid } = await params;
  const service = await getService(uuid);
  if (!service) return { title: 'Trattamento non trovato' };

  const description =
    service.description ||
    `Prenota ${service.name} da Svetla Estetica Dalmine. Trattamenti estetici professionali.`;

  return {
    title: service.name,
    description,
    openGraph: {
      title: `${service.name} | Svetla Estetica`,
      description,
      images: service.image_url ? [{ url: service.image_url }] : undefined,
      type: 'website',
    },
    alternates: {
      canonical: `/trattamenti/${uuid}`,
    },
  };
}

export async function generateStaticParams() {
  const services = await db.service.findMany({
    where: { active: true },
    select: { uuid: true },
  });
  return services.map((s) => ({ uuid: s.uuid }));
}

export default async function ServicePage({ params }: Props) {
  const { uuid } = await params;
  const service = await getService(uuid);

  if (!service) {
    notFound();
  }

  const serviceSchema = generateServiceSchema({
    uuid: service.uuid,
    name: service.name,
    description: service.description,
    price: service.price,
    duration_min: service.duration_min,
    image_url: service.image_url,
    category: service.category,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Trattamenti', url: `${BASE_URL}/trattamenti` },
    { name: service.name, url: `${BASE_URL}/trattamenti/${service.uuid}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ServiceDetail service={service} />
        </div>
      </div>
    </>
  );
}
