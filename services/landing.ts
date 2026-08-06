import { createPublicClient } from "@/lib/supabase/public";
import type { Differentiator, LandingContent } from "@/lib/types";

import {
  DIFFERENTIATOR_COLUMNS,
  mapRowToDifferentiator,
  mapRowToLandingContent,
  type DifferentiatorRow,
  type LandingContentRow,
} from "./landing-shared";

/**
 * Public Landing content read. Safe to call from Server Components, Server
 * Actions, or Client Components (mirrors services/products.ts) — RLS lets
 * `anon` select both tables, no writes are possible with this client.
 */
export async function getLandingContent(): Promise<LandingContent> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("landing_content")
    .select("hero, about, cta")
    .eq("id", 1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return mapRowToLandingContent(data as LandingContentRow | null);
}

export async function getDifferentiators(): Promise<Differentiator[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("differentiators")
    .select(DIFFERENTIATOR_COLUMNS)
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);
  return (data as DifferentiatorRow[]).map(mapRowToDifferentiator);
}
