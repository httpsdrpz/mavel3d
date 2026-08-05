import { CustomersTable } from "@/components/admin/customers-table";

export default function AdminCustomersPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Clientes</h1>
        <p className="mt-1 text-muted-foreground">Conheça os clientes da sua loja.</p>
      </div>
      <CustomersTable />
    </div>
  );
}
