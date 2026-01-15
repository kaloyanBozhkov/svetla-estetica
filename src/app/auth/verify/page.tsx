"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, Spinner } from "@/components/atoms";
import { Suspense } from "react";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Link non valido");
      return;
    }

    async function verify() {
      try {
        const res = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error);
        }

        setStatus("success");
        setMessage("Accesso effettuato! Reindirizzamento...");

        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 1500);
      } catch (err) {
        setStatus("error");
        setMessage(err instanceof Error ? err.message : "Errore di verifica");
      }
    }

    verify();
  }, [token, router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <Card className="max-w-md w-full text-center">
        {status === "loading" && (
          <>
            <Spinner size="lg" className="mx-auto" />
            <p className="mt-4 text-gray-600">Verifica in corso...</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="text-5xl mb-4">✅</div>
            <h1 className="font-display text-2xl font-bold text-green-600">
              Accesso Effettuato!
            </h1>
            <p className="mt-2 text-gray-600">{message}</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="text-5xl mb-4">❌</div>
            <h1 className="font-display text-2xl font-bold text-red-600">
              Errore
            </h1>
            <p className="mt-2 text-gray-600">{message}</p>
            <a
              href="/accedi"
              className="mt-4 inline-block text-primary-600 hover:underline"
            >
              Torna al login
            </a>
          </>
        )}
      </Card>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}

