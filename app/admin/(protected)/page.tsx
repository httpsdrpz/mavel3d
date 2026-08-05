import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, Boxes, ClipboardList, Package, Star, Wallet } from "lucide-react";

import { getAllProductsAdmin } from "@/services/products-admin";
import { getOrders } from "@/services/orders.service";
import { activity } from "@/lib/activity";
import { formatPrice } from "@/lib/format";

import { Badge } from "@/components/ui/badge";
import { StatsGrid, type StatCardData } from "@/components/admin/stats-grid";

export default async function AdminDashboardPage() {
  const products = await getAllProductsAdmin();
  const orders = getOrders();

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const featuredCount = products.filter((p) => p.featured).length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  const recentProducts = [...products]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);

  const lowStockProducts = products
    .filter((p) => p.stock > 0 && p.stock <= 5)
    .slice(0, 5);

  const stats: StatCardData[] = [
    { label: "Total de produtos", value: totalProducts, icon: Package },
    { label: "Produtos em estoque", value: totalStock, icon: Boxes },
    { label: "Produtos em destaque", value: featuredCount, icon: Star },
    { label: "Total de pedidos", value: orders.length, icon: ClipboardList },
    { label: "Receita total", value: formatPrice(totalRevenue), icon: Wallet },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Visão geral da sua loja Marvel.</p>
      </div>

      <StatsGrid stats={stats} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-white p-6 lg:col-span-1">
          <h2 className="text-sm font-semibold text-foreground">Últimos produtos adicionados</h2>
          <ul className="mt-4 flex flex-col gap-3">
            {recentProducts.map((product) => (
              <li key={product.id}>
                <Link
                  href={`/admin/produtos/${product.id}`}
                  className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-secondary"
                >
                  <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-secondary">
                    <Image src={product.images[0]} alt={product.name} fill sizes="40px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{formatPrice(product.price)}</p>
                  </div>
                </Link>
              </li>
            ))}
            {recentProducts.length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhum produto cadastrado.</p>
            )}
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-white p-6 lg:col-span-1">
          <h2 className="text-sm font-semibold text-foreground">Produtos com estoque baixo</h2>
          <ul className="mt-4 flex flex-col gap-3">
            {lowStockProducts.map((product) => (
              <li key={product.id}>
                <Link
                  href={`/admin/produtos/${product.id}`}
                  className="flex items-center justify-between gap-3 rounded-xl p-2 transition-colors hover:bg-secondary"
                >
                  <span className="truncate text-sm font-medium text-foreground">{product.name}</span>
                  <Badge variant="secondary">{product.stock} un.</Badge>
                </Link>
              </li>
            ))}
            {lowStockProducts.length === 0 && (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertTriangle className="size-4" /> Nenhum produto com estoque baixo.
              </p>
            )}
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-white p-6 lg:col-span-1">
          <h2 className="text-sm font-semibold text-foreground">Atividades recentes</h2>
          <ul className="mt-4 flex flex-col gap-4">
            {activity.map((item) => (
              <li key={item.id} className="flex flex-col gap-0.5">
                <p className="text-sm text-foreground">{item.message}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(item.date + "T00:00:00").toLocaleDateString("pt-BR")}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
