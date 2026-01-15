import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { ServiceForm } from "../ServiceForm";
import Link from "next/link";

interface Props {
  params: Promise<{ uuid: string }>;
}

export default async function EditServicePage({ params }: Props) {
  const { uuid } = await params;

  const service = await db.service.findUnique({ where: { uuid } });

  if (!service) {
    notFound();
  }

  const initialData = {
    uuid: service.uuid,
    name: service.name,
    description: service.description || "",
    price: service.price / 100,
    durationMin: service.duration_min,
    category: service.category,
    imageUrl: service.image_url || "",
    active: service.active,
  };

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/servizi"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← Torna ai servizi
        </Link>
        <h1 className="font-display text-3xl font-bold text-gray-900 mt-2">
          Modifica Servizio
        </h1>
      </div>

      <ServiceForm initialData={initialData} isEdit />
    </div>
  );
}

