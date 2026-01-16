import Link from "next/link";

const businessHours = [
  { day: "Lunedì", hours: "09.00 - 20.00" },
  { day: "Martedì", hours: "09.00 - 20.00" },
  { day: "Mercoledì", hours: "09.00 - 20.00" },
  { day: "Giovedì", hours: "09.00 - 20.00" },
  { day: "Venerdì", hours: "09.00 - 20.00" },
  { day: "Sabato", hours: "09.00 - 18.00" },
  { day: "Domenica", hours: "Chiuso", closed: true },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-800 via-primary-700 to-primary-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent-400/20 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
              Vieni a Trovarci
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-primary-100">
              Siamo nel cuore di Dalmine. Contattaci per qualsiasi informazione
              o per prenotare il tuo trattamento.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Left Column - Info Cards */}
            <div className="space-y-8">
              {/* Hours Card */}
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-white p-8 shadow-lg ring-1 ring-gray-100 transition-all hover:shadow-xl">
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary-50 opacity-50 transition-transform group-hover:scale-150" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600 text-white shadow-lg shadow-primary-200">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h2 className="font-display text-2xl font-bold text-gray-900">
                      Orario Lavorativo
                    </h2>
                  </div>
                  <ul className="space-y-3">
                    {businessHours.map((item) => (
                      <li
                        key={item.day}
                        className={`flex justify-between py-3 border-b border-gray-100 last:border-0 ${
                          item.closed ? "text-gray-400" : ""
                        }`}
                      >
                        <span className="font-medium">{item.day}</span>
                        <span className={item.closed ? "italic" : "text-primary-600 font-semibold"}>
                          {item.hours}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Contact Card */}
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 p-8 shadow-lg transition-all hover:shadow-xl">
                <div className="absolute -right-12 -bottom-12 h-48 w-48 rounded-full bg-white/10 transition-transform group-hover:scale-110" />
                <div className="absolute -left-8 -top-8 h-32 w-32 rounded-full bg-accent-400/20" />
                <div className="relative text-white">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <h2 className="font-display text-2xl font-bold">
                      Contattaci
                    </h2>
                  </div>
                  <ul className="space-y-6">
                    <li>
                      <p className="text-sm text-primary-200 mb-1">Cellulare</p>
                      <a
                        href="tel:+393935026350"
                        className="text-xl font-bold hover:text-accent-300 transition-colors flex items-center gap-2"
                      >
                        (+39) 393 5026 350
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </li>
                    <li>
                      <p className="text-sm text-primary-200 mb-1">Telefono Fisso</p>
                      <a
                        href="tel:+390350632279"
                        className="text-xl font-bold hover:text-accent-300 transition-colors flex items-center gap-2"
                      >
                        (+39) 035 0632279
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Social Card */}
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-8 shadow-lg transition-all hover:shadow-xl">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-pink-500/20 via-transparent to-transparent" />
                <div className="relative text-white">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 shadow-lg">
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </div>
                    <h2 className="font-display text-2xl font-bold">
                      Seguici
                    </h2>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <a
                      href="https://www.facebook.com/SvetlaEsteticaDalmine"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-xl bg-white/10 backdrop-blur-sm p-4 transition-all hover:bg-white/20 hover:scale-[1.02]"
                    >
                      <svg className="h-8 w-8 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      <div>
                        <p className="font-semibold">Facebook</p>
                        <p className="text-xs text-gray-400">@SvetlaEsteticaDalmine</p>
                      </div>
                    </a>
                    <a
                      href="https://www.instagram.com/svetlaesteticadalmine/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-xl bg-white/10 backdrop-blur-sm p-4 transition-all hover:bg-white/20 hover:scale-[1.02]"
                    >
                      <svg className="h-8 w-8 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                      <div>
                        <p className="font-semibold">Instagram</p>
                        <p className="text-xs text-gray-400">@svetlaesteticadalmine</p>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Map & CTA */}
            <div className="space-y-8">
              {/* Map */}
              <div className="overflow-hidden rounded-2xl shadow-lg ring-1 ring-gray-100">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2790.123456789!2d9.601234567890!3d45.649876543210!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4781516f1d6e5b5b%3A0x1234567890abcdef!2sDalmine%2C%20BG%2C%20Italy!5e0!3m2!1sen!2sit!4v1234567890123"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Svetla Estetica - Posizione"
                  className="w-full"
                />
              </div>

              {/* Address Card */}
              <div className="rounded-2xl bg-gradient-to-br from-primary-50 to-fuchsia-50 p-8 shadow-lg ring-1 ring-primary-100">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600 text-white shadow-lg shadow-primary-200">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-gray-900">
                      Svetla Estetica Dalmine
                    </h3>
                    <p className="mt-2 text-gray-600">
                      Dalmine, Bergamo<br />
                      Italia
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 p-8 text-center text-white shadow-lg">
                <h3 className="font-display text-2xl font-bold">
                  Prenota il Tuo Appuntamento
                </h3>
                <p className="mt-2 text-primary-100">
                  Chiamaci o scrivici per prenotare il tuo prossimo trattamento
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="tel:+393935026350"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-primary-600 shadow-lg transition-all hover:bg-gray-50 hover:scale-[1.02]"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Chiama Ora
                  </a>
                  <Link
                    href="/trattamenti"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/20 backdrop-blur-sm px-6 py-3 font-semibold text-white transition-all hover:bg-white/30 hover:scale-[1.02]"
                  >
                    Vedi Trattamenti
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
