"use client";

import * as React from "react";
import { Plus, Tags, Pencil, Trash2 } from "lucide-react";

import { useCategories, type CategoryInput } from "@/context/categories-context";
import { useProducts } from "@/context/products-context";
import type { ProductCategory } from "@/lib/types";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { CategoryFormDialog } from "@/components/admin/category-form-dialog";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { EmptyState } from "@/components/admin/empty-state";
import { DynamicIcon } from "@/components/dynamic-icon";
import { TableSkeleton } from "@/components/admin/loading-skeleton";

export default function CategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory, isReady } = useCategories();
  const { products } = useProducts();

  const [formOpen, setFormOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<ProductCategory | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<ProductCategory | null>(null);

  function openAddForm() {
    setEditingCategory(null);
    setFormOpen(true);
  }

  function openEditForm(category: ProductCategory) {
    setEditingCategory(category);
    setFormOpen(true);
  }

  function handleSubmit(data: CategoryInput) {
    if (editingCategory) {
      updateCategory(editingCategory.id, data);
    } else {
      addCategory(data);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Categorias</h1>
          <p className="mt-1 text-muted-foreground">Organize os produtos da sua loja por categoria.</p>
        </div>
        <Button onClick={openAddForm}>
          <Plus /> Nova categoria
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-white">
        {!isReady ? (
          <TableSkeleton columns={4} />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Cor</TableHead>
                <TableHead>Qtd. produtos</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => {
                const productCount = products.filter((p) => p.category === category.name).length;
                return (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div
                          className="flex size-9 items-center justify-center rounded-xl text-white"
                          style={{ backgroundColor: category.color }}
                        >
                          <DynamicIcon name={category.icon} className="size-4" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{category.name}</p>
                          {category.description && (
                            <p className="line-clamp-1 text-xs text-muted-foreground">
                              {category.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className="inline-block size-5 rounded-full border border-border"
                        style={{ backgroundColor: category.color }}
                      />
                    </TableCell>
                    <TableCell className="text-foreground">{productCount}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditForm(category)}
                          aria-label="Editar categoria"
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteTarget(category)}
                          aria-label="Excluir categoria"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}

        {isReady && categories.length === 0 && (
          <EmptyState
            icon={Tags}
            title="Nenhuma categoria cadastrada"
            description="Clique em 'Nova categoria' para começar."
          />
        )}
      </div>

      <CategoryFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        initialData={editingCategory ?? undefined}
        onSubmit={handleSubmit}
      />

      <DeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        description={`Tem certeza que deseja excluir a categoria "${deleteTarget?.name}"? Os produtos vinculados manterão o nome da categoria, mas ela deixará de ser gerenciável.`}
        onConfirm={() => deleteTarget && deleteCategory(deleteTarget.id)}
      />
    </div>
  );
}
