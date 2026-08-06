import { getTestimonials } from "@/services/testimonials";
import { TestimonialsManager } from "@/components/admin/testimonials-manager";

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Depoimentos</h1>
        <p className="mt-1 text-muted-foreground">
          Gerencie os depoimentos exibidos na Home da MAVEL.
        </p>
      </div>

      <TestimonialsManager testimonials={testimonials} />
    </div>
  );
}
