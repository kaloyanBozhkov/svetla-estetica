"use client";

import { Card, Badge, Button } from "@/components/atoms";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { type service_category } from "@prisma/client";

interface Service {
  id: number;
  uuid: string;
  name: string;
  price: number;
  durationMin: number;
  category: service_category;
  categoryLabel: string;
  active: boolean;
}

interface ServicesTableProps {
  services: Service[];
}

export function ServicesTable({ services }: ServicesTableProps) {
  if (services.length === 0) {
    return (
      <Card className="text-center py-12">
        <p className="text-gray-500">Nessun servizio trovato</p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Categoria
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Prezzo
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Durata
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Stato
              </th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                Azioni
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {services.map((service) => (
              <tr key={service.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {service.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {service.categoryLabel}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {formatPrice(service.price)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {service.durationMin} min
                </td>
                <td className="px-6 py-4">
                  <Badge variant={service.active ? "success" : "default"}>
                    {service.active ? "Attivo" : "Inattivo"}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link href={`/admin/servizi/${service.uuid}`}>
                    <Button variant="ghost" size="sm">
                      Modifica
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

