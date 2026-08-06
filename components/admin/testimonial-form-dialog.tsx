"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Star } from "lucide-react";

import type { Testimonial } from "@/lib/types";
import type { TestimonialInput } from "@/services/testimonials-admin";
import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { MediaPickerButton } from "@/components/admin/media-picker-dialog";

const schema = z.object({
  name: z.string().min(2, "Informe o nome"),
  role: z.string().optional(),
  photoUrl: z.string().optional(),
  text: z.string().min(5, "Informe o depoimento"),
  rating: z.number().min(1).max(5),
});

type Values = z.infer<typeof schema>;

interface TestimonialFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Testimonial;
  onSubmit: (data: TestimonialInput) => void | Promise<void>;
}

function RatingInput({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} type="button" onClick={() => onChange(star)} aria-label={`${star} estrelas`}>
          <Star
            className={cn(
              "size-6 transition-colors",
              star <= value ? "fill-amber-400 text-amber-400" : "text-muted-foreground"
            )}
          />
        </button>
      ))}
    </div>
  );
}

export function TestimonialFormDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
}: TestimonialFormDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    values: {
      name: initialData?.name ?? "",
      role: initialData?.role ?? "",
      photoUrl: initialData?.photoUrl ?? "",
      text: initialData?.text ?? "",
      rating: initialData?.rating ?? 5,
    },
  });

  async function handleFormSubmit(values: Values) {
    await onSubmit({
      name: values.name,
      role: values.role ?? "",
      photoUrl: values.photoUrl ?? "",
      text: values.text,
      rating: values.rating,
    });
    reset();
    onOpenChange(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) reset();
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{initialData ? "Editar depoimento" : "Novo depoimento"}</DialogTitle>
          <DialogDescription>Depoimentos aparecem na Home, na seção &quot;O que dizem nossos clientes&quot;.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Foto</Label>
            <Controller
              name="photoUrl"
              control={control}
              render={({ field }) => (
                <MediaPickerButton folder="landing" value={field.value ?? ""} onChange={field.onChange} />
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="testimonial-name">Nome</Label>
              <Input id="testimonial-name" {...register("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="testimonial-role">Cargo</Label>
              <Input id="testimonial-role" placeholder="Ex: Cliente MAVEL" {...register("role")} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="testimonial-text">Depoimento</Label>
            <Textarea id="testimonial-text" rows={3} {...register("text")} />
            {errors.text && <p className="text-xs text-destructive">{errors.text.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label>Avaliação</Label>
            <Controller
              name="rating"
              control={control}
              render={({ field }) => <RatingInput value={field.value} onChange={field.onChange} />}
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              Salvar depoimento
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
