"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

import { deleteProductAction, updateProductAction } from "@/app/admin/(protected)/produtos/actions";
import type { ProductInput } from "@/services/products-admin";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ProductForm } from "@/components/admin/product-form";
import { DeleteDialog } from "@/components/admin/delete-dialog";

export function EditProductView({ product }: { product: Product }) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  async function handleSubmit(data: ProductInput) {
    try {
      await updateProductAction(product.id, data);
      toast.success("Produto atualizado com sucesso");
      router.push("/admin/produtos");
    } catch {
      toast.error("Não foi possível atualizar o produto");
    }
  }

  async function handleDelete() {
    try {
      await deleteProductAction(product.id);
      toast.success("Produto excluído");
      router.push("/admin/produtos");
    } catch {
      toast.error("Não foi possível excluir o produto");
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Editar produto</h1>
          <p className="mt-1 text-muted-foreground">Atualize as informações de &quot;{product.name}&quot;.</p>
        </div>
        <Button
          variant="outline"
          onClick={() => setDeleteOpen(true)}
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 /> Excluir produto
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-white p-6">
        <ProductForm
          initialData={product}
          onSubmit={handleSubmit}
          onCancel={() => router.push("/admin/produtos")}
          submitLabel="Salvar alterações"
        />
      </div>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        description={`Tem certeza que deseja excluir "${product.name}"? Essa ação não pode ser desfeita.`}
        onConfirm={handleDelete}
      />
    </div>
  );
}
