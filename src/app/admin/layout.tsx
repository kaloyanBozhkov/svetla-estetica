import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import Link from "next/link";

const adminNav = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/prodotti", label: "Prodotti", icon: "📦" },
  { href: "/admin/servizi", label: "Servizi", icon: "✨" },
  { href: "/admin/ordini", label: "Ordini", icon: "🛒" },
  { href: "/admin/prenotazioni", label: "Prenotazioni", icon: "📅" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await isAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <aside className="fixed inset-y-0 left-0 w-64 bg-gray-900 text-white pt-16">
          <div className="p-6">
            <h2 className="font-display text-xl font-bold">Admin Panel</h2>
          </div>
          <nav className="mt-4">
            {adminNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        <main className="ml-64 flex-1 p-8 pt-24">{children}</main>
      </div>
    </div>
  );
}

