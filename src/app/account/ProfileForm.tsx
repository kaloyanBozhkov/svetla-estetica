"use client";

import { useState } from "react";
import { Input } from "@/components/atoms";
import { ActionButton } from "@/components/atoms/ActionButton";

interface ProfileFormProps {
  initialPhone: string | null;
  initialName: string | null;
}

export function ProfileForm({ initialPhone, initialName }: ProfileFormProps) {
  const [phone, setPhone] = useState(initialPhone ?? "");
  const [name, setName] = useState(initialName ?? "");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phone || null,
          name: name || null,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update");
      }

      setMessage({ type: "success", text: "Profilo aggiornato!" });
    } catch {
      setMessage({ type: "error", text: "Errore durante l'aggiornamento" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-gray-500 mb-1">Nome</label>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Il tuo nome"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-500 mb-1">Telefono</label>
        <Input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+39 123 456 7890"
        />
      </div>
      {message && (
        <p
          className={`text-sm ${
            message.type === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {message.text}
        </p>
      )}
      <ActionButton type="submit" isLoading={isLoading} size="sm">
        Salva
      </ActionButton>
    </form>
  );
}

