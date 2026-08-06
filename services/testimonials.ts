import { createPublicClient } from "@/lib/supabase/public";
import type { Testimonial } from "@/lib/types";

import { TESTIMONIAL_COLUMNS, mapRowToTestimonial, type TestimonialRow } from "./testimonials-shared";

/**
 * Public testimonials read. Safe to call from Server Components, Server
 * Actions, or Client Components (mirrors services/products.ts) — RLS lets
 * `anon` select every row, no writes are possible with this client.
 */
export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select(TESTIMONIAL_COLUMNS)
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);
  return (data as TestimonialRow[]).map(mapRowToTestimonial);
}
