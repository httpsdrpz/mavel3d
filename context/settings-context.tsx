"use client";

import * as React from "react";
import { toast } from "sonner";

import { updateSettingsAction } from "@/app/admin/(protected)/configuracoes/actions";
import { getSettings } from "@/services/settings";
import { DEFAULT_SETTINGS } from "@/lib/settings";
import type { StoreSettings } from "@/lib/types";

interface SettingsContextValue {
  settings: StoreSettings;
  updateSettings: (input: StoreSettings) => Promise<void>;
  isReady: boolean;
}

const SettingsContext = React.createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = React.useState<StoreSettings>(DEFAULT_SETTINGS);
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    getSettings()
      .then((data) => {
        if (!cancelled) setSettings(data);
      })
      .catch(() => {
        // falls back to DEFAULT_SETTINGS if Supabase isn't reachable
      })
      .finally(() => {
        if (!cancelled) setIsReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  React.useEffect(() => {
    if (!isReady) return;
    document.documentElement.style.setProperty("--primary", settings.primaryColor);
  }, [settings.primaryColor, isReady]);

  const updateSettings = React.useCallback(async (input: StoreSettings) => {
    try {
      const saved = await updateSettingsAction(input);
      setSettings(saved);
      toast.success("Configurações salvas com sucesso");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Não foi possível salvar as configurações"
      );
      throw error;
    }
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, isReady }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = React.useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings deve ser usado dentro de SettingsProvider");
  return ctx;
}
