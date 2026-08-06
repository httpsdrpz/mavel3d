"use client";

import * as React from "react";
import Image from "next/image";
import { toast } from "sonner";
import { ImageOff, Loader2, Upload } from "lucide-react";

import { listMediaAction, uploadMediaAction } from "@/app/admin/(protected)/midia/actions";
import type { MediaFolder, MediaItem } from "@/lib/types";
import { cn } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

interface MediaPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folder: MediaFolder;
  onSelect: (url: string) => void;
}

export function MediaPickerDialog({ open, onOpenChange, folder, onSelect }: MediaPickerDialogProps) {
  const [items, setItems] = React.useState<MediaItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Mark loading during render (not inside the effect body below) as soon as
  // the dialog opens for a new folder, so the fetch effect only ever calls
  // setState from its async .then/.catch/.finally callbacks.
  const loadKey = open ? folder : null;
  const [lastLoadKey, setLastLoadKey] = React.useState<string | null>(null);
  if (loadKey && loadKey !== lastLoadKey) {
    setLastLoadKey(loadKey);
    setLoading(true);
  }

  React.useEffect(() => {
    if (!open) return;
    let cancelled = false;
    listMediaAction({ folder })
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .catch(() => {
        if (!cancelled) toast.error("Não foi possível carregar a biblioteca de mídia");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, folder]);

  function handleSelect(url: string) {
    onSelect(url);
    onOpenChange(false);
  }

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      const item = await uploadMediaAction(file, folder);
      handleSelect(item.url);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível enviar a imagem");
    } finally {
      setUploading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Selecionar imagem</DialogTitle>
          <DialogDescription>Envie uma nova imagem ou escolha uma já existente na biblioteca.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="library">
          <TabsList>
            <TabsTrigger value="library">Biblioteca</TabsTrigger>
            <TabsTrigger value="upload">Enviar nova</TabsTrigger>
          </TabsList>

          <TabsContent value="library" className="pt-4">
            {loading ? (
              <div className="flex items-center justify-center py-16 text-muted-foreground">
                <Loader2 className="size-5 animate-spin" />
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-16 text-center text-muted-foreground">
                <ImageOff className="size-6" />
                <p className="text-sm">Nenhuma imagem nesta pasta ainda.</p>
              </div>
            ) : (
              <div className="grid max-h-80 grid-cols-3 gap-3 overflow-y-auto sm:grid-cols-4">
                {items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(item.url)}
                    className={cn(
                      "relative aspect-square overflow-hidden rounded-xl border border-border bg-secondary transition-all hover:ring-2 hover:ring-primary"
                    )}
                  >
                    <Image src={item.url} alt={item.filename} fill sizes="140px" className="object-cover" unoptimized />
                  </button>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="upload" className="pt-4">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
              className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border py-16 text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-60"
            >
              {uploading ? <Loader2 className="size-6 animate-spin" /> : <Upload className="size-6" />}
              <span className="text-sm font-medium">Clique para enviar uma imagem</span>
            </button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export function MediaPickerButton({
  folder,
  value,
  onChange,
}: {
  folder: MediaFolder;
  value: string;
  onChange: (url: string) => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <div className="flex items-center gap-3">
        <div className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-border bg-secondary">
          {value ? (
            <Image src={value} alt="Preview" fill sizes="64px" className="object-cover" unoptimized />
          ) : (
            <div className="flex size-full items-center justify-center text-muted-foreground">
              <ImageOff className="size-5" />
            </div>
          )}
        </div>
        <Button type="button" variant="outline" onClick={() => setOpen(true)}>
          <Upload /> Selecionar imagem
        </Button>
      </div>
      <MediaPickerDialog open={open} onOpenChange={setOpen} folder={folder} onSelect={onChange} />
    </>
  );
}
