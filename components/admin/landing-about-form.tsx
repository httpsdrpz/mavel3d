"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { updateAboutAction } from "@/app/admin/(protected)/landing/actions";
import type { AboutContent } from "@/lib/types";
import { useSaveShortcut } from "@/hooks/use-save-shortcut";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MediaPickerButton } from "@/components/admin/media-picker-dialog";

const schema = z.object({
  eyebrow: z.string().min(1, "Informe o texto de destaque"),
  title: z.string().min(4, "Informe o título"),
  text: z.string().min(10, "Informe o texto"),
  imageUrl: z.string().optional(),
});

type Values = z.infer<typeof schema>;

export function LandingAboutForm({ about }: { about: AboutContent }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    values: {
      eyebrow: about.eyebrow,
      title: about.title,
      text: about.text,
      imageUrl: about.imageUrl,
    },
  });

  async function handleFormSubmit(values: Values) {
    try {
      await updateAboutAction({
        eyebrow: values.eyebrow,
        title: values.title,
        text: values.text,
        imageUrl: values.imageUrl ?? "",
      });
      toast.success("Seção Sobre atualizada com sucesso");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível salvar a seção Sobre");
    }
  }

  useSaveShortcut(() => handleSubmit(handleFormSubmit)());

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="about-eyebrow">Texto de destaque</Label>
        <Input id="about-eyebrow" {...register("eyebrow")} />
        {errors.eyebrow && <p className="text-xs text-destructive">{errors.eyebrow.message}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="about-title">Título</Label>
        <Textarea id="about-title" rows={2} {...register("title")} />
        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="about-text">Texto</Label>
        <Textarea id="about-text" rows={4} {...register("text")} />
        {errors.text && <p className="text-xs text-destructive">{errors.text.message}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <Label>Imagem</Label>
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
          Salvar Sobre
        </Button>
      </div>
    </form>
  );
}
