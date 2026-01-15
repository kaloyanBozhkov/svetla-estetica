import Link from "next/link";
import { Button } from "@/components/atoms";

const services = [
  { name: "Viso", icon: "✨" },
  { name: "Corpo", icon: "🌸" },
  { name: "Make Up", icon: "💄" },
  { name: "Manicure", icon: "💅" },
  { name: "Pedicure", icon: "🦶" },
  { name: "Ceretta", icon: "🌿" },
  { name: "Solarium", icon: "☀️" },
  { name: "Luce Pulsata", icon: "⚡" },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5" />
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="text-center">
            <h1 className="font-display text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Benvenuta da{" "}
              <span className="text-gradient">Svetla Estetica</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              Il tuo centro estetico di fiducia a Dalmine, Bergamo.
              Trattamenti professionali per viso e corpo in un ambiente
              accogliente e rilassante.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/trattamenti">
                <Button size="lg">Scopri i Trattamenti</Button>
              </Link>
              <Link href="/prodotti">
                <Button variant="outline" size="lg">
                  Vedi i Prodotti
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold text-gray-900 sm:text-4xl">
              I Nostri Servizi
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Scopri tutti i trattamenti che offriamo
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6">
            {services.map((service) => (
              <Link
                key={service.name}
                href={`/trattamenti?categoria=${service.name.toLowerCase().replace(" ", "_")}`}
                className="group flex flex-col items-center rounded-xl bg-gray-50 p-6 transition-all duration-300 hover:bg-primary-50 hover:shadow-lg"
              >
                <span className="text-4xl">{service.icon}</span>
                <span className="mt-3 font-medium text-gray-900 group-hover:text-primary-600">
                  {service.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="font-display text-3xl font-bold sm:text-4xl">
                Perché Sceglierci
              </h2>
              <ul className="mt-8 space-y-4">
                {[
                  "Oltre 15 anni di esperienza nel settore",
                  "Prodotti di alta qualità selezionati",
                  "Ambiente accogliente e rilassante",
                  "Trattamenti personalizzati",
                  "Prezzi competitivi",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <svg
                      className="h-6 w-6 flex-shrink-0 text-accent-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-white/10 p-8 backdrop-blur-sm">
              <h3 className="font-display text-2xl font-bold">Orario</h3>
              <ul className="mt-4 space-y-2">
                <li className="flex justify-between">
                  <span>Lun - Ven</span>
                  <span>09:00 - 20:00</span>
                </li>
                <li className="flex justify-between">
                  <span>Sabato</span>
                  <span>09:00 - 18:00</span>
                </li>
              </ul>
              <div className="mt-6 pt-6 border-t border-white/20">
                <h4 className="font-semibold">Contattaci</h4>
                <p className="mt-2">
                  <a href="tel:+393935026350" className="hover:text-accent-300">
                    (+39) 393 5026 350
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl font-bold text-gray-900 sm:text-4xl">
            Pronta a Prenderti Cura di Te?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Accedi per vedere i prezzi e prenotare il tuo appuntamento
          </p>
          <div className="mt-8">
            <Link href="/accedi">
              <Button size="lg">Accedi Ora</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

