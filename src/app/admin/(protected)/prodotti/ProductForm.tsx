"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Input,
  Select,
  Card,
  Modal,
  RichTextEditor,
  ActionButton,
} from "@/components/atoms";
import { ImageUpload } from "@/components/molecules";
import { SparkleIcon } from "@/components/atoms/icons";
import { type product_category } from "@prisma/client";

const categoryOptions: { value: product_category; label: string }[] = [
  { value: "viso", label: "Viso" },
  { value: "corpo", label: "Corpo" },
  { value: "solari", label: "Solari" },
  { value: "tisane", label: "Tisane" },
  { value: "make_up", label: "Make Up" },
  { value: "profumi", label: "Profumi" },
  { value: "mani_e_piedi", label: "Mani e Piedi" },
];

interface Brand {
  id: number;
  uuid: string;
  name: string;
}

interface ProductFormData {
  uuid?: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  priority: number;
  category: product_category;
  brandId: number;
  imageUrl: string;
  active: boolean;
}

interface ProductFormProps {
  initialData?: ProductFormData;
  brands: Brand[];
  isEdit?: boolean;
}

export function ProductForm({ initialData, brands, isEdit }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [error, setError] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const [form, setForm] = useState<ProductFormData>(
    initialData || {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      priority: 0,
      category: "viso",
      brandId: brands[0]?.id || 0,
      imageUrl: "",
      active: true,
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const url = isEdit
        ? `/api/admin/products/${initialData?.uuid}`
        : "/api/admin/products";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description || null,
          price: Math.round(form.price * 100),
          stock: form.stock,
          priority: form.priority,
          category: form.category,
          brand_id: form.brandId,
          image_url: form.imageUrl || null,
          active: form.active,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Errore");
      }

      router.push("/admin/prodotti");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${initialData?.uuid}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Errore");
      }

      router.push("/admin/prodotti");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore");
      setDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  const handleAiReword = async () => {
    if (!form.name) {
      setError("Inserisci almeno il nome del prodotto");
      return;
    }

    const currentBrand = brands.find((b) => b.id === form.brandId);
    if (!currentBrand) {
      setError("Seleziona un brand");
      return;
    }

    setAiLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/products/reword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.name,
          brand: currentBrand.name,
          description: form.description || "",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Errore AI");
      }

      const data = await res.json();
      setForm({
        ...form,
        name: data.title,
        description: data.description,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore AI");
    } finally {
      setAiLoading(false);
    }
  };

  const brandOptions = brands.map((b) => ({
    value: String(b.id),
    label: b.name,
  }));

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
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Descrizione
              </label>
              <ActionButton
                type="button"
                size="sm"
                variant="outline"
                onClick={handleAiReword}
                loading={aiLoading}
                disabled={!form.name}
              >
                <SparkleIcon className="w-4 h-4 mr-1" />
                Riformula con AI
              </ActionButton>
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
              onChange={(e) =>
                setForm({ ...form, price: parseFloat(e.target.value) || 0 })
              }
              required
            />

            <Input
              label="Stock"
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) =>
                setForm({ ...form, stock: parseInt(e.target.value) || 0 })
              }
              required
            />

            <Input
              label="Priorità"
              type="number"
              min="0"
              value={form.priority}
              onChange={(e) =>
                setForm({ ...form, priority: parseInt(e.target.value) || 0 })
              }
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Categoria"
              value={form.category}
              onChange={(e) =>
                setForm({
                  ...form,
                  category: e.target.value as product_category,
                })
              }
              options={categoryOptions}
            />

            <Select
              label="Brand"
              value={String(form.brandId)}
              onChange={(e) =>
                setForm({ ...form, brandId: parseInt(e.target.value) })
              }
              options={brandOptions}
            />
          </div>

          <ImageUpload
            label="Immagine Prodotto"
            value={form.imageUrl || undefined}
            onChange={(url) => setForm({ ...form, imageUrl: url || "" })}
            imageType="prodotti"
          />

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div>
              <p className="font-medium text-gray-900">Stato prodotto</p>
              <p className="text-sm text-gray-500">
                {form.active
                  ? "Visibile nel catalogo"
                  : "Nascosto dal catalogo"}
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={form.active}
              onClick={() => setForm({ ...form, active: !form.active })}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                form.active ? "bg-primary-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  form.active ? "translate-x-5" : "translate-x-0"
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
              <Button
                type="submit"
                loading={loading}
                className="w-full sm:w-auto"
              >
                {isEdit ? "Salva" : "Crea"}
              </Button>
            </div>
          </div>
        </form>
      </Card>

      <Modal open={deleteModal} onClose={() => setDeleteModal(false)}>
        <h3 className="font-display text-xl font-bold text-gray-900 mb-2">
          Conferma eliminazione
        </h3>
        <p className="text-gray-600 mb-6">
          Sei sicuro di voler eliminare &quot;{form.name}&quot;? Questa azione
          non può essere annullata.
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
    </>
  );
}
