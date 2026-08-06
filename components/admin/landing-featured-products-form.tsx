"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Star } from "lucide-react";

import { setFeaturedProductsAction } from "@/app/admin/(protected)/landing/actions";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const MAX_FEATURED = 3;

export function LandingFeaturedProductsForm({ products }: { products: Product[] }) {
  const router = useRouter();
  const [selected, setSelected] = React.useState<string[]>(
    products.filter((p) => p.featured).map((p) => p.id)
  );
  const [saving, setSaving] = React.useState(false);

  function toggle(id: string) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((p) => p !== id);
      if (prev.length >= MAX_FEATURED) {
        toast.error(`Selecione no máximo ${MAX_FEATURED} produtos em destaque`);
        return prev;
      }
      return [...prev, id];
    });
  }

  async function handleSave() {
    setSaving(true);
    try {
      await setFeaturedProductsAction(selected);
      toast.success("Produtos em destaque atualizados");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível salvar os destaques");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-muted-foreground">
        Selecione até {MAX_FEATURED} produtos para exibir na Home ({selected.length}/{MAX_FEATURED}
        selecionados).
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => {
          const active = selected.includes(product.id);
          return (
            <button
              key={product.id}
              type="button"
              onClick={() => toggle(product.id)}
              className={cn(
                "flex items-center gap-3 rounded-2xl border p-3 text-left transition-colors",
                active ? "border-primary bg-primary/5" : "border-border hover:bg-secondary"
              )}
            >
              <div className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-secondary">
                <Image src={product.images[0]} alt={product.name} fill sizes="48px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{product.name}</p>
                <p className="text-xs text-muted-foreground">{formatPrice(product.price)}</p>
              </div>
              {active && (
                <Badge variant="purple" className="shrink-0">
                  <Star className="size-3" /> Destaque
                </Badge>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex justify-end border-t border-border pt-5">
        <Button type="button" disabled={saving} onClick={handleSave}>
          Salvar destaques
        </Button>
      </div>
    </div>
  );
}
