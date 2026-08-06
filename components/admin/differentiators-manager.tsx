"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Pencil, Plus, Sparkles, Trash2 } from "lucide-react";

import {
  createDifferentiatorAction,
  deleteDifferentiatorAction,
  reorderDifferentiatorsAction,
  updateDifferentiatorAction,
} from "@/app/admin/(protected)/landing/actions";
import type { Differentiator } from "@/lib/types";
import type { DifferentiatorInput } from "@/services/landing-admin";
import { DynamicIcon } from "@/components/dynamic-icon";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/admin/empty-state";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { DifferentiatorFormDialog } from "@/components/admin/differentiator-form-dialog";

export function DifferentiatorsManager({ differentiators }: { differentiators: Differentiator[] }) {
  const router = useRouter();
  const [items, setItems] = React.useState(differentiators);
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Differentiator | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<Differentiator | null>(null);

  const [lastDifferentiators, setLastDifferentiators] = React.useState(differentiators);
  if (lastDifferentiators !== differentiators) {
    setLastDifferentiators(differentiators);
    setItems(differentiators);
  }

  async function handleSubmit(data: DifferentiatorInput) {
    try {
      if (editing) {
        await updateDifferentiatorAction(editing.id, data);
        toast.success("Diferencial atualizado");
      } else {
        await createDifferentiatorAction(data);
        toast.success("Diferencial criado");
      }
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível salvar o diferencial");
    }
  }

  async function handleDelete(item: Differentiator) {
    try {
      await deleteDifferentiatorAction(item.id);
      toast.success("Diferencial excluído");
      setDeleteTarget(null);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível excluir o diferencial");
    }
  }

  async function handleMove(index: number, direction: -1 | 1) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const next = [...items];
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    setItems(next);

    try {
      await reorderDifferentiatorsAction(next.map((item) => item.id));
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível reordenar");
      setItems(items);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          <Plus /> Novo diferencial
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-border bg-white">
          <EmptyState
            icon={Sparkles}
            title="Nenhum diferencial cadastrado"
            description="Clique em 'Novo diferencial' para começar."
          />
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center gap-4 rounded-2xl border border-border bg-white p-4"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <DynamicIcon name={item.icon} className="size-5" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-medium text-foreground">{item.title}</p>
                <p className="line-clamp-1 text-sm text-muted-foreground">{item.description}</p>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={index === 0}
                  onClick={() => handleMove(index, -1)}
                  aria-label="Mover para cima"
                >
                  <ArrowUp className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={index === items.length - 1}
                  onClick={() => handleMove(index, 1)}
                  aria-label="Mover para baixo"
                >
                  <ArrowDown className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setEditing(item);
                    setFormOpen(true);
                  }}
                  aria-label="Editar diferencial"
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeleteTarget(item)}
                  aria-label="Excluir diferencial"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <DifferentiatorFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        initialData={editing ?? undefined}
        onSubmit={handleSubmit}
      />

      <DeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        description={`Tem certeza que deseja excluir o diferencial "${deleteTarget?.title}"?`}
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
      />
    </div>
  );
}
