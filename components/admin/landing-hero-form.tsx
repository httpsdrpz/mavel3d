"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { updateHeroAction } from "@/app/admin/(protected)/landing/actions";
import type { HeroContent } from "@/lib/types";
import { useSaveShortcut } from "@/hooks/use-save-shortcut";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MediaPickerButton } from "@/components/admin/media-picker-dialog";

const schema = z.object({
  badge: z.string().min(1, "Informe o texto do selo"),
  headline: z.string().min(4, "Informe o título"),
  headlineHighlight: z.string().optional(),
  subheadline: z.string().min(4, "Informe o subtítulo"),
  primaryButtonText: z.string().min(1, "Informe o texto do botão"),
  primaryButtonLink: z.string().min(1, "Informe o link do botão"),
  secondaryButtonText: z.string().min(1, "Informe o texto do botão"),
  secondaryButtonLink: z.string().min(1, "Informe o link do botão"),
  imageUrl: z.string().optional(),
  backgroundImageUrl: z.string().optional(),
});

type Values = z.infer<typeof schema>;

export function LandingHeroForm({ hero }: { hero: HeroContent }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    values: {
      badge: hero.badge,
      headline: hero.headline,
      headlineHighlight: hero.headlineHighlight,
      subheadline: hero.subheadline,
      primaryButtonText: hero.primaryButtonText,
      primaryButtonLink: hero.primaryButtonLink,
      secondaryButtonText: hero.secondaryButtonText,
      secondaryButtonLink: hero.secondaryButtonLink,
      imageUrl: hero.imageUrl,
      backgroundImageUrl: hero.backgroundImageUrl,
    },
  });

  async function handleFormSubmit(values: Values) {
    try {
      await updateHeroAction({
        badge: values.badge,
        headline: values.headline,
        headlineHighlight: values.headlineHighlight ?? "",
        subheadline: values.subheadline,
        primaryButtonText: values.primaryButtonText,
        primaryButtonLink: values.primaryButtonLink,
        secondaryButtonText: values.secondaryButtonText,
        secondaryButtonLink: values.secondaryButtonLink,
        imageUrl: values.imageUrl ?? "",
        backgroundImageUrl: values.backgroundImageUrl ?? "",
      });
      toast.success("Hero atualizado com sucesso");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível salvar o Hero");
    }
  }

  useSaveShortcut(() => handleSubmit(handleFormSubmit)());

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="hero-badge">Selo (acima do título)</Label>
        <Input id="hero-badge" {...register("badge")} />
        {errors.badge && <p className="text-xs text-destructive">{errors.badge.message}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="hero-headline">Headline</Label>
        <Textarea id="hero-headline" rows={2} {...register("headline")} />
        {errors.headline && <p className="text-xs text-destructive">{errors.headline.message}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="hero-headline-highlight">Trecho em destaque no título</Label>
        <Input id="hero-headline-highlight" {...register("headlineHighlight")} />
        <p className="text-xs text-muted-foreground">
          Deve ser um trecho exato da headline acima — recebe o gradiente roxo.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="hero-subheadline">Subheadline</Label>
        <Textarea id="hero-subheadline" rows={3} {...register("subheadline")} />
        {errors.subheadline && (
          <p className="text-xs text-destructive">{errors.subheadline.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="hero-primary-text">Botão principal — texto</Label>
          <Input id="hero-primary-text" {...register("primaryButtonText")} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="hero-primary-link">Botão principal — link</Label>
          <Input id="hero-primary-link" {...register("primaryButtonLink")} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="hero-secondary-text">Botão secundário — texto</Label>
          <Input id="hero-secondary-text" {...register("secondaryButtonText")} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="hero-secondary-link">Botão secundário — link</Label>
          <Input id="hero-secondary-link" {...register("secondaryButtonLink")} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Imagem principal</Label>
        <Controller
          name="imageUrl"
          control={control}
          render={({ field }) => (
            <MediaPickerButton folder="landing" value={field.value ?? ""} onChange={field.onChange} />
          )}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Imagem de fundo (opcional)</Label>
        <Controller
          name="backgroundImageUrl"
          control={control}
          render={({ field }) => (
            <MediaPickerButton folder="landing" value={field.value ?? ""} onChange={field.onChange} />
          )}
        />
      </div>

      <div className="flex justify-end border-t border-border pt-5">
        <Button type="submit" disabled={isSubmitting}>
          Salvar Hero
        </Button>
      </div>
    </form>
  );
}
