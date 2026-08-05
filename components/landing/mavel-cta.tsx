"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";

export function MavelCta() {
  return (
    <section
      id="personalizados"
      className="scroll-mt-24 bg-zinc-950 px-4 pb-20 sm:px-6 sm:pb-28 lg:px-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-br from-violet-700 via-purple-600 to-fuchsia-700 px-8 py-16 text-center sm:px-16"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.15),transparent_50%)]" />
        <div className="relative flex flex-col items-center gap-5">
          <h2 className="max-w-xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Crie algo único.
          </h2>
          <p className="max-w-md text-white/70">
            Descubra nossa coleção ou solicite um projeto exclusivo desenvolvido especialmente
            para você.
          </p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              asChild
              className="bg-white text-violet-700 hover:bg-white/90"
            >
              <Link href="/produtos">Comprar Agora</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white/30 bg-transparent text-white hover:bg-white/10"
            >
              <Link href="/produtos">Ver Catálogo</Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
