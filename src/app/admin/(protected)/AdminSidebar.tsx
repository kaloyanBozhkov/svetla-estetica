"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  DashboardIcon,
  PackageIcon,
  SparkleIcon,
  CartIcon,
  CalendarIcon,
  UsersIcon,
  LogOutIcon,
  ShoppingBagIcon,
} from "@/components/atoms/icons";

const adminNav = [
  { href: "/admin", label: "Dashboard", Icon: DashboardIcon },
  { href: "/admin/prodotti", label: "Prodotti", Icon: PackageIcon },
  { href: "/admin/servizi", label: "Servizi", Icon: SparkleIcon },
  { href: "/admin/ordini", label: "Ordini", Icon: CartIcon },
  { href: "/admin/carrelli", label: "Carrelli", Icon: ShoppingBagIcon },
  { href: "/admin/prenotazioni", label: "Prenotazioni", Icon: CalendarIcon },
  { href: "/admin/utenti", label: "Utenti", Icon: UsersIcon },
];

export function AdminSidebar() {
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <>
      {/* Mobile header */}
      <header className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-between bg-gray-900 px-4 py-3 lg:hidden">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo-cropped.webp"
            alt="Svetla Estetica"
            width={32}
            height={32}
          />
          <span className="font-display text-lg font-bold text-white">Admin</span>
        </Link>
        <button
          onClick={() => setOpen(!open)}
          className="p-2 text-white hover:bg-gray-800 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {open ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </header>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-[55] bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-[60] w-64 bg-gray-900 text-white transition-transform duration-300 lg:translate-x-0 lg:pt-16 flex flex-col",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 pt-16 lg:pt-6">
          <Link href="/" className="flex flex-col items-start gap-3 hover:opacity-80 transition-opacity">
            <Image
              src="/logo-cropped.webp"
              alt="Svetla Estetica"
              width={80}
              height={80}
            />
            <h2 className="font-display text-xl font-bold">Admin Panel</h2>
          </Link>
        </div>
        <nav className="mt-4 flex-1">
          {adminNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 px-6 py-3 transition-colors",
                isActive(item.href)
                  ? "bg-gray-800 text-white border-l-4 border-primary-500"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              )}
            >
              <item.Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout button */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-3 w-full px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
          >
            <LogOutIcon className="w-5 h-5" />
            <span>{loggingOut ? "Uscita..." : "Esci"}</span>
          </button>
        </div>
      </aside>
    </>
  );
}

