"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { Package, Trash2 } from "lucide-react";

import { useProducts, type ProductInput } from "@/context/products-context";
import { Button } from "@/components/ui/button";
import { ProductForm } from "@/components/admin/product-form";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { EmptyState } from "@/components/admin/empty-state";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { getProduct, updateProduct, deleteProduct, isReady } = useProducts();
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  const product = getProduct(params.id);

  function handleSubmit(data: ProductInput) {
    updateProduct(params.id, data);
    router.push("/admin/produtos");
  }

  function handleDelete() {
    deleteProduct(params.id);
    router.push("/admin/produtos");
  }

  if (isReady && !product) {
    return (
      <EmptyState
        icon={Package}
        title="Produto não encontrado"
        description="Esse produto pode ter sido removido."
        actionLabel="Voltar para produtos"
        onAction={() => router.push("/admin/produtos")}
      />
    );
  }

  if (!product) return null;

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
