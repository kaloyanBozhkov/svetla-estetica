"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ServiceCard } from "@/components/molecules";
import { Button } from "@/components/atoms";
import { type service_category } from "@prisma/client";

interface Service {
  id: number;
  uuid: string;
  name: string;
  description: string | null;
  price: number;
  durationMin: number;
  imageUrl: string | null;
  category: service_category;
  categoryLabel: string;
}

interface ServicesGridProps {
  services: Service[];
  isAuthenticated: boolean;
  categories: { value: service_category; label: string }[];
}

export function ServicesGrid({
  services,
  isAuthenticated,
  categories,
}: ServicesGridProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<service_category | null>(
    null
  );

  const filteredServices = selectedCategory
    ? services.filter((s) => s.category === selectedCategory)
    : services;

  const handleBook = (service: Service) => {
    router.push(`/prenota/${service.uuid}`);
  };

  return (
    <>
      <div className="mb-8 flex flex-wrap gap-2 justify-center">
        <Button
          variant={selectedCategory === null ? "primary" : "ghost"}
          size="sm"
          onClick={() => setSelectedCategory(null)}
        >
          Tutti
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat.value}
            variant={selectedCategory === cat.value ? "primary" : "ghost"}
            size="sm"
            onClick={() => setSelectedCategory(cat.value)}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {filteredServices.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Nessun trattamento trovato</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              name={service.name}
              description={service.description ?? undefined}
              price={service.price}
              durationMin={service.durationMin}
              imageUrl={service.imageUrl ?? undefined}
              category={service.categoryLabel}
              isAuthenticated={isAuthenticated}
              onBook={() => handleBook(service)}
            />
          ))}
        </div>
      )}
    </>
  );
}

