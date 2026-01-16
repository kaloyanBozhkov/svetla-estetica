"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button, Input, Card } from "@/components/atoms";
import { z } from "zod";

const adminSchema = z.object({
  email: z.string().email("Email non valida"),
  password: z.string().min(1, "Password richiesta"),
});

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      adminSchema.parse({ email, password });

      const res = await fetch("/api/auth/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Errore");
      }

      router.push("/admin");
      router.refresh();
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
            Accesso Admin
          </h1>
          <p className="mt-2 text-gray-600">
            Inserisci le credenziali di amministratore
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="email"
            label="Email"
            placeholder="admin@svetla-estetica.it"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            type="password"
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={error}
            required
          />

          <Button type="submit" className="w-full" loading={loading}>
            Accedi
          </Button>
        </form>
      </Card>
    </div>
  );
}

