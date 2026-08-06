export interface ProductCategory {
  id: string;
  name: string;
  /** lucide-react icon name, e.g. "Headphones" */
  icon: string;
  /** hex color used for the category badge/swatch */
  color: string;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  cost: number;
  stock: number;
  sku: string;
  barcode?: string;
  images: string[];
  featured: boolean;
  isNew: boolean;
  isPromotion: boolean;
  active: boolean;
  metaTitle?: string;
  metaDescription?: string;
  rating: number;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export type PaymentMethod = "cartao" | "pix" | "boleto";

export interface Address {
  cep: string;
  rua: string;
  numero: string;
  cidade: string;
  estado: string;
}

export type OrderStatus = "pendente" | "pago" | "enviado" | "entregue" | "cancelado";

export interface OrderTimelineEntry {
  status: OrderStatus;
  date: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  number: string;
  customerId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  address: Address;
  timeline: OrderTimelineEntry[];
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: Address;
  createdAt: string;
}

export interface StoreSettings {
  storeName: string;
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  email: string;
  phone: string;
  instagram?: string;
  facebook?: string;
  whatsapp?: string;
  address: string;
  copyrightText: string;
  currency: string;
  defaultShippingRate: number;
}

export interface ActivityItem {
  id: string;
  message: string;
  date: string;
}

export type AdminRole = "ADMIN";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  active: boolean;
  createdAt: string;
  lastSignInAt: string | null;
}

export interface HeroContent {
  badge: string;
  headline: string;
  headlineHighlight: string;
  subheadline: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  imageUrl: string;
  backgroundImageUrl: string;
}

export interface AboutContent {
  eyebrow: string;
  title: string;
  text: string;
  imageUrl: string;
}

export interface CtaContent {
  title: string;
  text: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  imageUrl: string;
}

export interface LandingContent {
  hero: HeroContent;
  about: AboutContent;
  cta: CtaContent;
}

export interface Differentiator {
  id: string;
  title: string;
  description: string;
  icon: string;
  sortOrder: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  photoUrl: string;
  text: string;
  rating: number;
  sortOrder: number;
}

export interface MediaItem {
  id: string;
  path: string;
  url: string;
  folder: string;
  filename: string;
  size: number;
  mimeType: string;
  createdAt: string;
}

export const MEDIA_FOLDERS = ["products", "landing", "logos", "banners"] as const;
export type MediaFolder = (typeof MEDIA_FOLDERS)[number];
