"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    quote: "Qualidade surpreendente. O acabamento ficou perfeito.",
    name: "Camila R.",
  },
  {
    quote: "Meu produto personalizado ficou exatamente como imaginei.",
    name: "Rafael T.",
  },
  {
    quote: "Entrega rápida, ótimo atendimento e excelente qualidade.",
    name: "Beatriz S.",
  },
];

export function MavelTestimonials() {
  return (
    <section className="bg-zinc-950 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            O que dizem nossos clientes
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur"
            >
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star key={idx} className="size-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="mt-4 leading-relaxed text-zinc-300">&ldquo;{t.quote}&rdquo;</p>
              <p className="mt-5 text-sm font-medium text-zinc-500">{t.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
