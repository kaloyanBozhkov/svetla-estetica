import { db } from "@/lib/db";
import { ServicesTable } from "./ServicesTable";
import { Button } from "@/components/atoms";
import Link from "next/link";
import { type service_category } from "@prisma/client";

const categoryLabels: Record<service_category, string> = {
  viso: "Viso",
  corpo: "Corpo",
  make_up: "Make Up",
  ceretta: "Ceretta",
  solarium: "Solarium",
  pedicure: "Pedicure",
  manicure: "Manicure",
  luce_pulsata: "Luce Pulsata",
  appuntamento: "Appuntamento",
  grotta_di_sale: "Grotta di Sale",
};

export default async function AdminServicesPage() {
  const services = await db.service.findMany({
    orderBy: { name: "asc" },
  });

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
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-900">
          Gestione Servizi
        </h1>
        <Link href="/admin/servizi/nuovo">
          <Button>Aggiungi Servizio</Button>
        </Link>
      </div>

      <ServicesTable services={servicesWithLabels} />
    </div>
  );
}

