import type { AboutContent, CtaContent, HeroContent } from "./types";

/**
 * Fallbacks used whenever `landing_content` is missing a key (e.g. right
 * after the row is created, or a partial jsonb update) — mirrors the copy
 * the Home originally shipped with, hardcoded in the mavel-* components.
 */

export const DEFAULT_HERO: HeroContent = {
  badge: "Impressão 3D Premium",
  headline: "Sua imaginação ganha forma com impressão 3D.",
  headlineHighlight: "ganha forma",
  subheadline:
    "Na MAVEL, transformamos ideias em produtos exclusivos com impressão 3D de alta precisão. Criamos peças decorativas, utilitárias, colecionáveis e projetos personalizados com acabamento premium e atenção a cada detalhe.",
  primaryButtonText: "Explorar Produtos",
  primaryButtonLink: "/produtos",
  secondaryButtonText: "Criar Projeto Personalizado",
  secondaryButtonLink: "#personalizados",
  imageUrl: "https://picsum.photos/seed/mavel-printer-hero/900/1125",
  backgroundImageUrl: "",
};

export const DEFAULT_ABOUT: AboutContent = {
  eyebrow: "Sobre a MAVEL",
  title: "Tecnologia, criatividade e inovação em cada detalhe.",
  text: "A MAVEL nasceu para transformar criatividade em produtos reais. Utilizamos impressão 3D de alta qualidade para produzir peças únicas, funcionais e personalizadas, sempre com foco em acabamento, inovação e satisfação dos nossos clientes.",
  imageUrl: "https://picsum.photos/seed/mavel-workshop/1000/750",
};

export const DIFFERENTIATOR_ICON_OPTIONS = [
  "Target",
  "Wand2",
  "ShieldCheck",
  "Factory",
  "Sparkles",
  "Zap",
  "Award",
  "Clock",
  "Truck",
  "Heart",
  "Star",
  "CheckCircle",
] as const;

export const DEFAULT_CTA: CtaContent = {
  title: "Crie algo único.",
  text: "Descubra nossa coleção ou solicite um projeto exclusivo desenvolvido especialmente para você.",
  primaryButtonText: "Comprar Agora",
  primaryButtonLink: "/produtos",
  secondaryButtonText: "Ver Catálogo",
  secondaryButtonLink: "/produtos",
  imageUrl: "",
};
