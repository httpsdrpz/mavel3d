"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Store } from "lucide-react";

import { cn } from "@/lib/utils";
import { useSettings } from "@/context/settings-context";
import { useAdminSidebar } from "@/components/admin/admin-sidebar-context";
import { ADMIN_NAV_LINKS, isAdminLinkActive } from "@/components/admin/admin-nav-links";

export function AdminSidebar() {
  const pathname = usePathname();
  const { settings } = useSettings();
  const { collapsed } = useAdminSidebar();

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-screen shrink-0 flex-col border-r border-border bg-white transition-[width] duration-200 max-lg:hidden",
        collapsed ? "w-[76px]" : "w-64"
      )}
    >
      <div className="flex h-16 items-center gap-2 px-6">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet-700 text-sm font-bold text-white">
          {settings.storeName.charAt(0).toUpperCase()}
        </span>
        {!collapsed && (
          <span className="truncate text-lg font-semibold tracking-tight">{settings.storeName}</span>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        {ADMIN_NAV_LINKS.map((link) => {
          const Icon = link.icon;
          const active = isAdminLinkActive(pathname, link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              title={collapsed ? link.label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                collapsed && "justify-center px-0",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-foreground/70 hover:bg-secondary hover:text-foreground"
              )}
            >
              <Icon className="size-4 shrink-0" />
              {!collapsed && link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3">
        <Link
          href="/"
          title={collapsed ? "Voltar à loja" : undefined}
          className={cn(
            "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground",
            collapsed && "justify-center px-0"
          )}
        >
          <Store className="size-4 shrink-0" />
          {!collapsed && "Voltar à loja"}
        </Link>
      </div>
    </aside>
  );
}
