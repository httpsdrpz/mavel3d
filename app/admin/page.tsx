"use client";

import * as React from "react";
import Image from "next/image";
import { AlertTriangle, Boxes, Package, Pencil, Plus, Star, Trash2 } from "lucide-react";

import { useProducts, type ProductInput } from "@/context/products-context";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { AdminProductForm } from "@/components/admin/admin-product-form";

export default function AdminPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();

  const [formOpen, setFormOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<Product | null>(null);

  const totalProducts = products.length;
  const featuredCount = products.filter((p) => p.featured).length;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5).length;

  function openAddForm() {
    setEditingProduct(null);
    setFormOpen(true);
  }

  function openEditForm(product: Product) {
    setEditingProduct(product);
    setFormOpen(true);
  }

  function handleSubmit(data: ProductInput) {
    if (editingProduct) {
      updateProduct(editingProduct.id, data);
    } else {
      addProduct(data);
    }
    setFormOpen(false);
    setEditingProduct(null);
  }

  function confirmDelete() {
    if (deleteTarget) {
      deleteProduct(deleteTarget.id);
      setDeleteTarget(null);
    }
  }

  const cards = [
    {
      label: "Produtos cadastrados",
      value: totalProducts,
      icon: Package,
    },
    {
      label: "Produtos em destaque",
      value: featuredCount,
      icon: Star,
    },
    {
      label: "Itens em estoque",
      value: totalStock,
      icon: Boxes,
    },
    {
      label: "Estoque baixo",
      value: lowStock,
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Visão geral da sua loja Marvel.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-border bg-white p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">{card.label}</span>
              <div className="flex size-9 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <card.icon className="size-4" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-semibold text-foreground">{card.value}</p>
          </div>
        ))}
      </div>

      <div id="produtos" className="scroll-mt-24 rounded-2xl border border-border bg-white">
        <div className="flex flex-col gap-3 border-b border-border p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Produtos</h2>
            <p className="text-sm text-muted-foreground">Gerencie o catálogo da sua loja.</p>
          </div>
          <Button onClick={openAddForm}>
            <Plus /> Adicionar produto
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Imagem</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Estoque</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="relative size-12 overflow-hidden rounded-lg bg-secondary">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{product.name}</span>
                    {product.featured && <Badge variant="purple">Destaque</Badge>}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{product.category}</TableCell>
                <TableCell className="font-medium text-foreground">
                  {formatPrice(product.price)}
                </TableCell>
                <TableCell>
                  <Badge variant={product.stock === 0 ? "destructive" : product.stock <= 5 ? "secondary" : "success"}>
                    {product.stock} un.
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditForm(product)}
                      aria-label="Editar produto"
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteTarget(product)}
                      aria-label="Excluir produto"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {products.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <Package className="size-8 text-muted-foreground" />
            <p className="font-medium text-foreground">Nenhum produto cadastrado</p>
            <p className="text-sm text-muted-foreground">
              Clique em &quot;Adicionar produto&quot; para começar.
            </p>
          </div>
        )}
      </div>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Editar produto" : "Adicionar produto"}</DialogTitle>
            <DialogDescription>
              {editingProduct
                ? "Atualize as informações do produto."
                : "Preencha os dados para cadastrar um novo produto."}
            </DialogDescription>
          </DialogHeader>
          <AdminProductForm
            initialData={editingProduct ?? undefined}
            onSubmit={handleSubmit}
            onCancel={() => setFormOpen(false)}
            submitLabel={editingProduct ? "Salvar alterações" : "Adicionar produto"}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Excluir produto</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir &quot;{deleteTarget?.name}&quot;? Essa ação não pode
              ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
