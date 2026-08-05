import { ProductTable } from "@/components/admin/product-table";

export default function AdminProductsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Produtos</h1>
        <p className="mt-1 text-muted-foreground">Gerencie o catálogo completo da sua loja.</p>
      </div>
      <ProductTable />
    </div>
  );
}
