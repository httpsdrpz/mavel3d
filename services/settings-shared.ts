import type { StoreSettings } from "@/lib/types";

/** Shape of the singleton row (id = 1) in the Postgres `site_settings` table (snake_case). */
export interface SettingsRow {
  store_name: string;
  logo_url: string;
  favicon_url: string;
  primary_color: string;
  secondary_color: string;
  phone: string;
  email: string;
  instagram: string;
  facebook: string;
  whatsapp: string;
  address: string;
  copyright_text: string;
  currency: string;
  default_shipping_rate: number;
}

export const SETTINGS_COLUMNS =
  "store_name, logo_url, favicon_url, primary_color, secondary_color, phone, email, instagram, facebook, whatsapp, address, copyright_text, currency, default_shipping_rate";

export function mapRowToSettings(row: SettingsRow): StoreSettings {
  return {
    storeName: row.store_name,
    logoUrl: row.logo_url || undefined,
    faviconUrl: row.favicon_url || undefined,
    primaryColor: row.primary_color,
    secondaryColor: row.secondary_color,
    phone: row.phone,
    email: row.email,
    instagram: row.instagram || undefined,
    facebook: row.facebook || undefined,
    whatsapp: row.whatsapp || undefined,
    address: row.address,
    copyrightText: row.copyright_text,
    currency: row.currency,
    defaultShippingRate: row.default_shipping_rate,
  };
}

export function mapSettingsToRow(input: StoreSettings) {
  return {
    store_name: input.storeName,
    logo_url: input.logoUrl ?? "",
    favicon_url: input.faviconUrl ?? "",
    primary_color: input.primaryColor,
    secondary_color: input.secondaryColor,
    phone: input.phone,
    email: input.email,
    instagram: input.instagram ?? "",
    facebook: input.facebook ?? "",
    whatsapp: input.whatsapp ?? "",
    address: input.address,
    copyright_text: input.copyrightText,
    currency: input.currency,
    default_shipping_rate: input.defaultShippingRate,
  };
}
