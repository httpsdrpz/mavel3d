"use server";

import { revalidatePath } from "next/cache";

import { requireAdminSession } from "@/lib/supabase/admin";
import { deleteMedia, listMedia, uploadMedia } from "@/services/upload";
import type { MediaFolder, MediaItem } from "@/lib/types";

export async function uploadMediaAction(file: File, folder: MediaFolder): Promise<MediaItem> {
  await requireAdminSession();
  const item = await uploadMedia(file, folder);
  revalidatePath("/admin/midia");
  return item;
}

export async function deleteMediaAction(id: string): Promise<void> {
  await requireAdminSession();
  await deleteMedia(id);
  revalidatePath("/admin/midia");
}

export async function listMediaAction(params?: {
  folder?: string;
  search?: string;
}): Promise<MediaItem[]> {
  await requireAdminSession();
  return listMedia(params);
}
