import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import type { AboutContent, CtaContent, Differentiator, HeroContent, LandingContent } from "@/lib/types";

import {
  DIFFERENTIATOR_COLUMNS,
  mapRowToDifferentiator,
  mapRowToLandingContent,
  type DifferentiatorRow,
  type LandingContentRow,
} from "./landing-shared";

/**
 * Admin-only Landing content writes. Service-role key (bypasses RLS), only
 * ever imported from a Server Action gated by `requireAdminSession()`.
 */

export async function updateHeroContent(hero: HeroContent): Promise<LandingContent> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("landing_content")
    .update({ hero })
    .eq("id", 1)
    .select("hero, about, cta")
    .single();
  if (error) throw new Error(error.message);
  return mapRowToLandingContent(data as LandingContentRow);
}

export async function updateAboutContent(about: AboutContent): Promise<LandingContent> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("landing_content")
    .update({ about })
    .eq("id", 1)
    .select("hero, about, cta")
    .single();
  if (error) throw new Error(error.message);
  return mapRowToLandingContent(data as LandingContentRow);
}

export async function updateCtaContent(cta: CtaContent): Promise<LandingContent> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("landing_content")
    .update({ cta })
    .eq("id", 1)
    .select("hero, about, cta")
    .single();
  if (error) throw new Error(error.message);
  return mapRowToLandingContent(data as LandingContentRow);
}

export type DifferentiatorInput = Omit<Differentiator, "id" | "sortOrder">;

export async function createDifferentiator(input: DifferentiatorInput): Promise<Differentiator> {
  const supabase = createAdminClient();

  const { count } = await supabase
    .from("differentiators")
    .select("id", { count: "exact", head: true });

  const { data, error } = await supabase
    .from("differentiators")
    .insert({
      title: input.title,
      description: input.description,
      icon: input.icon,
      sort_order: count ?? 0,
    })
    .select(DIFFERENTIATOR_COLUMNS)
    .single();

  if (error) throw new Error(error.message);
  return mapRowToDifferentiator(data as DifferentiatorRow);
}

export async function updateDifferentiator(
  id: string,
  input: DifferentiatorInput
): Promise<Differentiator> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("differentiators")
    .update({ title: input.title, description: input.description, icon: input.icon })
    .eq("id", id)
    .select(DIFFERENTIATOR_COLUMNS)
    .single();

  if (error) throw new Error(error.message);
  return mapRowToDifferentiator(data as DifferentiatorRow);
}

export async function deleteDifferentiator(id: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("differentiators").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function reorderDifferentiators(orderedIds: string[]): Promise<void> {
  const supabase = createAdminClient();
  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("differentiators").update({ sort_order: index }).eq("id", id)
    )
  );
}
