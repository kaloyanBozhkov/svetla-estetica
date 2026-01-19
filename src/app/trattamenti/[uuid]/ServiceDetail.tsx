"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Badge, HtmlContent } from "@/components/atoms";
import { useAuthStore } from "@/stores";
import { formatPrice } from "@/lib/utils";
import type { service } from "@prisma/client";

const categoryLabels: Record<string, string> = {
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

interface Props {
  service: service;
}

export function ServiceDetail({ service }: Props) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();
  const isAuth = !isLoading && isAuthenticated();

  const handleBook = () => {
    if (!isAuth) {
      router.push("/accedi");
      return;
    }
    router.push(`/prenota/${service.uuid}`);
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  return (
    <>
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center gap-2 text-sm text-gray-500">
          <li>
            <Link href="/" className="hover:text-primary-600">Home</Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/trattamenti" className="hover:text-primary-600">Trattamenti</Link>
          </li>
          <li>/</li>
          <li className="text-gray-900 font-medium truncate">{service.name}</li>
        </ol>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Image */}
        <div className="group relative aspect-[4/3] overflow-hidden rounded-3xl bg-gradient-to-br from-primary-50 to-gray-50 shadow-xl ring-1 ring-primary-100">
          {service.image_url ? (
            <img
              src={service.image_url}
              alt={service.name}
              className="h-full w-full object-contain p-6 transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-24 w-24 rounded-full bg-primary-200 flex items-center justify-center mb-4">
                  <svg className="h-12 w-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6z" />
                  </svg>
                </div>
                <span className="text-primary-600 font-medium">{categoryLabels[service.category] || service.category}</span>
              </div>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <Badge variant="default" className="self-start mb-4 bg-primary-100 text-primary-700">
            {categoryLabels[service.category] || service.category}
          </Badge>

          <h1 className="font-display text-3xl font-bold text-gray-900 sm:text-4xl">
            {service.name}
          </h1>

          {service.description && (
            <HtmlContent
              html={service.description}
              className="mt-4 text-lg text-gray-600 leading-relaxed [&>br]:block"
            />
          )}

          {/* Duration & Price Card */}
          <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-primary-50 to-white ring-1 ring-primary-100">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-gray-500 text-sm mb-1">Durata</p>
                <p className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <svg className="h-6 w-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {formatDuration(service.duration_min)}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Prezzo</p>
                <p className="text-2xl font-bold text-primary-600">
                  {formatPrice(service.price)}
                </p>
              </div>
            </div>
          </div>

          {/* Book Button */}
          <div className="mt-8">
            {isAuth ? (
              <Button size="lg" className="w-full" onClick={handleBook}>
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Prenota Ora
              </Button>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-600 text-center">
                  Accedi per prenotare questo trattamento
                </p>
                <Link href="/accedi" className="block">
                  <Button size="lg" className="w-full">
                    Accedi per Prenotare
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Quick Contact */}
          <div className="mt-8 p-6 rounded-2xl bg-gray-50 ring-1 ring-gray-100">
            <h3 className="font-semibold text-gray-900 mb-3">
              Preferisci prenotare al telefono?
            </h3>
            <a
              href="tel:+393935026350"
              className="inline-flex items-center gap-2 text-primary-600 font-medium hover:underline"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              (+39) 393 5026 350
            </a>
          </div>

          {/* Info */}
          <div className="mt-8 pt-8 border-t border-gray-200 space-y-4">
            <div className="flex items-center gap-3 text-gray-600">
              <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Personale qualificato</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Prodotti professionali</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Ambiente rilassante</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

