"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

export function CartDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { lines, updateQuantity, removeFromCart, subtotal, count } = useCart();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="p-0">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="size-5 text-primary" />
            Seu carrinho {count > 0 && `(${count})`}
          </SheetTitle>
        </SheetHeader>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-secondary">
              <ShoppingBag className="size-7 text-muted-foreground" />
            </div>
            <p className="font-medium text-foreground">Seu carrinho está vazio</p>
            <p className="text-sm text-muted-foreground">
              Explore nossos produtos e encontre algo incrível.
            </p>
            <Button variant="outline" className="mt-2" onClick={() => onOpenChange(false)} asChild>
              <Link href="/produtos">Explorar produtos</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6">
              <ul className="flex flex-col gap-5 py-2">
                {lines.map((line) => (
                  <li key={line.productId} className="flex gap-4">
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-secondary">
                      <Image
                        src={line.product.images[0]}
                        alt={line.product.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-1">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/produto/${line.productId}`}
                          onClick={() => onOpenChange(false)}
                          className="text-sm font-medium leading-snug hover:text-primary"
                        >
                          {line.product.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(line.productId)}
                          className="text-muted-foreground transition-colors hover:text-destructive"
                          aria-label="Remover item"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-primary">
                        {formatPrice(line.product.price)}
                      </span>
                      <div className="mt-1 flex w-fit items-center rounded-full border border-border">
                        <button
                          className="flex size-7 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-40"
                          onClick={() => updateQuantity(line.productId, line.quantity - 1)}
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="w-6 text-center text-xs font-medium">
                          {line.quantity}
                        </span>
                        <button
                          className="flex size-7 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-40"
                          onClick={() => updateQuantity(line.productId, line.quantity + 1)}
                          disabled={line.quantity >= line.product.stock}
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <SheetFooter>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-medium text-foreground">{formatPrice(subtotal)}</span>
              </div>
              <Separator />
              <Button variant="glow" size="lg" className="w-full" asChild>
                <Link href="/carrinho" onClick={() => onOpenChange(false)}>
                  Ver carrinho
                </Link>
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
