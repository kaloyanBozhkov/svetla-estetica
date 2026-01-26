import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Politica di Reso',
  description: 'Informazioni sulla politica di reso di Svetla Estetica.',
  alternates: {
    canonical: '/return-policy',
  },
};

export default function ReturnPolicyPage() {
  return (
    <div className="py-12 min-h-screen bg-gradient-to-b from-white via-gray-50/30 to-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 p-8 sm:p-12">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
            Politica di Reso
          </h1>

          <div className="prose prose-gray max-w-none">
            <div className="bg-primary-50 border-l-4 border-primary-600 p-6 rounded-r-lg mb-8">
              <p className="text-lg font-semibold text-primary-900 mb-2">
                Nessuna Politica di Reso
              </p>
              <p className="text-primary-800">
                Svetla Estetica non accetta resi di prodotti acquistati.
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Prodotti Cosmetici e Igiene
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Per motivi di igiene e sicurezza, tutti i prodotti cosmetici e di bellezza venduti
                sono considerati articoli finali e non possono essere restituiti o scambiati una
                volta che l&apos;ordine è stato consegnato.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Servizi e Trattamenti</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                I servizi e trattamenti estetici prenotati sono soggetti alle nostre condizioni di
                prenotazione. Per cancellazioni o modifiche degli appuntamenti, si prega di
                contattarci con un preavviso adeguato.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Prodotti Difettosi</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Nel caso raro in cui un prodotto risulti difettoso o danneggiato al momento della
                consegna, si prega di contattarci immediatamente al momento della ricezione. Ogni
                caso sarà valutato individualmente.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Per segnalare un problema con un prodotto, contattarci entro 48 ore dalla
                consegna fornendo:
              </p>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed mt-2 space-y-1">
                <li>Numero d&apos;ordine</li>
                <li>Descrizione dettagliata del problema</li>
                <li>Foto del prodotto e della confezione</li>
              </ul>
            </section>

            <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contatti</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Per qualsiasi domanda riguardante gli ordini o i prodotti, non esitate a
                contattarci:
              </p>
              <div className="space-y-2">
                <p className="text-gray-900">
                  <strong>Email:</strong>{' '}
                  <a
                    href="mailto:rosacosmetica@gmail.com"
                    className="text-primary-600 hover:text-primary-700 hover:underline"
                  >
                    rosacosmetica@gmail.com
                  </a>
                </p>
                <p className="text-gray-900">
                  <strong>Telefono:</strong>{' '}
                  <a
                    href="tel:+393935026350"
                    className="text-primary-600 hover:text-primary-700 hover:underline"
                  >
                    +39 393 502 6350
                  </a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

