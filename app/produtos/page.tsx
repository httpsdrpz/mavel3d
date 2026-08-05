"use client";

import * as React from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";

import { useProducts } from "@/context/products-context";
import { categories } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

import { ProductGrid } from "@/components/product-grid";
import { SearchBar } from "@/components/search-bar";
import { CategoryFilter } from "@/components/category-filter";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type SortOption = "relevancia" | "preco-asc" | "preco-desc" | "nome-asc";

const SORT_LABELS: Record<SortOption, string> = {
  relevancia: "Relevância",
  "preco-asc": "Menor preço",
  "preco-desc": "Maior preço",
  "nome-asc": "Nome (A-Z)",
};

function ProdutosContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { products } = useProducts();

  const maxPossiblePrice = React.useMemo(
    () => Math.ceil(Math.max(...products.map((p) => p.price), 1000) / 100) * 100,
    [products]
  );

  const [query, setQuery] = React.useState(searchParams.get("q") ?? "");
  const [category, setCategory] = React.useState<Category | "all">(
    (searchParams.get("categoria") as Category | null) ?? "all"
  );
  const [maxPrice, setMaxPrice] = React.useState(maxPossiblePrice);
  const [sort, setSort] = React.useState<SortOption>("relevancia");
  const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false);
  const [lastMaxPossiblePrice, setLastMaxPossiblePrice] = React.useState(maxPossiblePrice);

  if (maxPossiblePrice !== lastMaxPossiblePrice) {
    setLastMaxPossiblePrice(maxPossiblePrice);
    setMaxPrice(maxPossiblePrice);
  }

  const filtered = React.useMemo(() => {
    let list = products.filter((p) => p.price <= maxPrice);

    if (category !== "all") {
      list = list.filter((p) => p.category === category);
    }

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }

    switch (sort) {
      case "preco-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "preco-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "nome-asc":
        list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        list = [...list].sort((a, b) => Number(b.featured) - Number(a.featured));
    }

    return list;
  }, [products, category, query, maxPrice, sort]);

  function clearFilters() {
    setQuery("");
    setCategory("all");
    setMaxPrice(maxPossiblePrice);
    setSort("relevancia");
    router.replace("/produtos");
  }

  const filtersContent = (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">Buscar</h3>
        <SearchBar value={query} onValueChange={setQuery} placeholder="Nome do produto..." />
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">Categoria</h3>
        <CategoryFilter categories={categories} selected={category} onChange={setCategory} />
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Preço máximo</h3>
          <span className="text-sm font-medium text-primary">{formatPrice(maxPrice)}</span>
        </div>
        <input
          type="range"
          min={0}
          max={maxPossiblePrice}
          step={50}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-primary"
        />
      </div>

      <Button variant="outline" onClick={clearFilters} className="w-full">
        Limpar filtros
      </Button>
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Produtos</h1>
        <p className="text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? "produto encontrado" : "produtos encontrados"}
        </p>
      </div>

      <div className="flex gap-10">
        <aside className="hidden w-64 shrink-0 lg:block">{filtersContent}</aside>

        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between gap-3">
            <Button
              variant="outline"
              className="lg:hidden"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <SlidersHorizontal className="size-4" />
              Filtros
            </Button>

            <div className={cn("ml-auto flex items-center gap-2")}>
              <span className="hidden text-sm text-muted-foreground sm:inline">
                Ordenar por
              </span>
              <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
                <SelectTrigger className="w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SORT_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <ProductGrid products={filtered} />
        </div>
      </div>

      <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Filtros</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-6 pb-6">{filtersContent}</div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default function ProdutosPage() {
  return (
    <Suspense fallback={null}>
      <ProdutosContent />
    </Suspense>
  );
}
