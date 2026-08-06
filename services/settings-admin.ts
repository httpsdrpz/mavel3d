import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import type { StoreSettings } from "@/lib/types";

import { SETTINGS_COLUMNS, mapRowToSettings, mapSettingsToRow, type SettingsRow } from "./settings-shared";

/**
 * Admin-only settings write. Service-role key (bypasses RLS), only ever
 * imported from a Server Action gated by `requireAdminSession()`.
 */
export async function updateSettings(input: StoreSettings): Promise<StoreSettings> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("site_settings")
    .update(mapSettingsToRow(input))
    .eq("id", 1)
    .select(SETTINGS_COLUMNS)
    .single();

  if (error) throw new Error(error.message);
  return mapRowToSettings(data as SettingsRow);
}
