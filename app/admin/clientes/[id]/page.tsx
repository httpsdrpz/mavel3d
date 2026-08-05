"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Users } from "lucide-react";

import { getCustomerById } from "@/services/customers.service";
import { getOrdersByCustomer } from "@/services/orders.service";
import { useProducts } from "@/context/products-context";
import type { OrderStatus } from "@/lib/types";
import { formatPrice } from "@/lib/format";

import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/admin/empty-state";

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

export default function CustomerDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { getProduct } = useProducts();

  const customer = getCustomerById(params.id);
  const orders = React.useMemo(
    () => (customer ? getOrdersByCustomer(customer.id) : []),
    [customer]
  );
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);

  const favoriteProducts = React.useMemo(() => {
    const quantities = new Map<string, number>();
    for (const order of orders) {
      for (const item of order.items) {
        quantities.set(item.productId, (quantities.get(item.productId) ?? 0) + item.quantity);
      }
    }
    return [...quantities.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([productId]) => getProduct(productId))
      .filter((product): product is NonNullable<typeof product> => Boolean(product));
  }, [orders, getProduct]);

  if (!customer) {
    return (
      <EmptyState
        icon={Users}
        title="Cliente não encontrado"
        description="Esse cliente pode não existir."
        actionLabel="Voltar para clientes"
        onAction={() => router.push("/admin/clientes")}
      />
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{customer.name}</h1>
        <p className="mt-1 text-muted-foreground">
          Cliente desde {new Date(customer.createdAt + "T00:00:00").toLocaleDateString("pt-BR")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="rounded-2xl border border-border bg-white p-6">
            <h2 className="text-sm font-semibold text-foreground">Histórico de pedidos</h2>
            <ul className="mt-4 flex flex-col gap-3">
              {orders.map((order) => (
                <li key={order.number}>
                  <Link
                    href={`/admin/pedidos/${order.number}`}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border p-3 transition-colors hover:bg-secondary"
                  >
                    <div>
                      <p className="font-medium text-foreground">{order.number}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.createdAt + "T00:00:00").toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={STATUS_VARIANTS[order.status]}>{STATUS_LABELS[order.status]}</Badge>
                      <span className="font-medium text-foreground">{formatPrice(order.total)}</span>
                    </div>
                  </Link>
                </li>
              ))}
              {orders.length === 0 && (
                <p className="text-sm text-muted-foreground">Nenhum pedido registrado.</p>
              )}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6">
            <h2 className="text-sm font-semibold text-foreground">Produtos favoritos</h2>
            {favoriteProducts.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">Nenhum produto comprado ainda.</p>
            ) : (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {favoriteProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/admin/produtos/${product.id}`}
                    className="flex flex-col gap-2 rounded-xl border border-border p-2 transition-colors hover:bg-secondary"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-lg bg-secondary">
                      <Image src={product.images[0]} alt={product.name} fill sizes="120px" className="object-cover" />
                    </div>
                    <span className="line-clamp-1 text-xs font-medium text-foreground">{product.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-border bg-white p-6">
            <h2 className="text-sm font-semibold text-foreground">Dados de contato</h2>
            <div className="mt-3 flex flex-col gap-1 text-sm text-muted-foreground">
              <p>{customer.email}</p>
              <p>{customer.phone}</p>
              <p>
                {customer.address.rua}, {customer.address.numero}
                <br />
                {customer.address.cidade} - {customer.address.estado}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6">
            <h2 className="text-sm font-semibold text-foreground">Resumo</h2>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total de pedidos</span>
                <span className="font-medium text-foreground">{orders.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total gasto</span>
                <span className="font-medium text-foreground">{formatPrice(totalSpent)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
