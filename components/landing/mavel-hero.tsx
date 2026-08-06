"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

import type { HeroContent } from "@/lib/types";
import { Button } from "@/components/ui/button";

function Headline({ headline, highlight }: { headline: string; highlight: string }) {
  if (!highlight || !headline.includes(highlight)) {
    return <>{headline}</>;
  }
  const [before, after] = headline.split(highlight);
  return (
    <>
      {before}
      <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
        {highlight}
      </span>
      {after}
    </>
  );
}

export function MavelHero({ hero }: { hero: HeroContent }) {
  return (
    <section className="relative overflow-hidden bg-zinc-950 pt-32 pb-20 sm:pt-40 sm:pb-28">
      {hero.backgroundImageUrl && (
        <Image
          src={hero.backgroundImageUrl}
          alt=""
          fill
          priority
          className="object-cover opacity-30"
        />
      )}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(124,58,237,0.25),transparent_55%),radial-gradient(circle_at_85%_30%,rgba(168,85,247,0.18),transparent_55%)]" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-10 lg:px-8">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-zinc-300 backdrop-blur"
          >
            <Sparkles className="size-3.5 text-purple-400" />
            {hero.badge}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            <Headline headline={hero.headline} highlight={hero.headlineHighlight} />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-400"
          >
            {hero.subheadline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col gap-3 sm:flex-row"
          >
            <Button
              size="lg"
              asChild
              className="bg-gradient-to-br from-violet-600 to-purple-500 text-white shadow-lg shadow-violet-600/30 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-600/40"
            >
              <Link href={hero.primaryButtonLink}>
                {hero.primaryButtonText}
                <ArrowRight />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white/15 bg-transparent text-white hover:bg-white/5"
            >
              <Link href={hero.secondaryButtonLink}>{hero.secondaryButtonText}</Link>
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-violet-600/30 to-fuchsia-600/20 blur-3xl" />
          <div className="relative aspect-4/5 overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 shadow-2xl shadow-black/50">
            <Image
              src={hero.imageUrl}
              alt="Impressora 3D MAVEL produzindo uma peça de alta precisão"
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 90vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
