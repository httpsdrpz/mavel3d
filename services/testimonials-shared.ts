import type { Testimonial } from "@/lib/types";

export interface TestimonialRow {
  id: string;
  name: string;
  role: string;
  photo_url: string;
  text: string;
  rating: number;
  sort_order: number;
}

export const TESTIMONIAL_COLUMNS = "id, name, role, photo_url, text, rating, sort_order";

export function mapRowToTestimonial(row: TestimonialRow): Testimonial {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    photoUrl: row.photo_url,
    text: row.text,
    rating: row.rating,
    sortOrder: row.sort_order,
  };
}
