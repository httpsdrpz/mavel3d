import { getActiveProducts } from "@/services/products";
import { ProdutosPageContent } from "@/components/produtos-content";

// Always reflects live `active` state from Supabase — see app/page.tsx.
export const dynamic = "force-dynamic";

export default async function ProdutosPage() {
  const products = await getActiveProducts();
  return <ProdutosPageContent products={products} />;
}
