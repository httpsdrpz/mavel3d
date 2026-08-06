"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { updateSettingsAction } from "@/app/admin/(protected)/configuracoes/actions";
import type { StoreSettings } from "@/lib/types";
import { useSaveShortcut } from "@/hooks/use-save-shortcut";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MediaPickerButton } from "@/components/admin/media-picker-dialog";

const schema = z.object({
  logoUrl: z.string().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email("Email inválido"),
  address: z.string().min(3, "Informe o endereço"),
  copyrightText: z.string().min(1, "Informe o texto de copyright"),
});

type Values = z.infer<typeof schema>;

export function LandingFooterForm({ settings }: { settings: StoreSettings }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    values: {
      logoUrl: settings.logoUrl ?? "",
      instagram: settings.instagram ?? "",
      facebook: settings.facebook ?? "",
      whatsapp: settings.whatsapp ?? "",
      email: settings.email,
      address: settings.address,
      copyrightText: settings.copyrightText,
    },
  });

  async function handleFormSubmit(values: Values) {
    try {
      await updateSettingsAction({
        ...settings,
        logoUrl: values.logoUrl || undefined,
        instagram: values.instagram || undefined,
        facebook: values.facebook || undefined,
        whatsapp: values.whatsapp || undefined,
        email: values.email,
        address: values.address,
        copyrightText: values.copyrightText,
      });
      toast.success("Rodapé atualizado com sucesso");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível salvar o rodapé");
    }
  }

  useSaveShortcut(() => handleSubmit(handleFormSubmit)());

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-5">
      <p className="text-sm text-muted-foreground">
        Esses dados vêm de Configurações da Loja e alimentam o rodapé em todas as páginas.
      </p>

      <div className="flex flex-col gap-2">
        <Label>Logo</Label>
        <Controller
          name="logoUrl"
          control={control}
          render={({ field }) => (
            <MediaPickerButton folder="logos" value={field.value ?? ""} onChange={field.onChange} />
          )}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="footer-instagram">Instagram</Label>
          <Input id="footer-instagram" placeholder="@sualoja" {...register("instagram")} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="footer-facebook">Facebook</Label>
          <Input id="footer-facebook" placeholder="sualoja" {...register("facebook")} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="footer-whatsapp">WhatsApp</Label>
          <Input id="footer-whatsapp" {...register("whatsapp")} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="footer-email">Email</Label>
          <Input id="footer-email" type="email" {...register("email")} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="footer-address">Endereço</Label>
          <Input id="footer-address" {...register("address")} />
          {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
        </div>
        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="footer-copyright">Texto de copyright</Label>
          <Input id="footer-copyright" {...register("copyrightText")} />
          {errors.copyrightText && (
            <p className="text-xs text-destructive">{errors.copyrightText.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end border-t border-border pt-5">
        <Button type="submit" disabled={isSubmitting}>
          Salvar rodapé
        </Button>
      </div>
    </form>
  );
}
