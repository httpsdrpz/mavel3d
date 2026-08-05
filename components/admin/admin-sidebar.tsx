"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Store } from "lucide-react";

import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin#produtos", label: "Produtos", icon: Package },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-border bg-white max-lg:hidden">
      <div className="flex h-16 items-center gap-2 px-6">
        <span className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet-700 text-sm font-bold text-white">
          M
        </span>
        <span className="text-lg font-semibold tracking-tight">Marvel</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-4 py-4">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href.split("#")[0].split("?")[0];
          return (
            <Link
              key={link.label}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-foreground/70 hover:bg-secondary hover:text-foreground"
              )}
            >
              <Icon className="size-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Store className="size-4" />
          Voltar à loja
        </Link>
      </div>
    </aside>
  );
}
