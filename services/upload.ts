import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import type { MediaFolder, MediaItem } from "@/lib/types";

/**
 * Media library: general-purpose uploads for Landing/logos/banners (kept
 * separate from the `product-images` bucket used by services/products-admin.ts,
 * so the existing product upload flow is untouched). Service-role only,
 * only ever imported from a Server Action gated by `requireAdminSession()`.
 */

const BUCKET = "media";

interface MediaRow {
  id: string;
  path: string;
  url: string;
  folder: string;
  filename: string;
  size: number;
  mime_type: string;
  created_at: string;
}

function mapRowToMedia(row: MediaRow): MediaItem {
  return {
    id: row.id,
    path: row.path,
    url: row.url,
    folder: row.folder,
    filename: row.filename,
    size: row.size,
    mimeType: row.mime_type,
    createdAt: row.created_at,
  };
}

export async function uploadMedia(file: File, folder: MediaFolder): Promise<MediaItem> {
  const supabase = createAdminClient();
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });
  if (uploadError) throw new Error(uploadError.message);

  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);

  const { data, error } = await supabase
    .from("media_library")
    .insert({
      path,
      url: pub.publicUrl,
      folder,
      filename: file.name,
      size: file.size,
      mime_type: file.type || "",
    })
    .select("*")
    .single();

  if (error) {
    await supabase.storage.from(BUCKET).remove([path]);
    throw new Error(error.message);
  }

  return mapRowToMedia(data as MediaRow);
}

export async function deleteMedia(id: string): Promise<void> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("media_library")
    .select("path")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return;

  await supabase.storage.from(BUCKET).remove([data.path]);

  const { error: deleteError } = await supabase.from("media_library").delete().eq("id", id);
  if (deleteError) throw new Error(deleteError.message);
}

export async function listMedia(params?: { folder?: string; search?: string }): Promise<MediaItem[]> {
  const supabase = createAdminClient();
  let query = supabase.from("media_library").select("*").order("created_at", { ascending: false });

  if (params?.folder) query = query.eq("folder", params.folder);
  if (params?.search) query = query.ilike("filename", `%${params.search}%`);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data as MediaRow[]).map(mapRowToMedia);
}
