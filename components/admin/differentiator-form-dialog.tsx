"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { DIFFERENTIATOR_ICON_OPTIONS } from "@/lib/landing-defaults";
import type { Differentiator } from "@/lib/types";
import type { DifferentiatorInput } from "@/services/landing-admin";
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
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const schema = z.object({
  title: z.string().min(2, "Informe o título"),
  description: z.string().min(2, "Informe a descrição"),
  icon: z.string().min(1, "Selecione um ícone"),
});

type Values = z.infer<typeof schema>;

interface DifferentiatorFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Differentiator;
  onSubmit: (data: DifferentiatorInput) => void | Promise<void>;
}

export function DifferentiatorFormDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
}: DifferentiatorFormDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    values: {
      title: initialData?.title ?? "",
      description: initialData?.description ?? "",
      icon: initialData?.icon ?? DIFFERENTIATOR_ICON_OPTIONS[0],
    },
  });

  async function handleFormSubmit(values: Values) {
    await onSubmit(values);
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
          <DialogTitle>{initialData ? "Editar diferencial" : "Novo diferencial"}</DialogTitle>
          <DialogDescription>Diferenciais aparecem na Home, na seção &quot;Nossos diferenciais&quot;.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="diff-title">Título</Label>
            <Input id="diff-title" {...register("title")} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="diff-description">Descrição</Label>
            <Textarea id="diff-description" rows={2} {...register("description")} />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="diff-icon">Ícone</Label>
            <Controller
              name="icon"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="diff-icon">
                    <SelectValue>
                      <span className="flex items-center gap-2">
                        <DynamicIcon name={field.value} className="size-4" />
                        {field.value}
                      </span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {DIFFERENTIATOR_ICON_OPTIONS.map((icon) => (
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

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              Salvar diferencial
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
