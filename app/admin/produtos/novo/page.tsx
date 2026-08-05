"use client";

import { useRouter } from "next/navigation";

import { useProducts, type ProductInput } from "@/context/products-context";
import { ProductForm } from "@/components/admin/product-form";

export default function NewProductPage() {
  const router = useRouter();
  const { addProduct } = useProducts();

  function handleSubmit(data: ProductInput) {
    addProduct(data);
    router.push("/admin/produtos");
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Novo produto</h1>
        <p className="mt-1 text-muted-foreground">Preencha os dados para cadastrar um novo produto.</p>
      </div>

      <div className="rounded-2xl border border-border bg-white p-6">
        <ProductForm
          onSubmit={handleSubmit}
          onCancel={() => router.push("/admin/produtos")}
          submitLabel="Adicionar produto"
        />
      </div>
    </div>
  );
}
