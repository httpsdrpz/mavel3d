"use client";

import * as React from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Copy, ImageOff, Images, Loader2, Trash2, Upload } from "lucide-react";

import { deleteMediaAction, uploadMediaAction } from "@/app/admin/(protected)/midia/actions";
import { MEDIA_FOLDERS, type MediaFolder, type MediaItem } from "@/lib/types";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { SearchInput } from "@/components/admin/search-input";
import { EmptyState } from "@/components/admin/empty-state";
import { DeleteDialog } from "@/components/admin/delete-dialog";

const FOLDER_LABELS: Record<MediaFolder, string> = {
  products: "Produtos",
  landing: "Landing",
  logos: "Logos",
  banners: "Banners",
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaLibraryView({ initialItems }: { initialItems: MediaItem[] }) {
  const [items, setItems] = React.useState(initialItems);
  const [query, setQuery] = React.useState("");
  const [folderFilter, setFolderFilter] = React.useState<"all" | MediaFolder>("all");
  const [uploadFolder, setUploadFolder] = React.useState<MediaFolder>("landing");
  const [uploading, setUploading] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<MediaItem | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const filtered = React.useMemo(() => {
    let list = items;
    if (folderFilter !== "all") list = list.filter((item) => item.folder === folderFilter);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((item) => item.filename.toLowerCase().includes(q));
    }
    return list;
  }, [items, folderFilter, query]);

  async function handleFileSelected(file: File) {
    setUploading(true);
    try {
      const item = await uploadMediaAction(file, uploadFolder);
      setItems((prev) => [item, ...prev]);
      toast.success("Imagem enviada com sucesso");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível enviar a imagem");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(item: MediaItem) {
    try {
      await deleteMediaAction(item.id);
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      toast.success("Imagem excluída");
      setDeleteTarget(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível excluir a imagem");
    }
  }

  async function handleCopyUrl(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("URL copiada para a área de transferência");
    } catch {
      toast.error("Não foi possível copiar a URL");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-white p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SearchInput
            value={query}
            onValueChange={setQuery}
            placeholder="Buscar por nome do arquivo..."
            className="sm:max-w-xs"
          />

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Select value={folderFilter} onValueChange={(v) => setFolderFilter(v as typeof folderFilter)}>
              <SelectTrigger className="sm:w-40">
                <SelectValue placeholder="Pasta" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as pastas</SelectItem>
                {MEDIA_FOLDERS.map((folder) => (
                  <SelectItem key={folder} value={folder}>
                    {FOLDER_LABELS[folder]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={uploadFolder} onValueChange={(v) => setUploadFolder(v as MediaFolder)}>
              <SelectTrigger className="sm:w-40">
                <SelectValue placeholder="Enviar para" />
              </SelectTrigger>
              <SelectContent>
                {MEDIA_FOLDERS.map((folder) => (
                  <SelectItem key={folder} value={folder}>
                    {FOLDER_LABELS[folder]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelected(file);
                e.target.value = "";
              }}
            />
            <Button type="button" disabled={uploading} onClick={() => inputRef.current?.click()}>
              {uploading ? <Loader2 className="animate-spin" /> : <Upload />}
              Enviar imagem
            </Button>
          </div>
        </div>

        {uploading && (
          <div className="h-1 w-full overflow-hidden rounded-full bg-secondary">
            <div className="h-full w-1/3 animate-progress rounded-full bg-primary" />
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-border bg-white">
          <EmptyState
            icon={Images}
            title="Nenhuma imagem encontrada"
            description="Ajuste os filtros ou envie uma nova imagem."
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white"
            >
              <div className="relative aspect-square bg-secondary">
                {item.url ? (
                  <Image
                    src={item.url}
                    alt={item.filename}
                    fill
                    sizes="220px"
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex size-full items-center justify-center text-muted-foreground">
                    <ImageOff className="size-6" />
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-2 p-3">
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-foreground" title={item.filename}>
                    {item.filename}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {FOLDER_LABELS[item.folder as MediaFolder] ?? item.folder} · {formatSize(item.size)}
                  </p>
                </div>
                <div className="mt-auto flex items-center gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleCopyUrl(item.url)}
                  >
                    <Copy className="size-3.5" /> Copiar URL
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Excluir imagem"
                    className={cn("text-destructive hover:bg-destructive/10 hover:text-destructive")}
                    onClick={() => setDeleteTarget(item)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <DeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        description={`Tem certeza que deseja excluir "${deleteTarget?.filename}"? Essa ação não pode ser desfeita.`}
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
      />
    </div>
  );
}
