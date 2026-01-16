"use client";

import { useState, useMemo } from "react";
import { Card, Badge, Button, Input } from "@/components/atoms";
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

type SortKey = "name" | "category" | "price" | "duration" | "active";
type SortOrder = "asc" | "desc";

function SortIcon({ active, order }: { active: boolean; order: SortOrder }) {
  return (
    <span className={`block text-nowrap text-xs mt-0.5 ${active ? "text-primary-600" : "text-gray-400 opacity-0 group-hover:opacity-100"}`}>
      {active ? (order === "asc" ? "↑ cresc" : "↓ decresc") : "↕"}
    </span>
  );
}

export function ServicesTable({ services }: ServicesTableProps) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const handleSort = (key: SortKey) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  };

  const filteredAndSorted = useMemo(() => {
    let result = services;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.categoryLabel.toLowerCase().includes(q)
      );
    }

    result = [...result].sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "category":
          comparison = a.categoryLabel.localeCompare(b.categoryLabel);
          break;
        case "price":
          comparison = a.price - b.price;
          break;
        case "duration":
          comparison = a.durationMin - b.durationMin;
          break;
        case "active":
          comparison = (a.active ? 1 : 0) - (b.active ? 1 : 0);
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [services, search, sortBy, sortOrder]);

  const thClass =
    "px-6 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors select-none group";

  return (
    <div className="space-y-4">
      <Input
        placeholder="Cerca servizi..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      {filteredAndSorted.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-gray-500">Nessun servizio trovato</p>
        </Card>
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className={thClass} onClick={() => handleSort("name")}>
                    <span>Nome</span>
                    <SortIcon active={sortBy === "name"} order={sortOrder} />
                  </th>
                  <th className={thClass} onClick={() => handleSort("category")}>
                    <span>Categoria</span>
                    <SortIcon active={sortBy === "category"} order={sortOrder} />
                  </th>
                  <th className={thClass} onClick={() => handleSort("price")}>
                    <span>Prezzo</span>
                    <SortIcon active={sortBy === "price"} order={sortOrder} />
                  </th>
                  <th className={thClass} onClick={() => handleSort("duration")}>
                    <span>Durata</span>
                    <SortIcon active={sortBy === "duration"} order={sortOrder} />
                  </th>
                  <th className={thClass} onClick={() => handleSort("active")}>
                    <span>Stato</span>
                    <SortIcon active={sortBy === "active"} order={sortOrder} />
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                    Azioni
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAndSorted.map((service) => (
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
      )}
    </div>
  );
}
