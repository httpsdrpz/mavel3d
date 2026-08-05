"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { toast } from "sonner";

import { useCart } from "@/context/cart-context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/search-bar";
import { CartDrawer } from "@/components/cart-drawer";

const NAV_LINKS = [
  { href: "/", label: "Início" },
  { href: "/produtos", label: "Produtos" },
];

export function Navbar() {
  const { count } = useCart();
  const [scrolled, setScrolled] = React.useState(false);
  const [cartOpen, setCartOpen] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = React.useState(false);

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
        "sticky top-0 z-40 w-full border-b transition-all duration-300",
        scrolled
          ? "glass border-border shadow-sm"
          : "border-transparent bg-white/0"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2 font-semibold">
          <span className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet-700 text-sm font-bold text-white shadow-md shadow-primary/30">
            M
          </span>
          <span className="text-lg tracking-tight text-foreground">Marvel</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden max-w-sm flex-1 md:block">
          <SearchBar />
        </div>

        <div className="ml-auto flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileSearchOpen((v) => !v)}
            aria-label="Buscar"
          >
            {mobileSearchOpen ? <X /> : <Search />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:inline-flex"
            aria-label="Entrar"
            onClick={() => toast("Login em breve", { description: "Essa área ainda está em construção." })}
          >
            <User />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => setCartOpen(true)}
            aria-label="Abrir carrinho"
          >
            <ShoppingBag />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex size-4.5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-white">
                {count > 9 ? "9+" : count}
              </span>
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Abrir menu"
          >
            {mobileOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {mobileSearchOpen && (
        <div className="border-t border-border bg-white p-4 md:hidden">
          <SearchBar autoFocus />
        </div>
      )}

      {mobileOpen && (
        <nav className="flex flex-col gap-1 border-t border-border bg-white p-4 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="rounded-xl px-3.5 py-2.5 text-sm font-medium text-foreground/80 hover:bg-secondary hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => {
              setMobileOpen(false);
              toast("Login em breve", { description: "Essa área ainda está em construção." });
            }}
            className="rounded-xl px-3.5 py-2.5 text-left text-sm font-medium text-foreground/80 hover:bg-secondary hover:text-foreground"
          >
            Login
          </button>
        </nav>
      )}

      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </header>
  );
}
