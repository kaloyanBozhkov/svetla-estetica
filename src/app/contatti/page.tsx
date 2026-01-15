import { Card } from "@/components/atoms";

const businessHours = [
  { day: "Lunedì", hours: "09.00 - 20.00" },
  { day: "Martedì", hours: "09.00 - 20.00" },
  { day: "Mercoledì", hours: "09.00 - 20.00" },
  { day: "Giovedì", hours: "09.00 - 20.00" },
  { day: "Venerdì", hours: "09.00 - 20.00" },
  { day: "Sabato", hours: "09.00 - 18.00" },
];

export default function ContactPage() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold text-gray-900">
            Contatti
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Siamo qui per te. Contattaci o vieni a trovarci!
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <Card>
              <h2 className="font-display text-xl font-bold text-gray-900 mb-4">
                Orario Lavorativo
              </h2>
              <ul className="space-y-3">
                {businessHours.map((item) => (
                  <li key={item.day} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                    <span className="font-medium text-gray-900">{item.day}</span>
                    <span className="text-gray-600">{item.hours}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card>
              <h2 className="font-display text-xl font-bold text-gray-900 mb-4">
                Contatti
              </h2>
              <ul className="space-y-4">
                <li>
                  <p className="text-sm text-gray-500 mb-1">Cellulare</p>
                  <a
                    href="tel:+393935026350"
                    className="text-lg font-medium text-primary-600 hover:text-primary-700"
                  >
                    (+39) 393 5026 350
                  </a>
                </li>
                <li>
                  <p className="text-sm text-gray-500 mb-1">Fisso</p>
                  <a
                    href="tel:+390350632279"
                    className="text-lg font-medium text-primary-600 hover:text-primary-700"
                  >
                    (+39) 035 0632279
                  </a>
                </li>
              </ul>
            </Card>

            <Card>
              <h2 className="font-display text-xl font-bold text-gray-900 mb-4">
                Social
              </h2>
              <ul className="space-y-4">
                <li>
                  <a
                    href="https://www.facebook.com/SvetlaEsteticaDalmine"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span>Facebook</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/svetlaesteticadalmine/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    <span>Instagram</span>
                  </a>
                </li>
              </ul>
            </Card>
          </div>

          <div>
            <Card className="h-full min-h-[400px] overflow-hidden p-0">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2780.0!2d9.6!3d45.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDXCsDM2JzAwLjAiTiA5wrAzNicwMC4wIkU!5e0!3m2!1sit!2sit!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "400px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Svetla Estetica - Posizione"
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

