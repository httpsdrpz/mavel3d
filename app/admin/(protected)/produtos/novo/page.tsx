"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createProductAction } from "@/app/admin/(protected)/produtos/actions";
import type { ProductInput } from "@/services/products-admin";
import { ProductForm } from "@/components/admin/product-form";

export default function NewProductPage() {
  const router = useRouter();

  async function handleSubmit(data: ProductInput) {
    try {
      await createProductAction(data);
      toast.success("Produto adicionado com sucesso");
      router.push("/admin/produtos");
    } catch {
      toast.error("Não foi possível criar o produto");
    }
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
