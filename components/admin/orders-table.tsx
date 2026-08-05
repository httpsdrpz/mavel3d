"use client";

import * as React from "react";
import Link from "next/link";
import { ClipboardList } from "lucide-react";

import { getOrders } from "@/services/orders.service";
import { getCustomerById } from "@/services/customers.service";
import type { OrderStatus } from "@/lib/types";
import { formatPrice } from "@/lib/format";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { SearchInput } from "@/components/admin/search-input";
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

export function OrdersTable() {
  const orders = React.useMemo(() => getOrders(), []);
  const [query, setQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"all" | OrderStatus>("all");

  const filtered = orders.filter((order) => {
    const customer = getCustomerById(order.customerId);
    if (statusFilter !== "all" && order.status !== statusFilter) return false;
    if (!query.trim()) return true;
    const q = query.trim().toLowerCase();
    return (
      order.number.toLowerCase().includes(q) ||
      (customer && customer.name.toLowerCase().includes(q))
    );
  });

  return (
    <div className="rounded-2xl border border-border bg-white">
      <div className="flex flex-col gap-4 border-b border-border p-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Pedidos</h2>
          <p className="text-sm text-muted-foreground">Acompanhe os pedidos da sua loja (dados fictícios).</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchInput
            value={query}
            onValueChange={setQuery}
            placeholder="Buscar por número ou cliente..."
            className="sm:max-w-xs"
          />
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
            <SelectTrigger className="sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos status</SelectItem>
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Número</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((order) => {
            const customer = getCustomerById(order.customerId);
            return (
              <TableRow key={order.number} className="cursor-pointer">
                <TableCell className="font-medium text-foreground">
                  <Link href={`/admin/pedidos/${order.number}`} className="hover:text-primary">
                    {order.number}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">{customer?.name ?? "—"}</TableCell>
                <TableCell className="font-medium text-foreground">{formatPrice(order.total)}</TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANTS[order.status]}>{STATUS_LABELS[order.status]}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(order.createdAt + "T00:00:00").toLocaleDateString("pt-BR")}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {filtered.length === 0 && (
        <EmptyState icon={ClipboardList} title="Nenhum pedido encontrado" description="Ajuste os filtros de busca." />
      )}
    </div>
  );
}
