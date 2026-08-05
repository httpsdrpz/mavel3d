"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check } from "lucide-react";

import { CATEGORY_ICON_OPTIONS, CATEGORY_COLOR_OPTIONS } from "@/lib/categories";
import type { ProductCategory } from "@/lib/types";
import type { CategoryInput } from "@/context/categories-context";
import { useSaveShortcut } from "@/hooks/use-save-shortcut";
import { DynamicIcon } from "@/components/dynamic-icon";

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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categorySchema = z.object({
  name: z.string().min(2, "Informe o nome da categoria"),
  icon: z.string().min(1, "Selecione um ícone"),
  color: z.string().min(1, "Selecione uma cor"),
  description: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: ProductCategory;
  onSubmit: (data: CategoryInput) => void;
}

export function CategoryFormDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
}: CategoryFormDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initialData?.name ?? "",
      icon: initialData?.icon ?? CATEGORY_ICON_OPTIONS[0],
      color: initialData?.color ?? CATEGORY_COLOR_OPTIONS[0],
      description: initialData?.description ?? "",
    },
  });

  React.useEffect(() => {
    if (!open) return;
    reset({
      name: initialData?.name ?? "",
      icon: initialData?.icon ?? CATEGORY_ICON_OPTIONS[0],
      color: initialData?.color ?? CATEGORY_COLOR_OPTIONS[0],
      description: initialData?.description ?? "",
    });
  }, [open, initialData, reset]);

  function handleFormSubmit(values: CategoryFormValues) {
    onSubmit({
      name: values.name,
      icon: values.icon,
      color: values.color,
      description: values.description,
    });
    onOpenChange(false);
  }

  useSaveShortcut(() => handleSubmit(handleFormSubmit)(), open);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{initialData ? "Editar categoria" : "Nova categoria"}</DialogTitle>
          <DialogDescription>
            {initialData
              ? "Atualize as informações da categoria."
              : "Preencha os dados para criar uma nova categoria."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            // Radix Dialog content is portaled outside the DOM, but React still
            // bubbles synthetic events through the *component* tree — without this,
            // submitting this form also submits an ancestor <form> (e.g. ProductForm).
            e.stopPropagation();
            handleSubmit(handleFormSubmit)(e);
          }}
          className="flex flex-col gap-5"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="cat-name">Nome</Label>
            <Input id="cat-name" placeholder="Ex: Fones" {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="cat-icon">Ícone</Label>
            <Controller
              name="icon"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="cat-icon">
                    <SelectValue>
                      <span className="flex items-center gap-2">
                        <DynamicIcon name={field.value} className="size-4" />
                        {field.value}
                      </span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_ICON_OPTIONS.map((icon) => (
                      <SelectItem key={icon} value={icon}>
                        <span className="flex items-center gap-2">
                          <DynamicIcon name={icon} className="size-4" />
                          {icon}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Cor</Label>
            <Controller
              name="color"
              control={control}
              render={({ field }) => (
                <div className="flex flex-wrap gap-2">
                  {CATEGORY_COLOR_OPTIONS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => field.onChange(color)}
                      className="flex size-9 items-center justify-center rounded-full border-2 transition-transform"
                      style={{
                        backgroundColor: color,
                        borderColor: field.value === color ? "var(--foreground)" : "transparent",
                      }}
                      aria-label={color}
                    >
                      {field.value === color && <Check className="size-4 text-white" />}
                    </button>
                  ))}
                </div>
              )}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="cat-description">Descrição</Label>
            <Textarea
              id="cat-description"
              placeholder="Descreva a categoria (opcional)"
              {...register("description")}
            />
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {initialData ? "Salvar alterações" : "Criar categoria"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
