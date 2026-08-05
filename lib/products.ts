import type { Product } from "./types";

type SeedProduct = Pick<
  Product,
  | "id"
  | "name"
  | "description"
  | "category"
  | "price"
  | "compareAtPrice"
  | "stock"
  | "images"
  | "featured"
  | "isNew"
  | "rating"
  | "createdAt"
>;

function img(seed: string) {
  return `https://picsum.photos/seed/${seed}/900/900`;
}

const seedProducts: SeedProduct[] = [
  {
    id: "fone-aether-pro",
    name: "Aether Pro Wireless",
    description:
      "Fone de ouvido premium com cancelamento ativo de ruído, áudio espacial e até 30 horas de bateria. Design em alumínio escovado com acabamento em couro vegano.",
    category: "Fones",
    price: 1899,
    compareAtPrice: 2199,
    stock: 24,
    images: [img("aether-pro-1"), img("aether-pro-2"), img("aether-pro-3")],
    featured: true,
    isNew: false,
    rating: 4.8,
    createdAt: "2026-05-12",
  },
  {
    id: "fone-nova-buds",
    name: "Nova Buds",
    description:
      "Earbuds compactos com som imersivo, resistência à água IPX4 e estojo de carregamento com autonomia total de 24 horas.",
    category: "Fones",
    price: 799,
    stock: 40,
    images: [img("nova-buds-1"), img("nova-buds-2")],
    featured: false,
    isNew: true,
    rating: 4.5,
    createdAt: "2026-07-20",
  },
  {
    id: "notebook-vortex-14",
    name: "Vortex 14",
    description:
      "Notebook ultrafino de 14'', tela OLED 120Hz, processador de última geração e até 18 horas de bateria. Feito para criadores e desenvolvedores.",
    category: "Notebooks",
    price: 12999,
    compareAtPrice: 14499,
    stock: 8,
    images: [img("vortex-14-1"), img("vortex-14-2"), img("vortex-14-3")],
    featured: true,
    isNew: false,
    rating: 4.9,
    createdAt: "2026-03-02",
  },
  {
    id: "notebook-slate-air",
    name: "Slate Air",
    description:
      "Leveza extrema com apenas 990g. Ideal para produtividade em movimento, com chassi em fibra de carbono e teclado retroiluminado.",
    category: "Notebooks",
    price: 8999,
    stock: 15,
    images: [img("slate-air-1"), img("slate-air-2")],
    featured: false,
    isNew: true,
    rating: 4.6,
    createdAt: "2026-06-30",
  },
  {
    id: "phone-lumen-x",
    name: "Lumen X",
    description:
      "Smartphone flagship com câmera tripla de 200MP, tela AMOLED de 6.7'' e carregamento ultrarrápido de 120W.",
    category: "Smartphones",
    price: 6499,
    compareAtPrice: 7299,
    stock: 18,
    images: [img("lumen-x-1"), img("lumen-x-2"), img("lumen-x-3")],
    featured: true,
    isNew: false,
    rating: 4.7,
    createdAt: "2026-04-18",
  },
  {
    id: "phone-lumen-mini",
    name: "Lumen Mini",
    description:
      "Compacto e potente, com desempenho flagship em um corpo de 5.8''. Perfeito para quem prefere praticidade sem abrir mão de qualidade.",
    category: "Smartphones",
    price: 4299,
    stock: 22,
    images: [img("lumen-mini-1"), img("lumen-mini-2")],
    featured: false,
    isNew: true,
    rating: 4.4,
    createdAt: "2026-07-05",
  },
  {
    id: "watch-pulse-2",
    name: "Pulse Watch 2",
    description:
      "Smartwatch com monitoramento avançado de saúde, GPS integrado e tela AMOLED sempre ativa. Resistente à água até 50m.",
    category: "Wearables",
    price: 2299,
    compareAtPrice: 2599,
    stock: 30,
    images: [img("pulse-2-1"), img("pulse-2-2")],
    featured: true,
    isNew: false,
    rating: 4.6,
    createdAt: "2026-02-14",
  },
  {
    id: "band-fit-track",
    name: "FitTrack Band",
    description:
      "Pulseira inteligente leve e discreta, com bateria de 10 dias e acompanhamento completo de sono e atividades.",
    category: "Wearables",
    price: 549,
    stock: 55,
    images: [img("fittrack-1"), img("fittrack-2")],
    featured: false,
    isNew: false,
    rating: 4.2,
    createdAt: "2026-01-22",
  },
  {
    id: "monitor-horizon-32",
    name: "Horizon 32 4K",
    description:
      "Monitor 4K de 32'' com HDR1000, 144Hz e cobertura de 98% do DCI-P3. Perfeito para design, vídeo e jogos.",
    category: "Monitores",
    price: 4599,
    stock: 12,
    images: [img("horizon-32-1"), img("horizon-32-2")],
    featured: true,
    isNew: false,
    rating: 4.8,
    createdAt: "2026-05-28",
  },
  {
    id: "monitor-flow-27",
    name: "Flow 27 QHD",
    description:
      "Monitor QHD de 27'' com 165Hz, ideal para produtividade e jogos competitivos. Ajuste de altura e rotação inclusos.",
    category: "Monitores",
    price: 2199,
    compareAtPrice: 2499,
    stock: 20,
    images: [img("flow-27-1"), img("flow-27-2")],
    featured: false,
    isNew: true,
    rating: 4.5,
    createdAt: "2026-07-15",
  },
  {
    id: "acc-charge-dock",
    name: "Charge Dock Trio",
    description:
      "Estação de carregamento 3 em 1 para smartphone, fone e smartwatch. Carregamento sem fio de até 15W por dispositivo.",
    category: "Acessórios",
    price: 449,
    stock: 60,
    images: [img("charge-dock-1"), img("charge-dock-2")],
    featured: false,
    isNew: false,
    rating: 4.3,
    createdAt: "2026-03-19",
  },
  {
    id: "acc-keyboard-mech",
    name: "Mech Keyboard Zero",
    description:
      "Teclado mecânico compacto com switches hot-swap, retroiluminação RGB e conexão tripla (Bluetooth, 2.4GHz e USB-C).",
    category: "Acessórios",
    price: 899,
    compareAtPrice: 999,
    stock: 34,
    images: [img("mech-kb-1"), img("mech-kb-2")],
    featured: true,
    isNew: true,
    rating: 4.7,
    createdAt: "2026-07-01",
  },
  {
    id: "acc-mouse-glide",
    name: "Glide Mouse",
    description:
      "Mouse ergonômico sem fio com sensor de alta precisão de 4000 DPI e bateria recarregável de longa duração.",
    category: "Acessórios",
    price: 349,
    stock: 48,
    images: [img("glide-mouse-1"), img("glide-mouse-2")],
    featured: false,
    isNew: false,
    rating: 4.4,
    createdAt: "2026-02-08",
  },
  {
    id: "acc-backpack-city",
    name: "City Backpack",
    description:
      "Mochila minimalista à prova d'água com compartimento acolchoado para notebook até 16'' e porta USB externa.",
    category: "Acessórios",
    price: 599,
    stock: 27,
    images: [img("city-backpack-1"), img("city-backpack-2")],
    featured: false,
    isNew: false,
    rating: 4.6,
    createdAt: "2026-04-04",
  },
  {
    id: "fone-studio-max",
    name: "Studio Max",
    description:
      "Headphone over-ear de estúdio com drivers de 50mm, resposta de frequência ampliada e almofadas em memory foam.",
    category: "Fones",
    price: 2499,
    stock: 10,
    images: [img("studio-max-1"), img("studio-max-2")],
    featured: false,
    isNew: false,
    rating: 4.9,
    createdAt: "2026-01-30",
  },
  {
    id: "phone-lumen-fold",
    name: "Lumen Fold",
    description:
      "Smartphone dobrável com tela interna de 7.6'' e externa de 6.2''. O futuro da mobilidade em um design ousado.",
    category: "Smartphones",
    price: 11999,
    compareAtPrice: 12999,
    stock: 6,
    images: [img("lumen-fold-1"), img("lumen-fold-2"), img("lumen-fold-3")],
    featured: true,
    isNew: true,
    rating: 4.6,
    createdAt: "2026-07-25",
  },
  {
    id: "notebook-vortex-16-pro",
    name: "Vortex 16 Pro",
    description:
      "Potência máxima para workflows profissionais: GPU dedicada, 32GB de RAM e tela mini-LED de 16''.",
    category: "Notebooks",
    price: 18999,
    stock: 5,
    images: [img("vortex-16-1"), img("vortex-16-2")],
    featured: false,
    isNew: false,
    rating: 4.9,
    createdAt: "2026-02-27",
  },
  {
    id: "watch-pulse-lite",
    name: "Pulse Watch Lite",
    description:
      "Versão essencial do Pulse Watch, com as principais métricas de saúde e até 7 dias de bateria, por um preço mais acessível.",
    category: "Wearables",
    price: 1199,
    compareAtPrice: 1399,
    stock: 38,
    images: [img("pulse-lite-1"), img("pulse-lite-2")],
    featured: false,
    isNew: false,
    rating: 4.3,
    createdAt: "2026-03-11",
  },
];

export function deriveProductFields(
  seed: SeedProduct
): Product {
  const cost = Math.round(seed.price * 0.55 * 100) / 100;
  const shortDescription = seed.description.split(". ")[0].trim().replace(/\.?$/, ".");
  return {
    ...seed,
    slug: seed.id,
    shortDescription,
    cost,
    sku: `SKU-${seed.id.toUpperCase()}`,
    isPromotion: Boolean(seed.compareAtPrice),
    active: true,
    metaTitle: `${seed.name} | Marvel`,
    metaDescription: seed.description.slice(0, 155),
  };
}

export const products: Product[] = seedProducts.map(deriveProductFields);
