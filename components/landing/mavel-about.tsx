"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import type { AboutContent } from "@/lib/types";

export function MavelAbout({ about }: { about: AboutContent }) {
  return (
    <section id="sobre" className="scroll-mt-24 bg-zinc-950 py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="relative aspect-4/3 overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 shadow-2xl shadow-black/50 lg:order-1"
        >
          <Image
            src={about.imageUrl}
            alt="Peça produzida com impressão 3D pela MAVEL"
            fill
            sizes="(min-width: 1024px) 45vw, 90vw"
            className="object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-xs font-semibold tracking-wide text-violet-400 uppercase">
            {about.eyebrow}
          </span>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {about.title}
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-zinc-400">{about.text}</p>
        </motion.div>
      </div>
    </section>
  );
}
