import type { ProductCategory } from "./types";

export const CATEGORY_ICON_OPTIONS = [
  "Headphones",
  "Laptop",
  "Smartphone",
  "Cable",
  "Watch",
  "Monitor",
  "Camera",
  "Keyboard",
  "Mouse",
  "Speaker",
  "Gamepad2",
  "Tablet",
  "Printer",
  "HardDrive",
  "Router",
] as const;

export const CATEGORY_COLOR_OPTIONS = [
  "#7c3aed",
  "#6d28d9",
  "#9333ea",
  "#a855f7",
  "#8b5cf6",
  "#c026d3",
  "#18181b",
  "#71717a",
] as const;

export const categories: ProductCategory[] = [
  {
    id: "cat-fones",
    name: "Fones",
    icon: "Headphones",
    color: "#7c3aed",
    description: "Fones de ouvido e headphones para todos os estilos.",
  },
  {
    id: "cat-notebooks",
    name: "Notebooks",
    icon: "Laptop",
    color: "#6d28d9",
    description: "Notebooks para trabalho, estudo e criação.",
  },
  {
    id: "cat-smartphones",
    name: "Smartphones",
    icon: "Smartphone",
    color: "#9333ea",
    description: "Smartphones de última geração.",
  },
  {
    id: "cat-acessorios",
    name: "Acessórios",
    icon: "Cable",
    color: "#a855f7",
    description: "Acessórios que completam sua experiência tech.",
  },
  {
    id: "cat-wearables",
    name: "Wearables",
    icon: "Watch",
    color: "#8b5cf6",
    description: "Smartwatches e pulseiras inteligentes.",
  },
  {
    id: "cat-monitores",
    name: "Monitores",
    icon: "Monitor",
    color: "#7e22ce",
    description: "Monitores para produtividade e jogos.",
  },
];
