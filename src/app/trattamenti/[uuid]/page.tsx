import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ServiceDetail } from "./ServiceDetail";
import type { Metadata } from "next";

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
  if (!service) return { title: "Trattamento non trovato" };

  return {
    title: service.name,
    description: service.description || `Prenota ${service.name} da Svetla Estetica`,
  };
}

export default async function ServicePage({ params }: Props) {
  const { uuid } = await params;
  const service = await getService(uuid);

  if (!service) {
    notFound();
  }

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ServiceDetail service={service} />
      </div>
    </div>
  );
}

