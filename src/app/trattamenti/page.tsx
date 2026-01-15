import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { ServicesGrid } from "./ServicesGrid";
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

export default async function ServicesPage() {
  const user = await getSession();
  const services = await db.service.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  });

  const servicesWithLabels = services.map((s) => ({
    id: s.id,
    uuid: s.uuid,
    name: s.name,
    description: s.description,
    price: s.price,
    durationMin: s.duration_min,
    imageUrl: s.image_url,
    category: s.category,
    categoryLabel: categoryLabels[s.category],
  }));

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold text-gray-900">
            I Nostri Trattamenti
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Scopri i nostri trattamenti estetici professionali
          </p>
        </div>

        <ServicesGrid
          services={servicesWithLabels}
          isAuthenticated={!!user}
          categories={Object.entries(categoryLabels).map(([value, label]) => ({
            value: value as service_category,
            label,
          }))}
        />
      </div>
    </div>
  );
}

