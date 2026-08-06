import { listMedia } from "@/services/upload";
import { MediaLibraryView } from "@/components/admin/media-library-view";

// Per-session admin data — never prerender/cache at build time.
export const dynamic = "force-dynamic";

export default async function MediaLibraryPage() {
  const items = await listMedia();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Biblioteca de Mídia
        </h1>
        <p className="mt-1 text-muted-foreground">
          Envie e organize as imagens usadas na loja e na Landing Page.
        </p>
      </div>

      <MediaLibraryView initialItems={items} />
    </div>
  );
}
