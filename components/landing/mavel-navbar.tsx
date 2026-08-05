"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, ShoppingBag, X } from "lucide-react";

import { useCart } from "@/context/cart-context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "@/components/cart-drawer";

const NAV_LINKS = [
  { href: "/produtos", label: "Produtos" },
  { href: "#personalizados", label: "Personalizados" },
  { href: "#sobre", label: "Sobre" },
  { href: "#contato", label: "Contato" },
];

export function MavelNavbar() {
  const { count } = useCart();
  const [scrolled, setScrolled] = React.useState(false);
  const [cartOpen, setCartOpen] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full border-b transition-all duration-300",
        scrolled
          ? "border-white/10 bg-zinc-950/70 backdrop-blur-xl saturate-150"
          : "border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2 font-semibold">
          <span className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-purple-500 text-sm font-bold text-white shadow-md shadow-violet-600/30">
            M
          </span>
          <span className="text-lg font-semibold tracking-tight text-white">MAVEL</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative text-zinc-300 hover:bg-white/5 hover:text-white"
            onClick={() => setCartOpen(true)}
            aria-label="Abrir carrinho"
          >
            <ShoppingBag />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex size-4.5 items-center justify-center rounded-full bg-violet-600 text-[10px] font-semibold text-white">
                {count > 9 ? "9+" : count}
              </span>
            )}
          </Button>

          <Button
            asChild
            className="hidden bg-gradient-to-br from-violet-600 to-purple-500 text-white shadow-lg shadow-violet-600/30 hover:shadow-xl hover:shadow-violet-600/40 sm:inline-flex"
          >
            <Link href="/produtos">Comprar Agora</Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-zinc-300 hover:bg-white/5 hover:text-white md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Abrir menu"
          >
            {mobileOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="flex flex-col gap-1 border-t border-white/10 bg-zinc-950/95 p-4 backdrop-blur-xl md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="rounded-xl px-3.5 py-2.5 text-sm font-medium text-zinc-300 hover:bg-white/5 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          <Button
            asChild
            className="mt-2 w-full bg-gradient-to-br from-violet-600 to-purple-500 text-white"
          >
            <Link href="/produtos" onClick={() => setMobileOpen(false)}>
              Comprar Agora
            </Link>
          </Button>
        </nav>
      )}

      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </header>
  );
}
