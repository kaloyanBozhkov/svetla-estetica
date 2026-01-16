"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuthStore, useCartStore } from "@/stores";
import { Button } from "@/components/atoms";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/prodotti", label: "Prodotti" },
  { href: "/trattamenti", label: "Trattamenti" },
  { href: "/chi-siamo", label: "Chi Siamo" },
  { href: "/contatti", label: "Contatti" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, isAdmin } = useAuthStore();
  const itemCount = useCartStore((s) => s.getItemCount());
  const pathname = usePathname();

  // Hide header on admin pages (they have their own header)
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="group flex items-center gap-2">
            <Image
              src="/logo-cropped.webp"
              alt="Svetla Estetica"
              width={60}
              height={60}
              className="size-11 transition-transform duration-300 group-hover:scale-[0.98]"
            />
            <span className="font-display text-xl sm:text-2xl font-bold text-primary-600 transition-colors group-hover:text-primary-700">
              Svetla Estetica
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {isAuthenticated() && (
              <Link href="/carrello" className="relative p-2">
                <svg
                  className="h-6 w-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary-600 text-xs text-white flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
            )}

            {isAuthenticated() ? (
              <div className="hidden md:flex items-center gap-4">
                {isAdmin() && (
                  <Link href="/admin">
                    <Button variant="ghost" size="sm">
                      Admin
                    </Button>
                  </Link>
                )}
                <Link href="/account">
                  <Button variant="outline" size="sm">
                    {user?.name || "Account"}
                  </Button>
                </Link>
              </div>
            ) : (
              <Link href="/accedi" className="hidden md:block">
                <Button size="sm">Accedi</Button>
              </Link>
            )}

            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                className="h-6 w-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300",
            isMenuOpen ? "max-h-96 pb-4" : "max-h-0"
          )}
        >
          <nav className="flex flex-col gap-2 pt-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated() ? (
              <>
                {isAdmin() && (
                  <Link
                    href="/admin"
                    className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                <Link
                  href="/account"
                  className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Account
                </Link>
              </>
            ) : (
              <Link
                href="/accedi"
                className="px-4 py-2 text-primary-600 font-medium hover:bg-primary-50 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Accedi
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

