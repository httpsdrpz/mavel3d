"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Copy,
  MoreHorizontal,
  Package,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import { toast } from "sonner";

import { deleteProductAction, duplicateProductAction } from "@/app/admin/(protected)/produtos/actions";
import { useCategories } from "@/context/categories-context";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { SearchInput } from "@/components/admin/search-input";
import { Pagination } from "@/components/admin/pagination";
import { EmptyState } from "@/components/admin/empty-state";
import { DeleteDialog } from "@/components/admin/delete-dialog";

type SortKey = "name" | "price" | "stock";
type SortDir = "asc" | "desc";

const PAGE_SIZE = 8;

function SortHeader({
  label,
  sortField,
  sortKey,
  sortDir,
  onToggle,
}: {
  label: string;
  sortField: SortKey;
  sortKey: SortKey | null;
  sortDir: SortDir;
  onToggle: (key: SortKey) => void;
}) {
  const active = sortKey === sortField;
  const Icon = active ? (sortDir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
  return (
    <button
      onClick={() => onToggle(sortField)}
      className={cn(
        "flex items-center gap-1 transition-colors hover:text-foreground",
        active && "text-foreground"
      )}
    >
      {label}
      <Icon className="size-3.5" />
    </button>
  );
}

export function ProductTable({ products }: { products: Product[] }) {
  const router = useRouter();
  const { categories } = useCategories();

  const [query, setQuery] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [featuredFilter, setFeaturedFilter] = React.useState("all");
  const [sortKey, setSortKey] = React.useState<SortKey | null>(null);
  const [sortDir, setSortDir] = React.useState<SortDir>("asc");
  const [page, setPage] = React.useState(1);
  const [deleteTarget, setDeleteTarget] = React.useState<Product | null>(null);

  const filtered = React.useMemo(() => {
    let list = products;

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
    }

    if (categoryFilter !== "all") {
      list = list.filter((p) => p.category === categoryFilter);
    }

    if (statusFilter !== "all") {
      list = list.filter((p) => (statusFilter === "ativo" ? p.active : !p.active));
    }

    if (featuredFilter !== "all") {
      list = list.filter((p) => (featuredFilter === "sim" ? p.featured : !p.featured));
    }

    if (sortKey) {
      const dir = sortDir === "asc" ? 1 : -1;
      list = [...list].sort((a, b) => {
        if (sortKey === "name") return a.name.localeCompare(b.name) * dir;
        if (sortKey === "price") return (a.price - b.price) * dir;
        return (a.stock - b.stock) * dir;
      });
    }

    return list;
  }, [products, query, categoryFilter, statusFilter, featuredFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const [lastFilteredLength, setLastFilteredLength] = React.useState(filtered.length);
  if (filtered.length !== lastFilteredLength) {
    setLastFilteredLength(filtered.length);
    if (page !== 1) setPage(1);
  }

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function toggleSort(key: SortKey) {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
      return;
    }
    setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
  }

  async function handleDuplicate(id: string) {
    try {
      await duplicateProductAction(id);
      toast.success("Produto duplicado");
      router.refresh();
    } catch {
      toast.error("Não foi possível duplicar o produto");
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteProductAction(id);
      toast.success("Produto excluído");
      setDeleteTarget(null);
      router.refresh();
    } catch {
      toast.error("Não foi possível excluir o produto");
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-white">
      <div className="flex flex-col gap-4 border-b border-border p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Produtos</h2>
            <p className="text-sm text-muted-foreground">Gerencie o catálogo da sua loja.</p>
          </div>
          <Button asChild>
            <Link href="/admin/produtos/novo">
              <Plus /> Novo produto
            </Link>
          </Button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchInput
            value={query}
            onValueChange={setQuery}
            placeholder="Buscar por nome ou SKU..."
            className="sm:max-w-xs"
          />

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="sm:w-44">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.name}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="sm:w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos status</SelectItem>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
            </SelectContent>
          </Select>

          <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
            <SelectTrigger className="sm:w-36">
              <SelectValue placeholder="Destaque" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Destaque: todos</SelectItem>
              <SelectItem value="sim">Em destaque</SelectItem>
              <SelectItem value="nao">Sem destaque</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Imagem</TableHead>
            <TableHead>
              <SortHeader label="Nome" sortField="name" sortKey={sortKey} sortDir={sortDir} onToggle={toggleSort} />
            </TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>
              <SortHeader label="Preço" sortField="price" sortKey={sortKey} sortDir={sortDir} onToggle={toggleSort} />
            </TableHead>
            <TableHead>
              <SortHeader label="Estoque" sortField="stock" sortKey={sortKey} sortDir={sortDir} onToggle={toggleSort} />
            </TableHead>
            <TableHead>Destaque</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.map((product) => (
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
                <span className="font-medium text-foreground">{product.name}</span>
                <p className="text-xs text-muted-foreground">{product.sku}</p>
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
              <TableCell>
                {product.featured ? <Badge variant="purple">Destaque</Badge> : <span className="text-muted-foreground">—</span>}
              </TableCell>
              <TableCell>
                <Badge variant={product.active ? "success" : "outline"}>
                  {product.active ? "Ativo" : "Inativo"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Ações do produto">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onSelect={() => router.push(`/admin/produtos/${product.id}`)}>
                      <Pencil /> Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleDuplicate(product.id)}>
                      <Copy /> Duplicar
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" onSelect={() => setDeleteTarget(product)}>
                      <Trash2 /> Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {filtered.length === 0 && (
        <EmptyState
          icon={Package}
          title="Nenhum produto encontrado"
          description="Ajuste os filtros ou cadastre um novo produto."
        />
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <DeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        description={`Tem certeza que deseja excluir "${deleteTarget?.name}"? Essa ação não pode ser desfeita.`}
        onConfirm={() => deleteTarget && handleDelete(deleteTarget.id)}
      />
    </div>
  );
}
