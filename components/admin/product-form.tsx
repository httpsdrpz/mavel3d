"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus } from "lucide-react";

import { useCategories } from "@/context/categories-context";
import type { ProductInput } from "@/services/products-admin";
import type { Product } from "@/lib/types";
import { slugify } from "@/lib/utils";
import { formatPrice } from "@/lib/format";
import { useSaveShortcut } from "@/hooks/use-save-shortcut";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ProductImageUpload } from "@/components/admin/product-image-upload";
import { CategoryFormDialog } from "@/components/admin/category-form-dialog";

const productSchema = z.object({
  name: z.string().min(2, "Informe o nome do produto"),
  slug: z.string().min(1, "Informe o slug"),
  shortDescription: z.string().min(5, "Informe uma descrição curta"),
  description: z.string().min(10, "Descreva o produto com pelo menos 10 caracteres"),
  category: z.string().min(1, "Selecione uma categoria"),
  price: z.number().positive("O preço deve ser maior que zero"),
  compareAtPrice: z.number().positive("O preço deve ser maior que zero").optional(),
  cost: z.number().min(0, "O custo não pode ser negativo"),
  stock: z.number().int().min(0, "O estoque não pode ser negativo"),
  sku: z.string().min(1, "Informe o SKU"),
  barcode: z.string().optional(),
  mainImage: z.string().url("Informe uma URL de imagem válida"),
  gallery: z.array(z.string()),
  featured: z.boolean(),
  isNew: z.boolean(),
  isPromotion: z.boolean(),
  active: z.boolean(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: ProductInput) => void | Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

const SECTIONS = [
  { value: "basicas", label: "Informações Básicas" },
  { value: "valores", label: "Valores" },
  { value: "estoque", label: "Estoque" },
  { value: "categoria", label: "Categoria" },
  { value: "imagens", label: "Imagens" },
  { value: "destaques", label: "Destaques" },
  { value: "seo", label: "SEO" },
];

export function ProductForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Salvar produto",
}: ProductFormProps) {
  const { categories, addCategory } = useCategories();
  const [categoryDialogOpen, setCategoryDialogOpen] = React.useState(false);
  const [slugTouched, setSlugTouched] = React.useState(Boolean(initialData));

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      slug: initialData?.slug ?? "",
      shortDescription: initialData?.shortDescription ?? "",
      description: initialData?.description ?? "",
      category: initialData?.category ?? categories[0]?.name ?? "",
      price: initialData?.price ?? 0,
      compareAtPrice: initialData?.compareAtPrice,
      cost: initialData?.cost ?? 0,
      stock: initialData?.stock ?? 0,
      sku: initialData?.sku ?? "",
      barcode: initialData?.barcode ?? "",
      mainImage: initialData?.images[0] ?? "",
      gallery: initialData?.images.slice(1) ?? [],
      featured: initialData?.featured ?? false,
      isNew: initialData?.isNew ?? false,
      isPromotion: initialData?.isPromotion ?? false,
      active: initialData?.active ?? true,
      metaTitle: initialData?.metaTitle ?? "",
      metaDescription: initialData?.metaDescription ?? "",
    },
  });

  const name = watch("name");
  const price = watch("price");
  const cost = watch("cost");
  const mainImage = watch("mainImage");
  const gallery = watch("gallery");

  const [lastAutoName, setLastAutoName] = React.useState(name);
  if (!slugTouched && name !== lastAutoName) {
    setLastAutoName(name);
    setValue("slug", slugify(name));
  }

  const margin = price > 0 ? ((price - cost) / price) * 100 : 0;

  function handleFormSubmit(values: ProductFormValues) {
    return onSubmit({
      name: values.name,
      slug: values.slug,
      shortDescription: values.shortDescription,
      description: values.description,
      category: values.category,
      price: values.price,
      compareAtPrice: values.compareAtPrice,
      cost: values.cost,
      stock: values.stock,
      sku: values.sku,
      barcode: values.barcode || undefined,
      images: [values.mainImage, ...values.gallery.filter(Boolean)],
      featured: values.featured,
      isNew: values.isNew,
      isPromotion: values.isPromotion,
      active: values.active,
      metaTitle: values.metaTitle || undefined,
      metaDescription: values.metaDescription || undefined,
    });
  }

  useSaveShortcut(() => handleSubmit(handleFormSubmit)());

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-6">
      <Tabs defaultValue="basicas">
        <div className="overflow-x-auto">
          <TabsList>
            {SECTIONS.map((section) => (
              <TabsTrigger key={section.value} value={section.value}>
                {section.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="basicas" className="flex flex-col gap-5 pt-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" placeholder="Ex: Aether Pro Wireless" {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              placeholder="aether-pro-wireless"
              {...register("slug", {
                onChange: () => setSlugTouched(true),
              })}
            />
            <p className="text-xs text-muted-foreground">Gerado automaticamente a partir do nome — pode ser editado.</p>
            {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="shortDescription">Descrição curta</Label>
            <Textarea
              id="shortDescription"
              placeholder="Um resumo do produto em uma frase"
              {...register("shortDescription")}
            />
            {errors.shortDescription && (
              <p className="text-xs text-destructive">{errors.shortDescription.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Descrição completa</Label>
            <Textarea
              id="description"
              rows={5}
              placeholder="Descreva os principais destaques do produto"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="valores" className="flex flex-col gap-5 pt-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
              <Label htmlFor="compareAtPrice">Preço promocional (opcional)</Label>
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

            <div className="flex flex-col gap-2">
              <Label htmlFor="cost">Custo (R$)</Label>
              <Input
                id="cost"
                type="number"
                min={0}
                step="0.01"
                {...register("cost", { valueAsNumber: true })}
              />
              {errors.cost && <p className="text-xs text-destructive">{errors.cost.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <Label>Margem (calculada automaticamente)</Label>
              <div className="flex h-11 items-center rounded-xl border border-border bg-secondary px-4 text-sm font-medium text-foreground">
                {margin.toFixed(1)}% {price > 0 && `(${formatPrice(price - cost)} por unidade)`}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="estoque" className="flex flex-col gap-5 pt-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="stock">Quantidade</Label>
              <Input id="stock" type="number" min={0} {...register("stock", { valueAsNumber: true })} />
              {errors.stock && <p className="text-xs text-destructive">{errors.stock.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="sku">SKU</Label>
              <Input id="sku" placeholder="Ex: SKU-AETHER-PRO" {...register("sku")} />
              {errors.sku && <p className="text-xs text-destructive">{errors.sku.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="barcode">Código de barras (opcional)</Label>
              <Input id="barcode" placeholder="Ex: 7891234567890" {...register("barcode")} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="categoria" className="flex flex-col gap-5 pt-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="category">Categoria</Label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <div className="flex gap-2">
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="category" className="flex-1">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setCategoryDialogOpen(true)}
                    aria-label="Nova categoria"
                  >
                    <Plus className="size-4" />
                  </Button>
                </div>
              )}
            />
            {errors.category && (
              <p className="text-xs text-destructive">{errors.category.message}</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="imagens" className="pt-4">
          <ProductImageUpload
            mainImage={mainImage}
            onMainImageChange={(url) => setValue("mainImage", url, { shouldValidate: true })}
            gallery={gallery}
            onGalleryChange={(urls) => setValue("gallery", urls)}
          />
          {errors.mainImage && (
            <p className="mt-2 text-xs text-destructive">{errors.mainImage.message}</p>
          )}
        </TabsContent>

        <TabsContent value="destaques" className="flex flex-col gap-3 pt-4">
          {(
            [
              ["featured", "Produto em destaque", "Aparece na página inicial"],
              ["isNew", "Novo produto", "Exibe o badge \"Novo\""],
              ["isPromotion", "Em promoção", "Marca o produto como promocional"],
              ["active", "Ativo", "Produto visível na loja"],
            ] as const
          ).map(([field, label, description]) => (
            <div key={field} className="flex items-center justify-between rounded-xl border border-border p-4">
              <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
              <Controller
                name={field}
                control={control}
                render={({ field: switchField }) => (
                  <Switch checked={switchField.value} onCheckedChange={switchField.onChange} />
                )}
              />
            </div>
          ))}
        </TabsContent>

        <TabsContent value="seo" className="flex flex-col gap-5 pt-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="metaTitle">Meta Title</Label>
            <Input id="metaTitle" placeholder="Título para mecanismos de busca" {...register("metaTitle")} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Textarea
              id="metaDescription"
              placeholder="Descrição para mecanismos de busca"
              {...register("metaDescription")}
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {submitLabel}
        </Button>
      </div>

      <CategoryFormDialog
        open={categoryDialogOpen}
        onOpenChange={setCategoryDialogOpen}
        onSubmit={(data) => {
          addCategory(data);
          // Deferred: Radix's dialog-close/focus-return effects run in the same
          // commit and can clobber a setValue made synchronously with them.
          setTimeout(() => setValue("category", data.name, { shouldValidate: true }), 0);
        }}
      />
    </form>
  );
}
