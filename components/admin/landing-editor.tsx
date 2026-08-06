"use client";

import type { Differentiator, LandingContent, Product, StoreSettings } from "@/lib/types";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LandingHeroForm } from "@/components/admin/landing-hero-form";
import { LandingFeaturedProductsForm } from "@/components/admin/landing-featured-products-form";
import { DifferentiatorsManager } from "@/components/admin/differentiators-manager";
import { LandingAboutForm } from "@/components/admin/landing-about-form";
import { LandingCtaForm } from "@/components/admin/landing-cta-form";
import { LandingFooterForm } from "@/components/admin/landing-footer-form";

const SECTIONS = [
  { value: "hero", label: "Hero" },
  { value: "destaques", label: "Destaques" },
  { value: "diferenciais", label: "Diferenciais" },
  { value: "sobre", label: "Sobre" },
  { value: "cta", label: "CTA Final" },
  { value: "rodape", label: "Rodapé" },
];

interface LandingEditorProps {
  content: LandingContent;
  differentiators: Differentiator[];
  products: Product[];
  settings: StoreSettings;
}

export function LandingEditor({ content, differentiators, products, settings }: LandingEditorProps) {
  return (
    <Tabs defaultValue="hero">
      <div className="overflow-x-auto">
        <TabsList>
          {SECTIONS.map((section) => (
            <TabsTrigger key={section.value} value={section.value}>
              {section.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <TabsContent value="hero" className="mt-6 rounded-2xl border border-border bg-white p-6">
        <LandingHeroForm hero={content.hero} />
      </TabsContent>
      <TabsContent value="destaques" className="mt-6">
        <LandingFeaturedProductsForm products={products} />
      </TabsContent>
      <TabsContent value="diferenciais" className="mt-6">
        <DifferentiatorsManager differentiators={differentiators} />
      </TabsContent>
      <TabsContent value="sobre" className="mt-6 rounded-2xl border border-border bg-white p-6">
        <LandingAboutForm about={content.about} />
      </TabsContent>
      <TabsContent value="cta" className="mt-6 rounded-2xl border border-border bg-white p-6">
        <LandingCtaForm cta={content.cta} />
      </TabsContent>
      <TabsContent value="rodape" className="mt-6 rounded-2xl border border-border bg-white p-6">
        <LandingFooterForm settings={settings} />
      </TabsContent>
    </Tabs>
  );
}
