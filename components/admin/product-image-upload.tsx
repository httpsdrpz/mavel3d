"use client";

import Image from "next/image";
import { Plus, Trash2, ImageOff } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface ProductImageUploadProps {
  mainImage: string;
  onMainImageChange: (url: string) => void;
  gallery: string[];
  onGalleryChange: (urls: string[]) => void;
}

function ImagePreview({ url }: { url: string }) {
  if (!url) {
    return (
      <div className="flex size-16 shrink-0 items-center justify-center rounded-xl border border-dashed border-border bg-secondary text-muted-foreground">
        <ImageOff className="size-5" />
      </div>
    );
  }
  return (
    <div className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-border bg-secondary">
      <Image src={url} alt="Preview" fill sizes="64px" className="object-cover" unoptimized />
    </div>
  );
}

export function ProductImageUpload({
  mainImage,
  onMainImageChange,
  gallery,
  onGalleryChange,
}: ProductImageUploadProps) {
  function updateGalleryUrl(index: number, url: string) {
    const next = [...gallery];
    next[index] = url;
    onGalleryChange(next);
  }

  function removeGalleryUrl(index: number) {
    onGalleryChange(gallery.filter((_, i) => i !== index));
  }

  function addGalleryUrl() {
    onGalleryChange([...gallery, ""]);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="main-image">Imagem principal (URL)</Label>
        <div className="flex items-center gap-3">
          <ImagePreview url={mainImage} />
          <Input
            id="main-image"
            placeholder="https://..."
            value={mainImage}
            onChange={(e) => onMainImageChange(e.target.value)}
            className="flex-1"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Label>Galeria de imagens</Label>
          <Button type="button" variant="outline" size="sm" onClick={addGalleryUrl}>
            <Plus /> Adicionar imagem
          </Button>
        </div>

        {gallery.length === 0 && (
          <p className="text-xs text-muted-foreground">Nenhuma imagem adicional na galeria.</p>
        )}

        <div className="flex flex-col gap-3">
          {gallery.map((url, index) => (
            <div key={index} className="flex items-center gap-3">
              <ImagePreview url={url} />
              <Input
                placeholder="https://..."
                value={url}
                onChange={(e) => updateGalleryUrl(index, e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeGalleryUrl(index)}
                aria-label="Remover imagem"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
