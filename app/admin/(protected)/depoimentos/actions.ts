"use server";

import { revalidatePath } from "next/cache";

import { requireAdminSession } from "@/lib/supabase/admin";
import {
  createTestimonial,
  deleteTestimonial,
  reorderTestimonials,
  updateTestimonial,
  type TestimonialInput,
} from "@/services/testimonials-admin";
import type { Testimonial } from "@/lib/types";

function revalidateStorefront() {
  revalidatePath("/");
  revalidatePath("/admin/depoimentos");
}

export async function createTestimonialAction(input: TestimonialInput): Promise<Testimonial> {
  await requireAdminSession();
  const item = await createTestimonial(input);
  revalidateStorefront();
  return item;
}

export async function updateTestimonialAction(
  id: string,
  input: TestimonialInput
): Promise<Testimonial> {
  await requireAdminSession();
  const item = await updateTestimonial(id, input);
  revalidateStorefront();
  return item;
}

export async function deleteTestimonialAction(id: string): Promise<void> {
  await requireAdminSession();
  await deleteTestimonial(id);
  revalidateStorefront();
}

export async function reorderTestimonialsAction(orderedIds: string[]): Promise<void> {
  await requireAdminSession();
  await reorderTestimonials(orderedIds);
  revalidateStorefront();
}
