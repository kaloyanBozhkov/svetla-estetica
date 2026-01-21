import { ServiceForm } from '../ServiceForm';
import Link from 'next/link';

export default function NewServicePage() {
  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/servizi" className="text-sm text-gray-500 hover:text-gray-700">
          ← Torna ai servizi
        </Link>
        <h1 className="font-display text-3xl font-bold text-gray-900 mt-2">Nuovo Servizio</h1>
      </div>

      <ServiceForm />
    </div>
  );
}
