"use client";

import type { Differentiator, LandingContent, Product, Testimonial } from "@/lib/types";
import { MavelNavbar } from "@/components/landing/mavel-navbar";
import { MavelHero } from "@/components/landing/mavel-hero";
import { MavelDifferentiators } from "@/components/landing/mavel-differentiators";
import { MavelFeaturedProducts } from "@/components/landing/mavel-featured-products";
import { MavelHowItWorks } from "@/components/landing/mavel-how-it-works";
import { MavelAbout } from "@/components/landing/mavel-about";
import { MavelTestimonials } from "@/components/landing/mavel-testimonials";
import { MavelCta } from "@/components/landing/mavel-cta";
import { MavelFooter } from "@/components/landing/mavel-footer";

interface MavelHomeProps {
  featuredProducts: Product[];
  content: LandingContent;
  differentiators: Differentiator[];
  testimonials: Testimonial[];
}

export function MavelHome({ featuredProducts, content, differentiators, testimonials }: MavelHomeProps) {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <MavelNavbar />
      <main className="flex flex-1 flex-col">
        <MavelHero hero={content.hero} />
        <MavelDifferentiators differentiators={differentiators} />
        <MavelFeaturedProducts products={featuredProducts} />
        <MavelHowItWorks />
        <MavelAbout about={content.about} />
        <MavelTestimonials testimonials={testimonials} />
        <MavelCta cta={content.cta} />
      </main>
      <MavelFooter />
    </div>
  );
}
