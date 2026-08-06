"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

import type { Testimonial } from "@/lib/types";

export function MavelTestimonials({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;

  return (
    <section className="bg-zinc-950 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            O que dizem nossos clientes
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur"
            >
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    className={
                      idx < t.rating
                        ? "size-4 fill-amber-400 text-amber-400"
                        : "size-4 text-zinc-700"
                    }
                  />
                ))}
              </div>
              <p className="mt-4 leading-relaxed text-zinc-300">&ldquo;{t.text}&rdquo;</p>
              <p className="mt-5 text-sm font-medium text-zinc-500">
                {t.name}
                {t.role && <span className="text-zinc-600"> · {t.role}</span>}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
