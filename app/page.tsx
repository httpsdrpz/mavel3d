"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Headphones,
  Laptop,
  Smartphone,
  ShieldCheck,
  Truck,
  Watch,
  Monitor,
  Cable,
} from "lucide-react";

import { useProducts } from "@/context/products-context";
import { categories } from "@/lib/products";
import { Hero } from "@/components/hero";
import { ProductGrid } from "@/components/product-grid";
import { Button } from "@/components/ui/button";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Fones: Headphones,
  Notebooks: Laptop,
  Smartphones: Smartphone,
  Acessórios: Cable,
  Wearables: Watch,
  Monitores: Monitor,
};

const PERKS = [
  {
    icon: Truck,
    title: "Frete rápido",
    description: "Entrega expressa para todo o Brasil.",
  },
  {
    icon: ShieldCheck,
    title: "Garantia estendida",
    description: "Até 24 meses de garantia em todos os produtos.",
  },
  {
    icon: ArrowRight,
    title: "Troca facilitada",
    description: "30 dias para trocas e devoluções sem burocracia.",
  },
];

export default function Home() {
  const { products } = useProducts();
  const featured = products.filter((p) => p.featured).slice(0, 8);

  return (
    <div className="flex flex-1 flex-col">
      <Hero />

      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {PERKS.map((perk) => (
            <div
              key={perk.title}
              className="flex items-center gap-4 rounded-2xl border border-border bg-white p-5"
            >
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <perk.icon className="size-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{perk.title}</p>
                <p className="text-xs text-muted-foreground">{perk.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Produtos em destaque
            </h2>
            <p className="mt-2 text-muted-foreground">
              Selecionados a dedo para uma experiência premium.
            </p>
          </div>
          <Button variant="ghost" asChild className="hidden sm:inline-flex">
            <Link href="/produtos">
              Ver tudo <ArrowRight />
            </Link>
          </Button>
        </div>

        <ProductGrid products={featured} />

        <div className="mt-8 flex justify-center sm:hidden">
          <Button variant="outline" asChild>
            <Link href="/produtos">
              Ver todos os produtos <ArrowRight />
            </Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Explore por categoria
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((category, i) => {
            const Icon = CATEGORY_ICONS[category] ?? Cable;
            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Link
                  href={`/produtos?categoria=${encodeURIComponent(category)}`}
                  className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-white p-6 text-center transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10"
                >
                  <div className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground transition-colors group-hover:bg-primary group-hover:text-white">
                    <Icon className="size-5" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{category}</span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-700 via-primary to-fuchsia-700 px-8 py-16 text-center sm:px-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.15),transparent_50%)]" />
          <div className="relative flex flex-col items-center gap-5">
            <h2 className="max-w-xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Tecnologia premium, direto para você.
            </h2>
            <p className="max-w-md text-white/70">
              Aproveite condições exclusivas na nova coleção Marvel.
            </p>
            <Button variant="secondary" size="lg" asChild className="mt-2 bg-white text-primary hover:bg-white/90">
              <Link href="/produtos">Explorar Produtos</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
