import type { StoreSettings } from "./types";

/** Turns the handles/numbers stored in site_settings into clickable URLs. */
export function buildSocialLinks(settings: Pick<StoreSettings, "instagram" | "facebook" | "whatsapp">) {
  const instagramHandle = settings.instagram?.replace(/^@/, "").trim();
  const whatsappDigits = settings.whatsapp?.replace(/\D/g, "");

  return {
    instagramUrl: instagramHandle ? `https://instagram.com/${instagramHandle}` : undefined,
    facebookUrl: settings.facebook ? `https://facebook.com/${settings.facebook.trim()}` : undefined,
    whatsappUrl: whatsappDigits ? `https://wa.me/55${whatsappDigits}` : undefined,
  };
}
