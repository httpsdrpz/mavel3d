"use client";

import * as React from "react";
import Image from "next/image";
import { toast } from "sonner";
import { ImageOff, Loader2, Plus, Trash2, Upload } from "lucide-react";

import { uploadProductImageAction } from "@/app/admin/(protected)/produtos/actions";
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

function UploadButton({
  uploading,
  onFileSelected,
}: {
  uploading: boolean;
  onFileSelected: (file: File) => void;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileSelected(file);
          e.target.value = "";
        }}
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        aria-label="Enviar imagem"
      >
        {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
      </Button>
    </>
  );
}

export function ProductImageUpload({
  mainImage,
  onMainImageChange,
  gallery,
  onGalleryChange,
}: ProductImageUploadProps) {
  const [uploadingMain, setUploadingMain] = React.useState(false);
  const [uploadingGalleryIndex, setUploadingGalleryIndex] = React.useState<number | null>(null);

  async function uploadFile(file: File): Promise<string | null> {
    try {
      return await uploadProductImageAction(file);
    } catch {
      toast.error("Não foi possível enviar a imagem");
      return null;
    }
  }

  async function handleMainUpload(file: File) {
    setUploadingMain(true);
    const url = await uploadFile(file);
    setUploadingMain(false);
    if (url) onMainImageChange(url);
  }

  async function handleGalleryUpload(index: number, file: File) {
    setUploadingGalleryIndex(index);
    const url = await uploadFile(file);
    setUploadingGalleryIndex(null);
    if (url) updateGalleryUrl(index, url);
  }

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
        <Label htmlFor="main-image">Imagem principal</Label>
        <div className="flex items-center gap-3">
          <ImagePreview url={mainImage} />
          <Input
            id="main-image"
            placeholder="https:// ou envie um arquivo"
            value={mainImage}
            onChange={(e) => onMainImageChange(e.target.value)}
            className="flex-1"
          />
          <UploadButton uploading={uploadingMain} onFileSelected={handleMainUpload} />
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
                placeholder="https:// ou envie um arquivo"
                value={url}
                onChange={(e) => updateGalleryUrl(index, e.target.value)}
                className="flex-1"
              />
              <UploadButton
                uploading={uploadingGalleryIndex === index}
                onFileSelected={(file) => handleGalleryUpload(index, file)}
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
