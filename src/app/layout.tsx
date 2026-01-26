import type { Metadata } from 'next';
import { Cormorant_Garamond, Lora } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Header, Footer } from '@/components/organisms';
import { BASE_URL } from '@/lib/constants';
import type { ReactNode } from 'react';
import { Analytics } from "@vercel/analytics/next"


const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Svetla Estetica | Il Tuo Centro Bellezza e Benessere a Dalmine',
    template: '%s | Svetla Estetica',
  },
  description: `La nostra professionalità e cura sapranno regalarti un momento speciale tutto per te. Viale Natale Betelli, 51, 24044 Dalmine (BG) | Tel.: 035 063 2279 | Aperti dal lunedì al sabato | Chiamaci per un appuntamento! 
Piedi,mani,pedicure,manicure,gel,semipermanente,stezzano,bergamo,provincia,low cost,offerta,ceretta,definitiva,luce pulsata,ultrasuono,dimagrimento,pachetto,uomo,donna,promozione,eosonic,euro,relax,massaggi,scrub,crema,viso,corpo,aperto,nuovo,scadenza,tonico,softringiovamento,silhouette,sculptor,trattamento ad impulsi,€,amico,amica,cliente,lombardia,basso,prezzo,benessere,milano,azzano san paolo,levate,curno,treviglio,mozzo,colognola,comun nuovo,zanica,lallio,centro,orio al serio,aeroporto,hotel,pizza,restorant,centro benessere,centro estetico,comune,belezza,groupon,sconto,%,centro,3935026350,0350779542,24040,pietro mascagni,trucco,tatuaggi,estetico,miofasciale,connettivale,hot stone massagge,articolare,scrub,corpo,fango,bendaggi,`,
  keywords: [
    'centro estetico dalmine',
    'estetica dalmine',
    'estetica bergamo',
    'trattamenti viso dalmine',
    'trattamenti corpo',
    'manicure dalmine',
    'pedicure',
    'ceretta',
    'luce pulsata bergamo',
    'solarium dalmine',
    'grotta di sale',
    'prodotti bellezza',
    'prodotti estetica',
    'accademia della bellezza',
    'rosa bulgara',
    'trattamenti luce pulsata dalmine',
    'Svetla',
    'Estetica',
    'Trattamenti',
    'Masaggi',
    'ceretta',
    'Piedi',
    'mani',
    'pedicure',
    'manicure',
    'gel',
    'semipermanente',
    'dalmine',
    'bergamo',
    'provincia',
    'low cost',
    'offerta',
    'ceretta',
    'definitiva',
    'luce',
    'pulsata',
    'ultrasuono',
    'dimagrimento',
    'pachetto',
    'uomo',
    'donna',
    'promozione',
    'eosonic',
    'euro',
    'relax',
    'massaggi',
    'scrub',
    'crema',
    'viso',
    'corpo',
    'aperto',
    'nuovo',
    'scadenza',
    'tonico',
    'softringiovamento',
    'silhouette',
    'sculptor',
    'trattamento ad impulsi',
    '€',
    'amico',
    'amica',
    'cliente',
    'lombardia',
    'basso',
    'prezzo',
    'benessere',
    'milano',
    'azzano san paolo',
    'levate',
    'curno',
    'treviglio',
    'mozzo',
    'colognola',
    'comun nuovo',
    'zanica',
    'lallio',
    'centro',
    'orio al serio',
    'aeroporto',
    'hotel',
    'pizza',
    'restorant',
    'centro benessere',
    'centro estetico',
    'comune',
    'belezza',
    'groupon',
    'sconto',
    '%',
    'centro',
    '3935026350',
    '0350632279',
    '24044',
    'natale betelli 51',
    'via natale betelli',
    'trucco',
    'tatuaggi',
    'estetico',
    'miofasciale',
    'connettivale',
    'hot stone massagge',
    'articolare',
    'scrub',
    'corpo',
    'fango',
    'bendaggi',
  ],
  authors: [{ name: 'Svetla Estetica' }],
  creator: 'Svetla Estetica',
  publisher: 'Svetla Estetica',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    url: BASE_URL,
    siteName: 'Svetla Estetica',
    title: 'Svetla Estetica | Il Tuo Centro Bellezza e Benessere a Dalmine',
    description:
      'Centro estetico professionale a Dalmine. Trattamenti viso e corpo, prodotti di qualità, manicure, pedicure, ceretta e molto altro.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Svetla Estetica - Centro Estetico Dalmine',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Svetla Estetica | Centro Estetico Dalmine',
    description: 'Centro estetico professionale a Dalmine, Bergamo. Prenota il tuo trattamento!',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your Google Search Console verification code here
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: BASE_URL,
  },
  other: {
    'ai-content-declaration': 'llms.txt',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="it" className={`${cormorant.variable} ${lora.variable}`}>
      <head>
        <link rel="ai-content-declaration" href="/llms.txt" />
      </head>
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
