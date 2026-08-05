import Link from "next/link";
import { ArrowRight, PackageSearch } from "lucide-react";

import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { MavelProductCard } from "@/components/landing/mavel-product-card";

export function MavelFeaturedProducts({ products: featured }: { products: Product[] }) {
  return (
    <section className="bg-zinc-950 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col items-center gap-4 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Produtos em Destaque
            </h2>
            <p className="mt-2 text-zinc-400">
              Selecionados a dedo para uma experiência premium.
            </p>
          </div>
          <Button
            variant="outline"
            asChild
            className="border-white/15 bg-transparent text-white hover:bg-white/5"
          >
            <Link href="/produtos">
              Ver catálogo completo <ArrowRight />
            </Link>
          </Button>
        </div>

        {featured.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/10 py-24 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-zinc-900">
              <PackageSearch className="size-7 text-zinc-500" />
            </div>
            <p className="font-medium text-white">Nenhum produto em destaque no momento</p>
            <p className="max-w-xs text-sm text-zinc-400">
              Explore nosso catálogo completo para ver todos os produtos disponíveis.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {featured.map((product) => (
              <MavelProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
