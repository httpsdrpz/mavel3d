"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Star } from "lucide-react";

import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/context/cart-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const discount = product.compareAtPrice
    ? Math.round(100 - (product.price / product.compareAtPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-white transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10"
    >
      <Link href={`/produto/${product.id}`} className="relative block aspect-square overflow-hidden bg-secondary">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew && <Badge variant="purple">Novo</Badge>}
          {discount > 0 && <Badge variant="destructive">-{discount}%</Badge>}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="text-xs font-medium text-muted-foreground">{product.category}</span>
        <Link href={`/produto/${product.id}`} className="line-clamp-1 font-medium text-foreground hover:text-primary">
          {product.name}
        </Link>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="size-3.5 fill-amber-400 text-amber-400" />
          {product.rating.toFixed(1)}
        </div>

        <div className="mt-auto flex items-end justify-between pt-2">
          <div className="flex flex-col">
            {product.compareAtPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
            <span className="font-semibold text-foreground">{formatPrice(product.price)}</span>
          </div>
          <Button
            size="icon"
            className="rounded-full"
            onClick={(e) => {
              e.preventDefault();
              addToCart(product.id, 1);
            }}
            disabled={product.stock === 0}
            aria-label="Adicionar ao carrinho"
          >
            <Plus />
          </Button>
        </div>
        {product.stock === 0 && (
          <span className="text-xs font-medium text-destructive">Fora de estoque</span>
        )}
      </div>
    </motion.div>
  );
}
