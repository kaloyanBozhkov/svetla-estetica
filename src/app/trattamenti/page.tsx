import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { ServicesGrid } from "./ServicesGrid";
import { type service_category } from "@prisma/client";
import type { Metadata } from "next";
import { generateServiceListSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Trattamenti Estetici",
  description: "Scopri i nostri trattamenti estetici professionali: viso, corpo, manicure, pedicure, ceretta, luce pulsata, solarium e grotta di sale a Dalmine.",
  openGraph: {
    title: "Trattamenti Estetici | Svetla Estetica",
    description: "Trattamenti estetici professionali a Dalmine. Prenota il tuo appuntamento!",
  },
  alternates: {
    canonical: "/trattamenti",
  },
};

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
    orderBy: [{ priority: "desc" }, { name: "asc" }],
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

  const jsonLd = generateServiceListSchema(
    services.map((s) => ({
      uuid: s.uuid,
      name: s.name,
      price: s.price,
      image_url: s.image_url,
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
      <div className="absolute top-0 left-[5%] w-80 h-80 bg-gradient-to-br from-violet-200 to-primary-200 rounded-full blur-3xl opacity-40 pointer-events-none" />
      <div className="absolute top-[40%] right-[-5%] w-72 h-72 bg-gradient-to-br from-pink-200 to-fuchsia-200 rounded-full blur-3xl opacity-30 pointer-events-none" />
      <div className="absolute bottom-[10%] left-[10%] w-64 h-64 bg-gradient-to-br from-purple-200 to-violet-200 rounded-full blur-3xl opacity-35 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
    </>
  );
}

