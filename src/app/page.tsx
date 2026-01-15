import Link from "next/link";
import { Button } from "@/components/atoms";
import {
  FaceIcon,
  BodyIcon,
  MakeupIcon,
  ManicureIcon,
  PedicureIcon,
  WaxIcon,
  SolariumIcon,
  LaserIcon,
  AppointmentIcon,
  SaltCaveIcon,
  TagIcon,
} from "@/components/atoms/icons";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";

const categoryLabels: Record<string, string> = {
  viso: "Viso",
  corpo: "Corpo",
  solari: "Solari",
  tisane: "Tisane",
  make_up: "Make Up",
  profumi: "Profumi",
  mani_e_piedi: "Mani e Piedi",
};

const services = [
  { name: "Viso", slug: "viso", Icon: FaceIcon, color: "from-rose-400 to-pink-500" },
  { name: "Corpo", slug: "corpo", Icon: BodyIcon, color: "from-amber-400 to-orange-500" },
  { name: "Make Up", slug: "make_up", Icon: MakeupIcon, color: "from-fuchsia-400 to-purple-500" },
  { name: "Manicure", slug: "manicure", Icon: ManicureIcon, color: "from-red-400 to-rose-500" },
  { name: "Pedicure", slug: "pedicure", Icon: PedicureIcon, color: "from-teal-400 to-cyan-500" },
  { name: "Ceretta", slug: "ceretta", Icon: WaxIcon, color: "from-yellow-400 to-amber-500" },
  { name: "Solarium", slug: "solarium", Icon: SolariumIcon, color: "from-orange-400 to-yellow-500" },
  { name: "Luce Pulsata", slug: "luce_pulsata", Icon: LaserIcon, color: "from-violet-400 to-purple-500" },
  { name: "Appuntamento", slug: "appuntamento", Icon: AppointmentIcon, color: "from-sky-400 to-blue-500" },
  { name: "Grotta di Sale", slug: "grotta_di_sale", Icon: SaltCaveIcon, color: "from-emerald-400 to-teal-500" },
];

async function getFeaturedProducts() {
  return db.product.findMany({
    where: { active: true },
    orderBy: { created_at: "desc" },
    take: 4,
  });
}

export default async function HomePage() {
  const products = await getFeaturedProducts();

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#fdfbf9]">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hero-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1.5" fill="currentColor" className="text-primary-900" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-pattern)" />
          </svg>
        </div>

        {/* Decorative Blobs */}
        <div className="absolute top-20 right-[10%] w-72 h-72 bg-gradient-to-br from-primary-200 to-primary-300 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-20 left-[5%] w-96 h-96 bg-gradient-to-br from-accent-200 to-rose-200 rounded-full blur-3xl opacity-30" />
        <div className="absolute top-1/2 right-[30%] w-48 h-48 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full blur-2xl opacity-40" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-2 text-sm font-medium text-primary-700 mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                </span>
                Centro Estetico a Dalmine
              </div>
              
              <h1 className="font-display text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Il Tuo Momento di
                <span className="block mt-2 bg-gradient-to-r from-primary-600 via-rose-500 to-accent-500 bg-clip-text text-transparent">
                  Bellezza e Relax
                </span>
              </h1>
              
              <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                Da oltre 15 anni ci prendiamo cura della tua bellezza con trattamenti 
                personalizzati, prodotti di qualità e un ambiente accogliente dove 
                sentirti coccolata.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link href="/trattamenti">
                  <Button size="lg" className="w-full sm:w-auto shadow-lg shadow-primary-200">
                    Scopri i Trattamenti
                    <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Button>
                </Link>
                <Link href="/prodotti">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Vedi i Prodotti
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="mt-12 flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-300 to-primary-400 ring-2 ring-white flex items-center justify-center text-xs font-bold text-white">
                        {["S", "E", "💄", "✨"][i - 1]}
                      </div>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">1000+ clienti soddisfatte</span>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative lg:pl-8 hidden lg:block">
              <div className="relative">
                {/* Main Card */}
                <div className="relative z-10 rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 p-8 shadow-2xl">
                  <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent-400/20 via-transparent to-transparent" />
                  <div className="relative text-white">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-primary-200 text-sm">Orario</p>
                        <p className="font-semibold">Lun-Ven 9:00-20:00</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
                          <FaceIcon className="h-5 w-5" />
                        </div>
                        <span>Trattamenti Viso</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
                          <BodyIcon className="h-5 w-5" />
                        </div>
                        <span>Trattamenti Corpo</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
                          <ManicureIcon className="h-5 w-5" />
                        </div>
                        <span>Manicure & Pedicure</span>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/20">
                      <a href="tel:+393935026350" className="flex items-center gap-3 group">
                        <div className="h-12 w-12 rounded-xl bg-accent-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-primary-200 text-sm">Prenota Ora</p>
                          <p className="font-bold text-lg">393 502 6350</p>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 h-24 w-24 rounded-2xl bg-accent-400 shadow-lg flex items-center justify-center text-white z-20">
                  <div className="text-center">
                    <p className="text-2xl font-bold">15+</p>
                    <p className="text-xs">Anni</p>
                  </div>
                </div>
                
                <div className="absolute -bottom-6 -left-6 h-20 w-20 rounded-2xl bg-white shadow-xl flex items-center justify-center z-20">
                  <div className="text-center">
                    <p className="text-3xl">⭐</p>
                    <p className="text-xs text-gray-600 font-medium">Top</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Curve */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold text-gray-900 sm:text-4xl">
              I Nostri Trattamenti
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Scopri tutti i servizi che offriamo per il tuo benessere
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 lg:gap-6">
            {services.map((service) => (
              <Link
                key={service.name}
                href={`/trattamenti?categoria=${service.slug}`}
                className="group relative flex flex-col items-center rounded-2xl bg-gray-50 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className={`flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br ${service.color} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                  <service.Icon className="h-8 w-8" />
                </div>
                <span className="mt-4 text-center font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                  {service.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      {products.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <div className="flex items-center gap-2 text-primary-600 mb-2">
                  <TagIcon className="h-5 w-5" />
                  <span className="text-sm font-semibold uppercase tracking-wider">Novità</span>
                </div>
                <h2 className="font-display text-3xl font-bold text-gray-900 sm:text-4xl">
                  I Nostri Prodotti
                </h2>
              </div>
              <Link href="/prodotti">
                <Button variant="outline">
                  Vedi Tutti
                  <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/prodotti/${product.uuid}`}
                  className="group relative overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-50 relative overflow-hidden">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-3xl font-display font-bold text-gray-400">
                            {product.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-medium text-gray-700 shadow-sm">
                        {categoryLabels[product.category] || product.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-lg font-semibold text-gray-900 line-clamp-1 group-hover:text-primary-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                      {product.description || "Prodotto di alta qualità"}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="font-display text-lg font-bold text-primary-600">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-sm text-primary-600 font-medium group-hover:underline">
                        Dettagli →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="font-display text-3xl font-bold sm:text-4xl">
                Perché Sceglierci
              </h2>
              <ul className="mt-8 space-y-5">
                {[
                  { text: "Oltre 15 anni di esperienza nel settore", icon: "⭐" },
                  { text: "Prodotti di alta qualità selezionati", icon: "✓" },
                  { text: "Ambiente accogliente e rilassante", icon: "✓" },
                  { text: "Trattamenti personalizzati", icon: "✓" },
                  { text: "Prezzi competitivi", icon: "✓" },
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                      <svg className="h-5 w-5 text-accent-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-lg">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-white/10 p-8 backdrop-blur-sm ring-1 ring-white/20">
              <h3 className="font-display text-2xl font-bold">Orario di Apertura</h3>
              <ul className="mt-6 space-y-3">
                <li className="flex justify-between py-2 border-b border-white/10">
                  <span>Lunedì - Venerdì</span>
                  <span className="font-semibold">09:00 - 20:00</span>
                </li>
                <li className="flex justify-between py-2">
                  <span>Sabato</span>
                  <span className="font-semibold">09:00 - 18:00</span>
                </li>
              </ul>
              <div className="mt-8 pt-6 border-t border-white/20">
                <h4 className="font-semibold mb-3">Contattaci Ora</h4>
                <a
                  href="tel:+393935026350"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-primary-600 transition-all hover:bg-gray-100 hover:scale-[1.02]"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  (+39) 393 5026 350
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="rounded-3xl bg-gradient-to-br from-accent-50 via-amber-50 to-orange-50 p-12 ring-1 ring-accent-100 shadow-xl">
            <h2 className="font-display text-3xl font-bold text-gray-900 sm:text-4xl">
              Pronta a Prenderti Cura di Te?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Accedi per vedere i prezzi e prenotare il tuo appuntamento
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/accedi">
                <Button size="lg">
                  Accedi Ora
                  <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Button>
              </Link>
              <Link href="/contatti">
                <Button variant="outline" size="lg">
                  Contattaci
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
