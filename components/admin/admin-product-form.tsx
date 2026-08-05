"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { categories } from "@/lib/products";
import type { Product } from "@/lib/types";
import type { ProductInput } from "@/context/products-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const productSchema = z.object({
  name: z.string().min(2, "Informe o nome do produto"),
  description: z.string().min(10, "Descreva o produto com pelo menos 10 caracteres"),
  category: z.enum(categories as [string, ...string[]]),
  price: z.number().positive("O preço deve ser maior que zero"),
  compareAtPrice: z.number().positive("O preço deve ser maior que zero").optional(),
  stock: z.number().int().min(0, "O estoque não pode ser negativo"),
  imageUrl: z.string().url("Informe uma URL de imagem válida"),
  featured: z.boolean(),
  isNew: z.boolean(),
});

export type ProductFormValues = z.infer<typeof productSchema>;

interface AdminProductFormProps {
  initialData?: Product;
  onSubmit: (data: ProductInput) => void;
  onCancel: () => void;
  submitLabel?: string;
}

export function AdminProductForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Salvar produto",
}: AdminProductFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      category: initialData?.category ?? categories[0],
      price: initialData?.price ?? 0,
      compareAtPrice: initialData?.compareAtPrice,
      stock: initialData?.stock ?? 0,
      imageUrl: initialData?.images[0] ?? "",
      featured: initialData?.featured ?? false,
      isNew: initialData?.isNew ?? false,
    },
  });

  function handleFormSubmit(values: ProductFormValues) {
    onSubmit({
      name: values.name,
      description: values.description,
      category: values.category as Product["category"],
      price: values.price,
      compareAtPrice: values.compareAtPrice,
      stock: values.stock,
      images: [values.imageUrl],
      featured: values.featured,
      isNew: values.isNew,
    });
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Nome</Label>
        <Input id="name" placeholder="Ex: Aether Pro Wireless" {...register("name")} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          placeholder="Descreva os principais destaques do produto"
          {...register("description")}
        />
        {errors.description && (
          <p className="text-xs text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="category">Categoria</Label>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="stock">Estoque</Label>
          <Input id="stock" type="number" min={0} {...register("stock", { valueAsNumber: true })} />
          {errors.stock && <p className="text-xs text-destructive">{errors.stock.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="price">Preço (R$)</Label>
          <Input
            id="price"
            type="number"
            min={0}
            step="0.01"
            {...register("price", { valueAsNumber: true })}
          />
          {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="compareAtPrice">Preço original (opcional)</Label>
          <Input
            id="compareAtPrice"
            type="number"
            min={0}
            step="0.01"
            {...register("compareAtPrice", {
              setValueAs: (v) => (v === "" ? undefined : Number(v)),
            })}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="imageUrl">URL da imagem</Label>
        <Input id="imageUrl" placeholder="https://..." {...register("imageUrl")} />
        {errors.imageUrl && (
          <p className="text-xs text-destructive">{errors.imageUrl.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between rounded-xl border border-border p-4">
        <div>
          <p className="text-sm font-medium">Produto em destaque</p>
          <p className="text-xs text-muted-foreground">Aparece na página inicial</p>
        </div>
        <Controller
          name="featured"
          control={control}
          render={({ field }) => (
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          )}
        />
      </div>

      <div className="flex items-center justify-between rounded-xl border border-border p-4">
        <div>
          <p className="text-sm font-medium">Marcar como novo</p>
          <p className="text-xs text-muted-foreground">Exibe o badge &quot;Novo&quot;</p>
        </div>
        <Controller
          name="isNew"
          control={control}
          render={({ field }) => (
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          )}
        />
      </div>

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
