"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { updateCtaAction } from "@/app/admin/(protected)/landing/actions";
import type { CtaContent } from "@/lib/types";
import { useSaveShortcut } from "@/hooks/use-save-shortcut";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MediaPickerButton } from "@/components/admin/media-picker-dialog";

const schema = z.object({
  title: z.string().min(2, "Informe o título"),
  text: z.string().min(4, "Informe o texto"),
  primaryButtonText: z.string().min(1, "Informe o texto do botão"),
  primaryButtonLink: z.string().min(1, "Informe o link do botão"),
  secondaryButtonText: z.string().optional(),
  secondaryButtonLink: z.string().optional(),
  imageUrl: z.string().optional(),
});

type Values = z.infer<typeof schema>;

export function LandingCtaForm({ cta }: { cta: CtaContent }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    values: {
      title: cta.title,
      text: cta.text,
      primaryButtonText: cta.primaryButtonText,
      primaryButtonLink: cta.primaryButtonLink,
      secondaryButtonText: cta.secondaryButtonText,
      secondaryButtonLink: cta.secondaryButtonLink,
      imageUrl: cta.imageUrl,
    },
  });

  async function handleFormSubmit(values: Values) {
    try {
      await updateCtaAction({
        title: values.title,
        text: values.text,
        primaryButtonText: values.primaryButtonText,
        primaryButtonLink: values.primaryButtonLink,
        secondaryButtonText: values.secondaryButtonText ?? "",
        secondaryButtonLink: values.secondaryButtonLink ?? "",
        imageUrl: values.imageUrl ?? "",
      });
      toast.success("CTA final atualizado com sucesso");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível salvar o CTA final");
    }
  }

  useSaveShortcut(() => handleSubmit(handleFormSubmit)());

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="cta-title">Título</Label>
        <Input id="cta-title" {...register("title")} />
        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="cta-text">Texto</Label>
        <Textarea id="cta-text" rows={2} {...register("text")} />
        {errors.text && <p className="text-xs text-destructive">{errors.text.message}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="cta-primary-text">Botão — texto</Label>
          <Input id="cta-primary-text" {...register("primaryButtonText")} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="cta-primary-link">Botão — link</Label>
          <Input id="cta-primary-link" {...register("primaryButtonLink")} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="cta-secondary-text">Botão secundário — texto (opcional)</Label>
          <Input id="cta-secondary-text" {...register("secondaryButtonText")} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="cta-secondary-link">Botão secundário — link (opcional)</Label>
          <Input id="cta-secondary-link" {...register("secondaryButtonLink")} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Imagem (opcional)</Label>
        <Controller
          name="imageUrl"
          control={control}
          render={({ field }) => (
            <MediaPickerButton folder="landing" value={field.value ?? ""} onChange={field.onChange} />
          )}
        />
      </div>

      <div className="flex justify-end border-t border-border pt-5">
        <Button type="submit" disabled={isSubmitting}>
          Salvar CTA
        </Button>
      </div>
    </form>
  );
}
