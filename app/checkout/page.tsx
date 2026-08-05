"use client";

import * as React from "react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Barcode,
  CheckCircle2,
  Copy,
  CreditCard,
  QrCode,
  ShoppingBag,
} from "lucide-react";
import { toast } from "sonner";

import { useCart } from "@/context/cart-context";
import { formatPrice, generateOrderNumber } from "@/lib/format";
import type { PaymentMethod } from "@/lib/types";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const checkoutSchema = z.object({
  nome: z.string().min(3, "Informe seu nome completo"),
  email: z.string().email("E-mail inválido"),
  telefone: z.string().min(8, "Telefone inválido"),
  cep: z.string().min(8, "CEP inválido"),
  rua: z.string().min(3, "Informe a rua"),
  numero: z.string().min(1, "Informe o número"),
  cidade: z.string().min(2, "Informe a cidade"),
  estado: z.string().min(2, "Informe a UF").max(2, "Use a sigla, ex: SP"),
  pagamento: z.enum(["cartao", "pix", "boleto"]),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const PAYMENT_OPTIONS: { value: PaymentMethod; label: string; icon: React.ElementType }[] = [
  { value: "cartao", label: "Cartão", icon: CreditCard },
  { value: "pix", label: "PIX", icon: QrCode },
  { value: "boleto", label: "Boleto", icon: Barcode },
];

export default function CheckoutPage() {
  const { lines, subtotal, shipping, total, clearCart, isReady } = useCart();
  const [orderNumber, setOrderNumber] = React.useState<string | null>(null);
  const [orderTotal, setOrderTotal] = React.useState(0);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      cep: "",
      rua: "",
      numero: "",
      cidade: "",
      estado: "",
      pagamento: "cartao",
    },
  });

  async function onSubmit() {
    await new Promise((resolve) => setTimeout(resolve, 700));
    setOrderTotal(total);
    setOrderNumber(generateOrderNumber());
    clearCart();
  }

  if (orderNumber) {
    return <OrderSuccess orderNumber={orderNumber} total={orderTotal} />;
  }

  if (isReady && lines.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-secondary">
          <ShoppingBag className="size-8 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-semibold text-foreground">Seu carrinho está vazio</h1>
        <p className="max-w-sm text-muted-foreground">
          Adicione produtos ao carrinho antes de finalizar a compra.
        </p>
        <Button size="lg" asChild className="mt-2">
          <Link href="/produtos">Explorar produtos</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-semibold tracking-tight text-foreground">Checkout</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-10 lg:grid-cols-3"
      >
        <div className="flex flex-col gap-8 lg:col-span-2">
          <section className="rounded-2xl border border-border bg-white p-6">
            <h2 className="mb-5 text-lg font-semibold text-foreground">Dados pessoais</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label htmlFor="nome">Nome completo</Label>
                <Input id="nome" placeholder="Seu nome" {...register("nome")} />
                {errors.nome && <p className="text-xs text-destructive">{errors.nome.message}</p>}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="voce@email.com" {...register("email")} />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input id="telefone" placeholder="(00) 00000-0000" {...register("telefone")} />
                {errors.telefone && (
                  <p className="text-xs text-destructive">{errors.telefone.message}</p>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-white p-6">
            <h2 className="mb-5 text-lg font-semibold text-foreground">Endereço de entrega</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label htmlFor="cep">CEP</Label>
                <Input id="cep" placeholder="00000-000" {...register("cep")} />
                {errors.cep && <p className="text-xs text-destructive">{errors.cep.message}</p>}
              </div>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label htmlFor="rua">Rua</Label>
                <Input id="rua" placeholder="Nome da rua" {...register("rua")} />
                {errors.rua && <p className="text-xs text-destructive">{errors.rua.message}</p>}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="numero">Número</Label>
                <Input id="numero" placeholder="123" {...register("numero")} />
                {errors.numero && (
                  <p className="text-xs text-destructive">{errors.numero.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input id="cidade" placeholder="Sua cidade" {...register("cidade")} />
                {errors.cidade && (
                  <p className="text-xs text-destructive">{errors.cidade.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="estado">Estado</Label>
                <Input id="estado" placeholder="UF" maxLength={2} {...register("estado")} />
                {errors.estado && (
                  <p className="text-xs text-destructive">{errors.estado.message}</p>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-white p-6">
            <h2 className="mb-5 text-lg font-semibold text-foreground">Forma de pagamento</h2>
            <Controller
              name="pagamento"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {PAYMENT_OPTIONS.map((option) => {
                    const Icon = option.icon;
                    const active = field.value === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => field.onChange(option.value)}
                        className={cn(
                          "flex flex-col items-center gap-2 rounded-xl border-2 p-5 transition-colors",
                          active
                            ? "border-primary bg-accent text-accent-foreground"
                            : "border-border text-foreground/70 hover:border-primary/30"
                        )}
                      >
                        <Icon className="size-5" />
                        <span className="text-sm font-medium">{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            />
          </section>
        </div>

        <div className="h-fit rounded-2xl border border-border bg-white p-6">
          <h2 className="text-lg font-semibold text-foreground">Resumo do pedido</h2>

          <ul className="mt-4 flex flex-col gap-3">
            {lines.map((line) => (
              <li key={line.productId} className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {line.product.name} x{line.quantity}
                </span>
                <span className="font-medium text-foreground">
                  {formatPrice(line.product.price * line.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <Separator className="my-4" />

          <div className="flex flex-col gap-2 text-sm">
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

          <Button
            type="submit"
            variant="glow"
            size="lg"
            className="mt-6 w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processando..." : "Finalizar Pedido"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function OrderSuccess({ orderNumber, total }: { orderNumber: string; total: number }) {
  function copyOrderNumber() {
    navigator.clipboard.writeText(orderNumber);
    toast.success("Número do pedido copiado");
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-1 flex-col items-center justify-center gap-6 px-4 py-24 text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-success/10">
        <CheckCircle2 className="size-10 text-success" />
      </div>
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Pedido confirmado!
        </h1>
        <p className="mt-2 text-muted-foreground">
          Obrigado pela sua compra. Enviamos os detalhes para o seu email.
        </p>
      </div>

      <div className="flex w-full flex-col gap-4 rounded-2xl border border-border bg-white p-6">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Número do pedido</span>
          <button
            onClick={copyOrderNumber}
            className="flex items-center gap-1.5 font-mono text-sm font-semibold text-primary"
          >
            {orderNumber}
            <Copy className="size-3.5" />
          </button>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total pago</span>
          <span className="text-lg font-semibold text-foreground">{formatPrice(total)}</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button size="lg" asChild>
          <Link href="/produtos">Continuar comprando</Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href="/">Voltar ao início</Link>
        </Button>
      </div>
    </div>
  );
}
