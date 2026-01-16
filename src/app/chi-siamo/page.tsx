import Link from "next/link";
import { Button } from "@/components/atoms";

const values = [
  {
    title: "Professionalità",
    description:
      "Oltre 15 anni di esperienza nel settore estetico, formazione continua e attenzione ai dettagli.",
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
        />
      </svg>
    ),
  },
  {
    title: "Qualità",
    description:
      "Solo prodotti certificati e tecnologie all'avanguardia per risultati visibili e duraturi.",
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
      </svg>
    ),
  },
  {
    title: "Benessere",
    description:
      "Un'oasi di relax dove prenderti cura di te stessa, lontano dallo stress quotidiano.",
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    ),
  },
];

const services = [
  { name: "Trattamenti Viso", icon: "✨" },
  { name: "Trattamenti Corpo", icon: "🌸" },
  { name: "Manicure & Pedicure", icon: "💅" },
  { name: "Ceretta & Epilazione", icon: "🌿" },
  { name: "Luce Pulsata", icon: "⚡" },
  { name: "Solarium", icon: "☀️" },
  { name: "Make Up", icon: "💄" },
  { name: "Grotta di Sale", icon: "🧂" },
];

const stats = [
  { value: "15+", label: "Anni di esperienza" },
  { value: "1000+", label: "Clienti soddisfatte" },
  { value: "50+", label: "Trattamenti disponibili" },
  { value: "100%", label: "Prodotti di qualità" },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-800 via-primary-700 to-primary-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent-400/30 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-rose-400/20 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="max-w-3xl">
            <p className="text-accent-300 font-medium mb-4 tracking-wider uppercase text-sm">
              La tua destinazione di bellezza
            </p>
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Dove la Bellezza
              <br />
              <span className="bg-gradient-to-r from-accent-300 to-amber-300 bg-clip-text text-transparent">
                Incontra il Benessere
              </span>
            </h1>
            <p className="mt-6 text-lg text-primary-100 max-w-2xl leading-relaxed">
              Da oltre 15 anni, Svetla Estetica è il punto di riferimento per
              chi cerca trattamenti estetici di qualità a Dalmine. Un luogo dove
              professionalità, passione e attenzione al cliente si fondono per
              regalarti momenti di puro relax.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700 mb-6">
                <span className="h-2 w-2 rounded-full bg-primary-500"></span>
                La Nostra Storia
              </div>
              <h2 className="font-display text-3xl font-bold text-gray-900 sm:text-4xl">
                Una Passione che Dura
                <br />
                <span className="text-primary-600">da Generazioni</span>
              </h2>
              <div className="mt-6 space-y-4 text-gray-600 leading-relaxed">
                <p>
                  <strong className="text-gray-900">Svetla Estetica</strong>{" "}
                  nasce dalla passione per la bellezza e il benessere. Situato
                  nel cuore di Dalmine, il nostro centro è diventato negli anni
                  un punto di riferimento per chi cerca trattamenti estetici di
                  qualità in un ambiente familiare e professionale.
                </p>
                <p>
                  Crediamo che ogni persona sia unica e meriti cure
                  personalizzate. Per questo, ascoltiamo attentamente le
                  esigenze di ogni cliente, creando percorsi di bellezza su
                  misura che valorizzano la tua unicità naturale.
                </p>
                <p>
                  La nostra filosofia è semplice: farti sentire speciale,
                  rilassata e più bella, ogni volta che varchi la nostra porta.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/5] rounded-3xl bg-gradient-to-br from-primary-100 via-rose-50 to-accent-50 overflow-hidden shadow-2xl">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="mx-auto h-32 w-32 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg mb-6">
                      <span className="font-display text-5xl font-bold text-primary-600">
                        SE
                      </span>
                    </div>
                    <p className="font-display text-2xl font-bold text-gray-800">
                      Svetla Estetica
                    </p>
                    <p className="text-gray-600 mt-2">
                      Dal cuore, per la tua bellezza
                    </p>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 h-24 w-24 rounded-2xl bg-accent-400 opacity-20 blur-xl"></div>
              <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-primary-400 opacity-20 blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-bold text-gray-900 sm:text-4xl">
              I Nostri Valori
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Ogni giorno ci impegniamo per offrirti un&apos;esperienza unica,
              guidati dai principi che definiscono chi siamo
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {values.map((value) => (
              <div
                key={value.title}
                className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-lg ring-1 ring-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary-50 opacity-50 transition-transform duration-500 group-hover:scale-150"></div>
                <div className="relative">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-200 mb-6">
                    {value.icon}
                  </div>
                  <h3 className="font-display text-xl font-bold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-4xl font-bold text-accent-300 sm:text-5xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-primary-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-bold text-gray-900 sm:text-4xl">
              I Nostri Trattamenti
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Una gamma completa di servizi estetici per prenderti cura di te
              dalla testa ai piedi
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-6">
            {services.map((service) => (
              <div
                key={service.name}
                className="group flex flex-col items-center rounded-2xl bg-gradient-to-br from-gray-50 to-white p-6 ring-1 ring-gray-100 transition-all duration-300 hover:shadow-lg hover:ring-primary-200"
              >
                <span className="text-4xl mb-3 transition-transform duration-300 group-hover:scale-110">
                  {service.icon}
                </span>
                <span className="text-center font-medium text-gray-700 group-hover:text-primary-600 transition-colors">
                  {service.name}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/trattamenti">
              <Button size="lg">
                Scopri Tutti i Trattamenti
                <svg
                  className="ml-2 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 bg-gradient-to-br from-accent-50 via-amber-50 to-orange-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-4">
                {["Viso", "Corpo", "Solari", "Profumi"].map((cat, i) => (
                  <div
                    key={cat}
                    className={`rounded-2xl p-6 ${
                      i % 2 === 0 ? "bg-white" : "bg-primary-600 text-white"
                    } shadow-lg`}
                  >
                    <p
                      className={`font-display text-lg font-bold ${
                        i % 2 === 0 ? "text-gray-900" : ""
                      }`}
                    >
                      {cat}
                    </p>
                    <p
                      className={`mt-1 text-sm ${
                        i % 2 === 0 ? "text-gray-500" : "text-primary-100"
                      }`}
                    >
                      Prodotti selezionati
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-accent-100 px-4 py-2 text-sm font-medium text-accent-700 mb-6">
                <span className="h-2 w-2 rounded-full bg-accent-500"></span>
                Shop Online
              </div>
              <h2 className="font-display text-3xl font-bold text-gray-900 sm:text-4xl">
                Prodotti di
                <br />
                <span className="text-primary-600">Alta Qualità</span>
              </h2>
              <p className="mt-6 text-gray-600 leading-relaxed">
                Oltre ai trattamenti in cabina, offriamo una selezione curata di
                prodotti per la cura quotidiana della pelle e del corpo. Creme,
                solari, tisane, profumi e molto altro - tutti scelti per
                garantirti risultati professionali anche a casa.
              </p>
              <div className="mt-8">
                <Link href="/prodotti">
                  <Button variant="outline" size="lg">
                    Esplora i Prodotti
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 p-12 text-center text-white shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-accent-400/30 via-transparent to-transparent"></div>
            <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/10"></div>
            <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-accent-400/20"></div>

            <div className="relative">
              <h2 className="font-display text-3xl font-bold sm:text-4xl">
                Vieni a Trovarci
              </h2>
              <p className="mt-4 text-lg text-primary-100 max-w-xl mx-auto">
                Ti aspettiamo nel nostro centro per un&apos;esperienza di
                benessere unica. Prenota il tuo appuntamento o passa a trovarci!
              </p>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="tel:+393935026350"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 font-semibold text-primary-600 shadow-lg transition-all hover:bg-gray-50 hover:scale-[1.02]"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  Chiamaci Ora
                </a>
                <Link
                  href="/contatti"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/20 backdrop-blur-sm px-8 py-4 font-semibold text-white transition-all hover:bg-white/30 hover:scale-[1.02]"
                >
                  Vedi Contatti
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
