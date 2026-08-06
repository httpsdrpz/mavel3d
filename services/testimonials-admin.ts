import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import type { Testimonial } from "@/lib/types";

import { TESTIMONIAL_COLUMNS, mapRowToTestimonial, type TestimonialRow } from "./testimonials-shared";

export type TestimonialInput = Omit<Testimonial, "id" | "sortOrder">;

/**
 * Admin-only testimonial writes. Service-role key (bypasses RLS), only ever
 * imported from a Server Action gated by `requireAdminSession()`.
 */
export async function createTestimonial(input: TestimonialInput): Promise<Testimonial> {
  const supabase = createAdminClient();

  const { count } = await supabase
    .from("testimonials")
    .select("id", { count: "exact", head: true });

  const { data, error } = await supabase
    .from("testimonials")
    .insert({
      name: input.name,
      role: input.role,
      photo_url: input.photoUrl,
      text: input.text,
      rating: input.rating,
      sort_order: count ?? 0,
    })
    .select(TESTIMONIAL_COLUMNS)
    .single();

  if (error) throw new Error(error.message);
  return mapRowToTestimonial(data as TestimonialRow);
}

export async function updateTestimonial(id: string, input: TestimonialInput): Promise<Testimonial> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("testimonials")
    .update({
      name: input.name,
      role: input.role,
      photo_url: input.photoUrl,
      text: input.text,
      rating: input.rating,
    })
    .eq("id", id)
    .select(TESTIMONIAL_COLUMNS)
    .single();

  if (error) throw new Error(error.message);
  return mapRowToTestimonial(data as TestimonialRow);
}

export async function deleteTestimonial(id: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function reorderTestimonials(orderedIds: string[]): Promise<void> {
  const supabase = createAdminClient();
  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("testimonials").update({ sort_order: index }).eq("id", id)
    )
  );
}
