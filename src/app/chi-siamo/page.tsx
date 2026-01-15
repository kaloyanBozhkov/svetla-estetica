export default function AboutPage() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold text-gray-900">
            Chi Siamo
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            La tua destinazione di bellezza a Dalmine
          </p>
        </div>

        <div className="prose prose-lg mx-auto">
          <p>
            <strong>Svetla Estetica</strong> è un centro estetico professionale
            situato nel cuore di Dalmine, in provincia di Bergamo. Da anni ci
            dedichiamo con passione alla cura e al benessere delle nostre clienti,
            offrendo trattamenti di alta qualità in un ambiente accogliente e
            rilassante.
          </p>

          <h2 className="font-display">La Nostra Filosofia</h2>
          <p>
            Crediamo che ogni persona meriti di sentirsi bella e sicura di sé.
            Per questo motivo, offriamo trattamenti personalizzati che rispondono
            alle esigenze specifiche di ogni cliente, utilizzando prodotti di
            alta qualità e tecniche all&apos;avanguardia.
          </p>

          <h2 className="font-display">I Nostri Servizi</h2>
          <ul>
            <li>Trattamenti viso e corpo</li>
            <li>Manicure e pedicure professionali</li>
            <li>Ceretta e epilazione</li>
            <li>Luce pulsata</li>
            <li>Solarium</li>
            <li>Make up professionale</li>
            <li>Grotta di sale</li>
          </ul>

          <h2 className="font-display">I Nostri Prodotti</h2>
          <p>
            Oltre ai trattamenti, offriamo una selezione curata di prodotti per
            la cura della pelle e del corpo. Potrai trovare creme, solari, tisane,
            profumi e molto altro, tutti selezionati per garantire la massima
            qualità.
          </p>

          <div className="not-prose mt-12 p-8 bg-primary-50 rounded-2xl">
            <h3 className="font-display text-2xl font-bold text-gray-900 mb-4">
              Vieni a Trovarci
            </h3>
            <p className="text-gray-600 mb-4">
              Ti aspettiamo nel nostro centro per un&apos;esperienza di benessere
              unica.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="tel:+393935026350"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-white font-medium hover:bg-primary-700 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Chiamaci
              </a>
              <a
                href="/contatti"
                className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-primary-600 px-6 py-3 text-primary-600 font-medium hover:bg-primary-50 transition-colors"
              >
                Contatti
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

