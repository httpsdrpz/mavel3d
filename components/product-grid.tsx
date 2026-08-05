import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product-card";
import { PackageSearch } from "lucide-react";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border py-24 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-secondary">
          <PackageSearch className="size-7 text-muted-foreground" />
        </div>
        <p className="font-medium text-foreground">Nenhum produto encontrado</p>
        <p className="max-w-xs text-sm text-muted-foreground">
          Tente ajustar os filtros ou buscar por outro termo.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
