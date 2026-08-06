"use server";

import { revalidatePath } from "next/cache";

import { requireAdminSession } from "@/lib/supabase/admin";
import {
  createDifferentiator,
  deleteDifferentiator,
  reorderDifferentiators,
  updateAboutContent,
  updateCtaContent,
  updateDifferentiator,
  updateHeroContent,
  type DifferentiatorInput,
} from "@/services/landing-admin";
import { setFeaturedProducts } from "@/services/products-admin";
import type { AboutContent, CtaContent, Differentiator, HeroContent, LandingContent } from "@/lib/types";

function revalidateStorefront() {
  revalidatePath("/");
  revalidatePath("/admin/landing");
}

export async function updateHeroAction(hero: HeroContent): Promise<LandingContent> {
  await requireAdminSession();
  const content = await updateHeroContent(hero);
  revalidateStorefront();
  return content;
}

export async function updateAboutAction(about: AboutContent): Promise<LandingContent> {
  await requireAdminSession();
  const content = await updateAboutContent(about);
  revalidateStorefront();
  return content;
}

export async function updateCtaAction(cta: CtaContent): Promise<LandingContent> {
  await requireAdminSession();
  const content = await updateCtaContent(cta);
  revalidateStorefront();
  return content;
}

export async function createDifferentiatorAction(input: DifferentiatorInput): Promise<Differentiator> {
  await requireAdminSession();
  const item = await createDifferentiator(input);
  revalidateStorefront();
  return item;
}

export async function updateDifferentiatorAction(
  id: string,
  input: DifferentiatorInput
): Promise<Differentiator> {
  await requireAdminSession();
  const item = await updateDifferentiator(id, input);
  revalidateStorefront();
  return item;
}

export async function deleteDifferentiatorAction(id: string): Promise<void> {
  await requireAdminSession();
  await deleteDifferentiator(id);
  revalidateStorefront();
}

export async function reorderDifferentiatorsAction(orderedIds: string[]): Promise<void> {
  await requireAdminSession();
  await reorderDifferentiators(orderedIds);
  revalidateStorefront();
}

export async function setFeaturedProductsAction(ids: string[]): Promise<void> {
  await requireAdminSession();
  await setFeaturedProducts(ids.slice(0, 3));
  revalidatePath("/");
  revalidatePath("/produtos");
  revalidatePath("/admin/produtos");
  revalidatePath("/admin/landing");
}
