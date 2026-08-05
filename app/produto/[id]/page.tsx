"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronRight, Minus, Plus, ShieldCheck, ShoppingBag, Star, Truck, Zap } from "lucide-react";

import { useProducts } from "@/context/products-context";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProductGrid } from "@/components/product-grid";
import { cn } from "@/lib/utils";

export default function ProdutoPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { products, getProduct } = useProducts();
  const { addToCart } = useCart();

  const product = getProduct(params.id);
  const [activeImage, setActiveImage] = React.useState(0);
  const [quantity, setQuantity] = React.useState(1);
  const [lastId, setLastId] = React.useState(params.id);

  if (params.id !== lastId) {
    setLastId(params.id);
    setActiveImage(0);
    setQuantity(1);
  }

  if (!product) {
    return (
      <div className="mx-auto flex max-w-7xl flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
        <p className="text-xl font-semibold text-foreground">Produto não encontrado</p>
        <p className="text-muted-foreground">Esse produto pode ter sido removido ou não existe.</p>
        <Button asChild>
          <Link href="/produtos">Voltar para produtos</Link>
        </Button>
      </div>
    );
  }

  const discount = product.compareAtPrice
    ? Math.round(100 - (product.price / product.compareAtPrice) * 100)
    : 0;

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  function handleAddToCart() {
    addToCart(product!.id, quantity);
  }

  function handleBuyNow() {
    addToCart(product!.id, quantity);
    router.push("/checkout");
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-8 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/produtos" className="hover:text-primary">
          Produtos
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">{product.category}</span>
        <ChevronRight className="size-3.5" />
        <span className="line-clamp-1 text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-secondary">
            <Image
              src={product.images[activeImage]}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
              priority
            />
            <div className="absolute top-4 left-4 flex flex-col gap-1.5">
              {product.isNew && <Badge variant="purple">Novo</Badge>}
              {discount > 0 && <Badge variant="destructive">-{discount}%</Badge>}
            </div>
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((image, index) => (
                <button
                  key={image + index}
                  onClick={() => setActiveImage(index)}
                  className={cn(
                    "relative size-20 shrink-0 overflow-hidden rounded-xl border-2 bg-secondary transition-colors",
                    activeImage === index ? "border-primary" : "border-transparent"
                  )}
                >
                  <Image src={image} alt={`${product.name} ${index + 1}`} fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <span className="text-sm font-medium text-primary">{product.category}</span>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
              {product.name}
            </h1>
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="size-4 fill-amber-400 text-amber-400" />
                {product.rating.toFixed(1)}
              </div>
              <span>•</span>
              <span>
                {product.stock > 0 ? `${product.stock} em estoque` : "Fora de estoque"}
              </span>
            </div>
          </div>

          <div className="flex items-end gap-3">
            {product.compareAtPrice && (
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
            <span className="text-3xl font-semibold text-foreground">
              {formatPrice(product.price)}
            </span>
          </div>

          <p className="leading-relaxed text-muted-foreground">{product.description}</p>

          <Separator />

          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-foreground">Quantidade</span>
            <div className="flex items-center rounded-full border border-border">
              <button
                className="flex size-10 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-40"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="size-4" />
              </button>
              <span className="w-8 text-center text-sm font-medium">{quantity}</span>
              <button
                className="flex size-10 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-40"
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                disabled={quantity >= product.stock}
              >
                <Plus className="size-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              variant="glow"
              size="lg"
              className="flex-1"
              onClick={handleBuyNow}
              disabled={product.stock === 0}
            >
              <Zap /> Comprar agora
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingBag /> Adicionar ao carrinho
            </Button>
          </div>

          <Separator />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-xl border border-border p-4">
              <Truck className="size-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">Frete rápido</p>
                <p className="text-xs text-muted-foreground">Entrega em todo o Brasil</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-border p-4">
              <ShieldCheck className="size-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">Garantia</p>
                <p className="text-xs text-muted-foreground">12 meses de garantia</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-8 text-2xl font-semibold tracking-tight text-foreground">
            Produtos relacionados
          </h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
