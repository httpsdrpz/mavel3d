import { getDifferentiators, getLandingContent } from "@/services/landing";
import { getSettings } from "@/services/settings";
import { getAllProductsAdmin } from "@/services/products-admin";
import { LandingEditor } from "@/components/admin/landing-editor";

// Per-session admin data — never prerender/cache at build time.
export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const [content, differentiators, settings, products] = await Promise.all([
    getLandingContent(),
    getDifferentiators(),
    getSettings(),
    getAllProductsAdmin(),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Personalizar Landing
        </h1>
        <p className="mt-1 text-muted-foreground">
          Edite todo o conteúdo exibido na página inicial da MAVEL.
        </p>
      </div>

      <LandingEditor
        content={content}
        differentiators={differentiators}
        products={products.filter((p) => p.active)}
        settings={settings}
      />
    </div>
  );
}
