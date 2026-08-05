import { getItem, setItem } from "./storage";
import { DEFAULT_SETTINGS } from "@/lib/settings";
import type { StoreSettings } from "@/lib/types";

const KEY = "marvel-settings";

export function getSettings(): StoreSettings {
  return getItem<StoreSettings>(KEY, DEFAULT_SETTINGS);
}

export function saveSettings(settings: StoreSettings) {
  setItem(KEY, settings);
}
