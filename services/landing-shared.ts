import type { AboutContent, CtaContent, Differentiator, HeroContent, LandingContent } from "@/lib/types";
import { DEFAULT_ABOUT, DEFAULT_CTA, DEFAULT_HERO } from "@/lib/landing-defaults";

export interface LandingContentRow {
  hero: Partial<HeroContent> | null;
  about: Partial<AboutContent> | null;
  cta: Partial<CtaContent> | null;
}

export function mapRowToLandingContent(row: LandingContentRow | null): LandingContent {
  return {
    hero: { ...DEFAULT_HERO, ...(row?.hero ?? {}) },
    about: { ...DEFAULT_ABOUT, ...(row?.about ?? {}) },
    cta: { ...DEFAULT_CTA, ...(row?.cta ?? {}) },
  };
}

export interface DifferentiatorRow {
  id: string;
  title: string;
  description: string;
  icon: string;
  sort_order: number;
}

export const DIFFERENTIATOR_COLUMNS = "id, title, description, icon, sort_order";

export function mapRowToDifferentiator(row: DifferentiatorRow): Differentiator {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    icon: row.icon,
    sortOrder: row.sort_order,
  };
}
