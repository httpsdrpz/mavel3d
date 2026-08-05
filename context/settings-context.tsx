"use client";

import * as React from "react";
import { toast } from "sonner";

import { DEFAULT_SETTINGS } from "@/lib/settings";
import { getSettings, saveSettings } from "@/services/settings.service";
import type { StoreSettings } from "@/lib/types";

interface SettingsContextValue {
  settings: StoreSettings;
  updateSettings: (input: StoreSettings) => void;
  isReady: boolean;
}

const SettingsContext = React.createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = React.useState<StoreSettings>(DEFAULT_SETTINGS);
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from a browser-only store; must run after mount to avoid an SSR mismatch
    setSettings(getSettings());
    setIsReady(true);
  }, []);

  React.useEffect(() => {
    if (!isReady) return;
    saveSettings(settings);
    document.documentElement.style.setProperty("--primary", settings.primaryColor);
  }, [settings, isReady]);

  const updateSettings = React.useCallback((input: StoreSettings) => {
    setSettings(input);
    toast.success("Configurações salvas com sucesso");
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
