import { notFound } from "next/navigation";

import { getActiveProductBySlug, getRelatedActiveProducts } from "@/services/products";
import { ProductDetail } from "@/components/product-detail";

// Always reflects live `active` state from Supabase — see app/page.tsx.
export const dynamic = "force-dynamic";

export default async function ProdutoPage(props: PageProps<"/produto/[id]">) {
  const { id } = await props.params;

  const product = await getActiveProductBySlug(id);
  if (!product) notFound();

  const related = await getRelatedActiveProducts(product.category, product.id, 4);

  return <ProductDetail product={product} related={related} />;
}
