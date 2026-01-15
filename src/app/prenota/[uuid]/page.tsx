import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { BookingForm } from "./BookingForm";

interface BookingPageProps {
  params: Promise<{ uuid: string }>;
}

export default async function BookingPage({ params }: BookingPageProps) {
  const { uuid } = await params;
  const user = await getSession();

  if (!user) {
    redirect("/accedi");
  }

  const service = await db.service.findUnique({
    where: { uuid, active: true },
  });

  if (!service) {
    notFound();
  }

  return (
    <div className="py-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <BookingForm
          service={{
            id: service.id,
            uuid: service.uuid,
            name: service.name,
            price: service.price,
            durationMin: service.duration_min,
          }}
        />
      </div>
    </div>
  );
}

