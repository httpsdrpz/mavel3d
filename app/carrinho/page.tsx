"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function CarrinhoPage() {
  const { lines, updateQuantity, removeFromCart, subtotal, shipping, total, isReady } = useCart();

  if (isReady && lines.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-secondary">
          <ShoppingBag className="size-8 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-semibold text-foreground">Seu carrinho está vazio</h1>
        <p className="max-w-sm text-muted-foreground">
          Você ainda não adicionou nenhum produto. Explore nosso catálogo e encontre algo
          incrível.
        </p>
        <Button size="lg" asChild className="mt-2">
          <Link href="/produtos">Explorar produtos</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-semibold tracking-tight text-foreground">
        Seu carrinho
      </h1>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ul className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-white">
            {lines.map((line) => (
              <li key={line.productId} className="flex gap-4 p-5">
                <Link
                  href={`/produto/${line.productId}`}
                  className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-secondary"
                >
                  <Image
                    src={line.product.images[0]}
                    alt={line.product.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </Link>

                <div className="flex flex-1 flex-col justify-between gap-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link
                        href={`/produto/${line.productId}`}
                        className="font-medium text-foreground hover:text-primary"
                      >
                        {line.product.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">{line.product.category}</p>
                    </div>
                    <span className="font-semibold text-foreground">
                      {formatPrice(line.product.price * line.quantity)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center rounded-full border border-border">
                      <button
                        className="flex size-8 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-40"
                        onClick={() => updateQuantity(line.productId, line.quantity - 1)}
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <span className="w-7 text-center text-sm font-medium">
                        {line.quantity}
                      </span>
                      <button
                        className="flex size-8 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-40"
                        onClick={() => updateQuantity(line.productId, line.quantity + 1)}
                        disabled={line.quantity >= line.product.stock}
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(line.productId)}
                      className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                      Remover
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="h-fit rounded-2xl border border-border bg-white p-6">
          <h2 className="text-lg font-semibold text-foreground">Resumo do pedido</h2>

          <div className="mt-5 flex flex-col gap-3 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span className="font-medium text-foreground">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Frete</span>
              <span className="font-medium text-foreground">
                {shipping === 0 ? "Grátis" : formatPrice(shipping)}
              </span>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="flex justify-between text-base font-semibold text-foreground">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>

          <Button variant="glow" size="lg" className="mt-6 w-full" asChild>
            <Link href="/checkout">
              Ir para Checkout <ArrowRight />
            </Link>
          </Button>

          <Button variant="ghost" className="mt-2 w-full" asChild>
            <Link href="/produtos">Continuar comprando</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
