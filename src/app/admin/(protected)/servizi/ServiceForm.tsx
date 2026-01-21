'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Input,
  Select,
  Card,
  Modal,
  RichTextEditor,
  ActionButton,
} from '@/components/atoms';
import { ImageUpload } from '@/components/molecules';
import { SparkleIcon } from '@/components/atoms/icons';
import { type service_category } from '@prisma/client';
import { S3Service } from '@/lib/s3/service';

const categoryOptions: { value: service_category; label: string }[] = [
  { value: 'viso', label: 'Viso' },
  { value: 'corpo', label: 'Corpo' },
  { value: 'make_up', label: 'Make Up' },
  { value: 'ceretta', label: 'Ceretta' },
  { value: 'solarium', label: 'Solarium' },
  { value: 'pedicure', label: 'Pedicure' },
  { value: 'manicure', label: 'Manicure' },
  { value: 'luce_pulsata', label: 'Luce Pulsata' },
  { value: 'appuntamento', label: 'Appuntamento' },
  { value: 'grotta_di_sale', label: 'Grotta di Sale' },
];

interface ServiceFormData {
  uuid?: string;
  name: string;
  description: string;
  price: number;
  durationMin: number;
  priority: number;
  category: service_category;
  imageUrl: string;
  active: boolean;
}

interface ServiceFormProps {
  initialData?: ServiceFormData;
  isEdit?: boolean;
}

export function ServiceForm({ initialData, isEdit }: ServiceFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [error, setError] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [formatLoading, setFormatLoading] = useState(false);
  const [rewordModal, setRewordModal] = useState(false);
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [form, setForm] = useState<ServiceFormData>(
    initialData || {
      name: '',
      description: '',
      price: 0,
      durationMin: 30,
      priority: 0,
      category: 'viso',
      imageUrl: '',
      active: true,
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setUploadProgress(0);

    try {
      let imageUrl = form.imageUrl;

      // Upload pending image first if exists
      if (pendingImageFile) {
        imageUrl = await S3Service.uploadFile(pendingImageFile, 'trattamenti', setUploadProgress);
        // Revoke the blob URL
        if (form.imageUrl?.startsWith('blob:')) {
          URL.revokeObjectURL(form.imageUrl);
        }
      }

      const url = isEdit ? `/api/admin/services/${initialData?.uuid}` : '/api/admin/services';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          description: form.description || null,
          price: Math.round(form.price * 100),
          duration_min: form.durationMin,
          priority: form.priority,
          category: form.category,
          image_url: imageUrl || null,
          active: form.active,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Errore');
      }

      router.push('/admin/servizi');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleAiReword = async () => {
    if (!form.name) {
      setError('Inserisci almeno il nome del trattamento');
      return;
    }

    setAiLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/services/reword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.name,
          description: form.description || '',
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Errore AI');
      }

      const data = await res.json();
      setForm({
        ...form,
        name: data.title,
        description: data.description,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore AI');
    } finally {
      setAiLoading(false);
    }
  };

  const handleAiFormat = async () => {
    if (!form.name) {
      setError('Inserisci almeno il nome del trattamento');
      return;
    }

    setFormatLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/services/format', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.name,
          description: form.description || '',
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Errore AI');
      }

      const data = await res.json();
      setForm({
        ...form,
        name: data.title,
        description: data.description,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore AI');
    } finally {
      setFormatLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/services/${initialData?.uuid}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Errore');
      }

      router.push('/admin/servizi');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore');
      setDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Nome"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <label className="block text-sm font-medium text-gray-700">Descrizione</label>
              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                <ActionButton
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setRewordModal(true)}
                  loading={aiLoading}
                  disabled={!form.name || formatLoading || aiLoading}
                >
                  <SparkleIcon className="w-4 h-4 mr-1" />
                  Riformula con AI
                </ActionButton>
                <ActionButton
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleAiFormat}
                  loading={formatLoading}
                  disabled={!form.name || aiLoading || formatLoading}
                >
                  <SparkleIcon className="w-4 h-4 mr-1" />
                  Formatta con AI
                </ActionButton>
              </div>
            </div>
            <RichTextEditor
              value={form.description}
              onChange={(value) => setForm({ ...form, description: value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Prezzo (€)"
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
              required
            />

            <Input
              label="Durata (minuti)"
              type="number"
              min="5"
              step="5"
              value={form.durationMin}
              onChange={(e) => setForm({ ...form, durationMin: parseInt(e.target.value) || 30 })}
              required
            />

            <Input
              label="Priorità"
              type="number"
              min="0"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: parseInt(e.target.value) || 0 })}
            />
          </div>

          <Select
            label="Categoria"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value as service_category })}
            options={categoryOptions}
          />

          <ImageUpload
            label="Immagine Trattamento"
            value={form.imageUrl || undefined}
            onChange={(url) => setForm({ ...form, imageUrl: url || '' })}
            imageType="trattamenti"
            deferUpload
            onPendingFileChange={setPendingImageFile}
          />

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div>
              <p className="font-medium text-gray-900">Stato servizio</p>
              <p className="text-sm text-gray-500">
                {form.active ? 'Visibile nel catalogo' : 'Nascosto dal catalogo'}
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={form.active}
              onClick={() => setForm({ ...form, active: !form.active })}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                form.active ? 'bg-primary-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  form.active ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4 pt-4">
            <div>
              {isEdit && (
                <Button
                  type="button"
                  variant="danger"
                  onClick={() => setDeleteModal(true)}
                  className="w-full sm:w-auto"
                >
                  Elimina
                </Button>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.back()}
                className="w-full sm:w-auto"
              >
                Annulla
              </Button>
              <Button type="submit" loading={loading} className="w-full sm:w-auto">
                {loading && uploadProgress > 0 && uploadProgress < 100
                  ? `Caricamento... ${uploadProgress}%`
                  : isEdit
                    ? 'Salva'
                    : 'Crea'}
              </Button>
            </div>
          </div>
        </form>
      </Card>

      <Modal open={deleteModal} onClose={() => setDeleteModal(false)}>
        <h3 className="font-display text-xl font-bold text-gray-900 mb-2">Conferma eliminazione</h3>
        <p className="text-gray-600 mb-6">
          Sei sicuro di voler eliminare &quot;{form.name}&quot;? Questa azione non può essere
          annullata.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setDeleteModal(false)}>
            Annulla
          </Button>
          <Button variant="danger" onClick={handleDelete} loading={deleting}>
            Elimina
          </Button>
        </div>
      </Modal>

      <Modal open={rewordModal} onClose={() => setRewordModal(false)}>
        <h3 className="font-display text-xl font-bold text-gray-900 mb-2">Riformula con AI</h3>
        <p className="text-gray-600 mb-6">
          Attenzione: il testo potrebbe essere modificato e arricchito dall&apos;intelligenza
          artificiale. Verifica attentamente il risultato prima di salvare.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setRewordModal(false)}>
            Annulla
          </Button>
          <Button
            onClick={() => {
              setRewordModal(false);
              handleAiReword();
            }}
          >
            Procedi
          </Button>
        </div>
      </Modal>
    </>
  );
}
