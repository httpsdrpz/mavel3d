"use server";

import { revalidatePath } from "next/cache";

import { requireAdminSession } from "@/lib/supabase/admin";
import { updateSettings } from "@/services/settings-admin";
import type { StoreSettings } from "@/lib/types";

export async function updateSettingsAction(input: StoreSettings): Promise<StoreSettings> {
  await requireAdminSession();
  const settings = await updateSettings(input);
  revalidatePath("/");
  revalidatePath("/produtos");
  revalidatePath("/admin");
  return settings;
}
