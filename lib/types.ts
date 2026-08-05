export type Category =
  | "Fones"
  | "Notebooks"
  | "Smartphones"
  | "Acessórios"
  | "Wearables"
  | "Monitores";

export interface Product {
  id: string;
  name: string;
  description: string;
  category: Category;
  price: number;
  compareAtPrice?: number;
  stock: number;
  images: string[];
  featured: boolean;
  isNew: boolean;
  rating: number;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export type PaymentMethod = "cartao" | "pix" | "boleto";

export interface CheckoutData {
  nome: string;
  email: string;
  telefone: string;
  cep: string;
  rua: string;
  numero: string;
  cidade: string;
  estado: string;
  pagamento: PaymentMethod;
}

export interface Order {
  number: string;
  items: CartItem[];
  total: number;
  customer: CheckoutData;
  createdAt: string;
}
