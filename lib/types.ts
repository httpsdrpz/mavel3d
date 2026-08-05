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
  primaryColor: string;
  email: string;
  phone: string;
  instagram?: string;
  facebook?: string;
  whatsapp?: string;
  address: string;
  currency: string;
  defaultShippingRate: number;
}

export interface ActivityItem {
  id: string;
  message: string;
  date: string;
}
