import { OrdersTable } from "@/components/admin/orders-table";

export default function AdminOrdersPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Pedidos</h1>
        <p className="mt-1 text-muted-foreground">Acompanhe os pedidos realizados na sua loja.</p>
      </div>
      <OrdersTable />
    </div>
  );
}
