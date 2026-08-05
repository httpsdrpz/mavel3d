"use client";

import * as React from "react";
import Link from "next/link";
import { Users } from "lucide-react";

import { getCustomers } from "@/services/customers.service";
import { getOrdersByCustomer } from "@/services/orders.service";
import { formatPrice } from "@/lib/format";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { SearchInput } from "@/components/admin/search-input";
import { EmptyState } from "@/components/admin/empty-state";

export function CustomersTable() {
  const customers = React.useMemo(() => getCustomers(), []);
  const [query, setQuery] = React.useState("");

  const filtered = customers.filter((customer) => {
    if (!query.trim()) return true;
    const q = query.trim().toLowerCase();
    return customer.name.toLowerCase().includes(q) || customer.email.toLowerCase().includes(q);
  });

  return (
    <div className="rounded-2xl border border-border bg-white">
      <div className="flex flex-col gap-4 border-b border-border p-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Clientes</h2>
          <p className="text-sm text-muted-foreground">Base de clientes da sua loja (dados fictícios).</p>
        </div>
        <SearchInput
          value={query}
          onValueChange={setQuery}
          placeholder="Buscar por nome ou email..."
          className="sm:max-w-xs"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Pedidos</TableHead>
            <TableHead>Total gasto</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((customer) => {
            const orders = getOrdersByCustomer(customer.id);
            const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
            return (
              <TableRow key={customer.id}>
                <TableCell className="font-medium text-foreground">
                  <Link href={`/admin/clientes/${customer.id}`} className="hover:text-primary">
                    {customer.name}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">{customer.email}</TableCell>
                <TableCell className="text-muted-foreground">{customer.phone}</TableCell>
                <TableCell className="text-foreground">{orders.length}</TableCell>
                <TableCell className="font-medium text-foreground">{formatPrice(totalSpent)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {filtered.length === 0 && (
        <EmptyState icon={Users} title="Nenhum cliente encontrado" description="Ajuste os filtros de busca." />
      )}
    </div>
  );
}
