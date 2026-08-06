"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, MessageSquareQuote, Pencil, Plus, Star, Trash2, User } from "lucide-react";

import {
  createTestimonialAction,
  deleteTestimonialAction,
  reorderTestimonialsAction,
  updateTestimonialAction,
} from "@/app/admin/(protected)/depoimentos/actions";
import type { Testimonial } from "@/lib/types";
import type { TestimonialInput } from "@/services/testimonials-admin";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/admin/empty-state";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { TestimonialFormDialog } from "@/components/admin/testimonial-form-dialog";

export function TestimonialsManager({ testimonials }: { testimonials: Testimonial[] }) {
  const router = useRouter();
  const [items, setItems] = React.useState(testimonials);
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Testimonial | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<Testimonial | null>(null);

  const [lastTestimonials, setLastTestimonials] = React.useState(testimonials);
  if (lastTestimonials !== testimonials) {
    setLastTestimonials(testimonials);
    setItems(testimonials);
  }

  function openAddForm() {
    setEditing(null);
    setFormOpen(true);
  }

  async function handleSubmit(data: TestimonialInput) {
    try {
      if (editing) {
        await updateTestimonialAction(editing.id, data);
        toast.success("Depoimento atualizado");
      } else {
        await createTestimonialAction(data);
        toast.success("Depoimento criado");
      }
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível salvar o depoimento");
    }
  }

  async function handleDelete(item: Testimonial) {
    try {
      await deleteTestimonialAction(item.id);
      toast.success("Depoimento excluído");
      setDeleteTarget(null);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível excluir o depoimento");
    }
  }

  async function handleMove(index: number, direction: -1 | 1) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const next = [...items];
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    setItems(next);

    try {
      await reorderTestimonialsAction(next.map((item) => item.id));
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível reordenar");
      setItems(items);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <Button onClick={openAddForm}>
          <Plus /> Novo depoimento
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-border bg-white">
          <EmptyState
            icon={MessageSquareQuote}
            title="Nenhum depoimento cadastrado"
            description="Clique em 'Novo depoimento' para começar."
          />
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center gap-4 rounded-2xl border border-border bg-white p-4"
            >
              <div className="relative size-12 shrink-0 overflow-hidden rounded-full bg-secondary">
                {item.photoUrl ? (
                  <Image src={item.photoUrl} alt={item.name} fill sizes="48px" className="object-cover" unoptimized />
                ) : (
                  <div className="flex size-full items-center justify-center text-muted-foreground">
                    <User className="size-5" />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground">{item.name}</p>
                  {item.role && <span className="text-xs text-muted-foreground">· {item.role}</span>}
                </div>
                <p className="line-clamp-1 text-sm text-muted-foreground">{item.text}</p>
              </div>

              <div className="flex shrink-0 items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "size-3.5",
                      i < item.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"
                    )}
                  />
                ))}
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
                  aria-label="Editar depoimento"
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeleteTarget(item)}
                  aria-label="Excluir depoimento"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <TestimonialFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        initialData={editing ?? undefined}
        onSubmit={handleSubmit}
      />

      <DeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        description={`Tem certeza que deseja excluir o depoimento de "${deleteTarget?.name}"?`}
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
      />
    </div>
  );
}
