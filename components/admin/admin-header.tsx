"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, PanelLeftClose, PanelLeftOpen, Store } from "lucide-react";

import { useSettings } from "@/context/settings-context";
import { useAdminSidebar } from "@/components/admin/admin-sidebar-context";
import { ADMIN_NAV_LINKS, isAdminLinkActive } from "@/components/admin/admin-nav-links";
import { logoutAction } from "@/app/admin/login/actions";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

function currentTitle(pathname: string | null) {
  const match = [...ADMIN_NAV_LINKS].reverse().find((link) => isAdminLinkActive(pathname, link.href));
  return match?.label ?? "Dashboard";
}

export function AdminHeader() {
  const pathname = usePathname();
  const { settings } = useSettings();
  const { collapsed, toggle } = useAdminSidebar();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <header className="flex h-16 items-center gap-3 border-b border-border bg-white px-4 sm:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="hidden lg:inline-flex"
        onClick={toggle}
        aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
      >
        {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={() => setMobileOpen(true)}
        aria-label="Abrir menu"
      >
        <Menu className="size-4" />
      </Button>

      <h1 className="text-lg font-semibold tracking-tight text-foreground">
        {currentTitle(pathname)}
      </h1>

      <form action={logoutAction} className="ml-auto">
        <Button type="submit" variant="ghost" size="icon" aria-label="Sair">
          <LogOut className="size-4" />
        </Button>
      </form>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet-700 text-sm font-bold text-white">
                {settings.storeName.charAt(0).toUpperCase()}
              </span>
              {settings.storeName} Admin
            </SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-1 px-6">
            {ADMIN_NAV_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-foreground/70 hover:bg-secondary hover:text-foreground"
                >
                  <Icon className="size-4" />
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-foreground/70 hover:bg-secondary hover:text-foreground"
            >
              <Store className="size-4" />
              Voltar à loja
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
