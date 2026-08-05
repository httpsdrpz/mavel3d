"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";

export function MavelProductCard({ product }: { product: Product }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4 }}
    >
      <Link
        href={`/produto/${product.id}`}
        className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/30 hover:bg-zinc-900"
      >
        <div className="relative aspect-square overflow-hidden bg-zinc-800">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 33vw, 90vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isNew && (
              <span className="rounded-full border border-violet-500/30 bg-violet-500/15 px-2.5 py-0.5 text-xs font-medium text-violet-300 backdrop-blur">
                Novo
              </span>
            )}
            {product.isPromotion && (
              <span className="rounded-full border border-fuchsia-500/30 bg-fuchsia-500/15 px-2.5 py-0.5 text-xs font-medium text-fuchsia-300 backdrop-blur">
                Promoção
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2 p-5">
          <h3 className="font-medium text-white">{product.name}</h3>
          <p className="line-clamp-2 text-sm text-zinc-400">{product.shortDescription}</p>

          <div className="mt-auto flex items-center justify-between pt-4">
            <div className="flex flex-col">
              {product.compareAtPrice && (
                <span className="text-xs text-zinc-500 line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
              <span className="font-semibold text-white">{formatPrice(product.price)}</span>
            </div>
            <span className="rounded-full bg-gradient-to-br from-violet-600 to-purple-500 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-violet-600/20 transition-shadow group-hover:shadow-lg group-hover:shadow-violet-600/30">
              Comprar Agora
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
