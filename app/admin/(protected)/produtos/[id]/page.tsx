import { getProductByIdAdmin } from "@/services/products-admin";
import { EditProductView } from "@/components/admin/edit-product-view";
import { EmptyState } from "@/components/admin/empty-state";
import { Package } from "lucide-react";

export default async function EditProductPage(props: PageProps<"/admin/produtos/[id]">) {
  const { id } = await props.params;
  const product = await getProductByIdAdmin(id);

  if (!product) {
    return (
      <EmptyState
        icon={Package}
        title="Produto não encontrado"
        description="Esse produto pode ter sido removido."
      />
    );
  }

  return <EditProductView product={product} />;
}
