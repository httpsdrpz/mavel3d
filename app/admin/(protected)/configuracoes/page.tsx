"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useSettings } from "@/context/settings-context";
import { DEFAULT_SETTINGS } from "@/lib/settings";
import { useSaveShortcut } from "@/hooks/use-save-shortcut";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller } from "react-hook-form";

const settingsSchema = z.object({
  storeName: z.string().min(2, "Informe o nome da loja"),
  logoUrl: z.string().optional(),
  primaryColor: z.string().min(1, "Selecione uma cor"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(8, "Telefone inválido"),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  whatsapp: z.string().optional(),
  address: z.string().min(3, "Informe o endereço"),
  currency: z.string().min(1),
  defaultShippingRate: z.number().min(0, "A taxa não pode ser negativa"),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

const CURRENCIES = [
  { value: "BRL", label: "Real (BRL)" },
  { value: "USD", label: "Dólar (USD)" },
  { value: "EUR", label: "Euro (EUR)" },
];

export default function SettingsPage() {
  const { settings, updateSettings, isReady } = useSettings();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      storeName: DEFAULT_SETTINGS.storeName,
      logoUrl: DEFAULT_SETTINGS.logoUrl ?? "",
      primaryColor: DEFAULT_SETTINGS.primaryColor,
      email: DEFAULT_SETTINGS.email,
      phone: DEFAULT_SETTINGS.phone,
      instagram: DEFAULT_SETTINGS.instagram ?? "",
      facebook: DEFAULT_SETTINGS.facebook ?? "",
      whatsapp: DEFAULT_SETTINGS.whatsapp ?? "",
      address: DEFAULT_SETTINGS.address,
      currency: DEFAULT_SETTINGS.currency,
      defaultShippingRate: DEFAULT_SETTINGS.defaultShippingRate,
    },
    values: {
      storeName: settings.storeName,
      logoUrl: settings.logoUrl ?? "",
      primaryColor: settings.primaryColor,
      email: settings.email,
      phone: settings.phone,
      instagram: settings.instagram ?? "",
      facebook: settings.facebook ?? "",
      whatsapp: settings.whatsapp ?? "",
      address: settings.address,
      currency: settings.currency,
      defaultShippingRate: settings.defaultShippingRate,
    },
  });

  function handleFormSubmit(values: SettingsFormValues) {
    updateSettings({
      storeName: values.storeName,
      logoUrl: values.logoUrl || undefined,
      primaryColor: values.primaryColor,
      email: values.email,
      phone: values.phone,
      instagram: values.instagram || undefined,
      facebook: values.facebook || undefined,
      whatsapp: values.whatsapp || undefined,
      address: values.address,
      currency: values.currency,
      defaultShippingRate: values.defaultShippingRate,
    });
  }

  useSaveShortcut(() => handleSubmit(handleFormSubmit)(), isReady);

  function handleReset() {
    reset();
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Configurações</h1>
        <p className="mt-1 text-muted-foreground">Gerencie as informações da sua loja.</p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-6">
        <section className="rounded-2xl border border-border bg-white p-6">
          <h2 className="mb-5 text-lg font-semibold text-foreground">Identidade da loja</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="storeName">Nome da loja</Label>
              <Input id="storeName" {...register("storeName")} />
              {errors.storeName && <p className="text-xs text-destructive">{errors.storeName.message}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="logoUrl">Logo (URL)</Label>
              <Input id="logoUrl" placeholder="https://..." {...register("logoUrl")} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="primaryColor">Cor primária</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  className="size-11 cursor-pointer rounded-xl border border-input bg-white p-1"
                  {...register("primaryColor")}
                />
                <Input {...register("primaryColor")} className="flex-1" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="currency">Moeda</Label>
              <Controller
                name="currency"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((currency) => (
                        <SelectItem key={currency.value} value={currency.value}>
                          {currency.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-white p-6">
          <h2 className="mb-5 text-lg font-semibold text-foreground">Contato</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" {...register("phone")} />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input id="instagram" placeholder="@sualoja" {...register("instagram")} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="facebook">Facebook</Label>
              <Input id="facebook" placeholder="sualoja" {...register("facebook")} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input id="whatsapp" {...register("whatsapp")} />
            </div>
            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="address">Endereço</Label>
              <Input id="address" {...register("address")} />
              {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-white p-6">
          <h2 className="mb-5 text-lg font-semibold text-foreground">Frete</h2>
          <div className="flex flex-col gap-2 sm:max-w-xs">
            <Label htmlFor="defaultShippingRate">Taxa de frete padrão (R$)</Label>
            <Input
              id="defaultShippingRate"
              type="number"
              min={0}
              step="0.01"
              {...register("defaultShippingRate", { valueAsNumber: true })}
            />
            {errors.defaultShippingRate && (
              <p className="text-xs text-destructive">{errors.defaultShippingRate.message}</p>
            )}
          </div>
        </section>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={handleReset}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting || !isReady}>
            Salvar configurações
          </Button>
        </div>
      </form>
    </div>
  );
}
