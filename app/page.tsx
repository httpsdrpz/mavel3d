import type { Metadata } from "next";

import { getFeaturedProducts } from "@/services/products";
import { getDifferentiators, getLandingContent } from "@/services/landing";
import { getTestimonials } from "@/services/testimonials";
import { MavelHome } from "@/components/landing/mavel-home";

// Always reflects live `featured`/`active` state from Supabase — don't bake
// this in at build time (also avoids depending on Supabase being reachable
// during `next build`/deploys).
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "MAVEL — Impressão 3D Premium" },
  description:
    "Na MAVEL, transformamos ideias em produtos exclusivos com impressão 3D de alta precisão. Peças decorativas, utilitárias, colecionáveis e projetos personalizados com acabamento premium.",
};

export default async function Home() {
  const [featuredProducts, content, differentiators, testimonials] = await Promise.all([
    getFeaturedProducts(3),
    getLandingContent(),
    getDifferentiators(),
    getTestimonials(),
  ]);

  return (
    <MavelHome
      featuredProducts={featuredProducts}
      content={content}
      differentiators={differentiators}
      testimonials={testimonials}
    />
  );
}
