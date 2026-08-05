"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Barcode, CheckCircle2, CreditCard, QrCode } from "lucide-react";

import { getOrderByNumber } from "@/services/orders.service";
import { getCustomerById } from "@/services/customers.service";
import { useProducts } from "@/context/products-context";
import type { OrderStatus, PaymentMethod } from "@/lib/types";
import { formatPrice } from "@/lib/format";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/admin/empty-state";
import { ClipboardList } from "lucide-react";

const STATUS_LABELS: Record<OrderStatus, string> = {
  pendente: "Pendente",
  pago: "Pago",
  enviado: "Enviado",
  entregue: "Entregue",
  cancelado: "Cancelado",
};

const STATUS_VARIANTS: Record<OrderStatus, "outline" | "success" | "purple" | "destructive"> = {
  pendente: "outline",
  pago: "success",
  enviado: "purple",
  entregue: "success",
  cancelado: "destructive",
};

const PAYMENT_LABELS: Record<PaymentMethod, { label: string; icon: React.ElementType }> = {
  cartao: { label: "Cartão de crédito", icon: CreditCard },
  pix: { label: "PIX", icon: QrCode },
  boleto: { label: "Boleto", icon: Barcode },
};

export default function OrderDetailPage() {
  const params = useParams<{ numero: string }>();
  const router = useRouter();
  const { getProduct } = useProducts();

  const order = getOrderByNumber(params.numero);
  const customer = order ? getCustomerById(order.customerId) : undefined;

  if (!order || !customer) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="Pedido não encontrado"
        description="Esse pedido pode não existir."
        actionLabel="Voltar para pedidos"
        onAction={() => router.push("/admin/pedidos")}
      />
    );
  }

  const PaymentIcon = PAYMENT_LABELS[order.paymentMethod].icon;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Pedido {order.number}</h1>
          <p className="mt-1 text-muted-foreground">
            Realizado em {new Date(order.createdAt + "T00:00:00").toLocaleDateString("pt-BR")}
          </p>
        </div>
        <Badge variant={STATUS_VARIANTS[order.status]} className="w-fit">
          {STATUS_LABELS[order.status]}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="rounded-2xl border border-border bg-white p-6">
            <h2 className="text-sm font-semibold text-foreground">Produtos</h2>
            <ul className="mt-4 flex flex-col gap-4">
              {order.items.map((item) => {
                const product = getProduct(item.productId);
                return (
                  <li key={item.productId} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        href={product ? `/admin/produtos/${product.id}` : "#"}
                        className="truncate font-medium text-foreground hover:text-primary"
                      >
                        {product?.name ?? "Produto removido"}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity}x {formatPrice(item.unitPrice)}
                      </p>
                    </div>
                    <span className="shrink-0 font-medium text-foreground">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </span>
                  </li>
                );
              })}
            </ul>
            <Separator className="my-4" />
            <div className="flex justify-between text-base font-semibold text-foreground">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6">
            <h2 className="text-sm font-semibold text-foreground">Linha do tempo</h2>
            <ol className="mt-4 flex flex-col gap-4">
              {order.timeline.map((entry, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
                    <CheckCircle2 className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{STATUS_LABELS[entry.status]}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(entry.date + "T00:00:00").toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-border bg-white p-6">
            <h2 className="text-sm font-semibold text-foreground">Cliente</h2>
            <div className="mt-3 flex flex-col gap-1">
              <Link href={`/admin/clientes/${customer.id}`} className="font-medium text-foreground hover:text-primary">
                {customer.name}
              </Link>
              <p className="text-sm text-muted-foreground">{customer.email}</p>
              <p className="text-sm text-muted-foreground">{customer.phone}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6">
            <h2 className="text-sm font-semibold text-foreground">Forma de pagamento</h2>
            <div className="mt-3 flex items-center gap-2 text-sm text-foreground">
              <PaymentIcon className="size-4 text-primary" />
              {PAYMENT_LABELS[order.paymentMethod].label}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6">
            <h2 className="text-sm font-semibold text-foreground">Endereço de entrega</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              {order.address.rua}, {order.address.numero}
              <br />
              {order.address.cidade} - {order.address.estado}
              <br />
              CEP {order.address.cep}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
