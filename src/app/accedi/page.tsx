"use client";

import { useState } from "react";
import Image from "next/image";
import { Button, Input, Card } from "@/components/atoms";
import { z } from "zod";

const emailSchema = z.object({
  email: z.string().email("Email non valida"),
});

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      emailSchema.parse({ email });

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Errore");
      }

      setSent(true);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <Card className="max-w-md w-full text-center">
          <Image
            src="/logo-cropped.webp"
            alt="Svetla Estetica"
            width={80}
            height={80}
            className="mx-auto mb-4"
          />
          <h1 className="font-display text-2xl font-bold text-gray-900">
            Controlla la tua email!
          </h1>
          <p className="mt-4 text-gray-600">
            Ti abbiamo inviato un link di accesso a <strong>{email}</strong>.
            <br />
            <br />
            Controlla la tua casella di posta.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <Card className="max-w-md w-full">
        <div className="text-center mb-8">
          <Image
            src="/logo-cropped.webp"
            alt="Svetla Estetica"
            width={80}
            height={80}
            className="mx-auto mb-4"
          />
          <h1 className="font-display text-3xl font-bold text-gray-900">
            Accedi
          </h1>
          <p className="mt-2 text-gray-600">
            Inserisci la tua email per ricevere un link di accesso
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="email"
            label="Email"
            placeholder="la-tua@email.it"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
            required
          />

          <Button type="submit" className="w-full" loading={loading}>
            Invia Link di Accesso
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">
            Sei l&apos;admin?{" "}
            <a href="/admin/login" className="text-primary-600 hover:underline">
              Accedi qui
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
}
