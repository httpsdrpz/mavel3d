import { createPublicClient } from "@/lib/supabase/public";
import { DEFAULT_SETTINGS } from "@/lib/settings";
import type { StoreSettings } from "@/lib/types";

import { SETTINGS_COLUMNS, mapRowToSettings, type SettingsRow } from "./settings-shared";

/**
 * Public settings read. Safe to call from Server Components, Server Actions,
 * or Client Components (mirrors services/products.ts) — RLS lets `anon`
 * select the singleton `site_settings` row, no writes are possible with this
 * client. Falls back to DEFAULT_SETTINGS if the row is somehow missing.
 */
export async function getSettings(): Promise<StoreSettings> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select(SETTINGS_COLUMNS)
    .eq("id", 1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? mapRowToSettings(data as SettingsRow) : DEFAULT_SETTINGS;
}
