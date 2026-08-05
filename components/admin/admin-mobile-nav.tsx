"use client";

import * as React from "react";
import Link from "next/link";
import { LayoutDashboard, Menu, Package, Store } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export function AdminMobileNav() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex h-16 items-center justify-between border-b border-border bg-white px-4 lg:hidden">
      <Link href="/admin" className="flex items-center gap-2 font-semibold">
        <span className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet-700 text-sm font-bold text-white">
          M
        </span>
        <span className="text-lg tracking-tight">Marvel Admin</span>
      </Link>
      <Button variant="ghost" size="icon" onClick={() => setOpen(true)} aria-label="Abrir menu">
        <Menu />
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Marvel Admin</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-1 px-6">
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-foreground/70 hover:bg-secondary hover:text-foreground"
            >
              <LayoutDashboard className="size-4" />
              Dashboard
            </Link>
            <Link
              href="/admin#produtos"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-foreground/70 hover:bg-secondary hover:text-foreground"
            >
              <Package className="size-4" />
              Produtos
            </Link>
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-foreground/70 hover:bg-secondary hover:text-foreground"
            >
              <Store className="size-4" />
              Voltar à loja
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
