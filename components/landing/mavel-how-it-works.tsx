"use client";

import { motion } from "framer-motion";
import { Cog, Search, Truck, Wand2 } from "lucide-react";

const STEPS = [
  {
    icon: Search,
    title: "Escolha",
    description: "Navegue pelo catálogo e encontre o produto ideal.",
  },
  {
    icon: Wand2,
    title: "Personalize",
    description: "Caso queira, solicite alterações ou um projeto exclusivo.",
  },
  {
    icon: Cog,
    title: "Produção",
    description: "Produzimos sua peça com tecnologia de impressão 3D de alta precisão.",
  },
  {
    icon: Truck,
    title: "Receba",
    description: "Enviamos seu pedido com segurança para todo o Brasil.",
  },
];

export function MavelHowItWorks() {
  return (
    <section className="border-y border-white/5 bg-zinc-900/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Como Funciona
          </h2>
          <p className="mt-3 text-zinc-400">Da ideia à sua porta, em quatro etapas simples.</p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="relative rounded-2xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur"
            >
              <span className="text-xs font-semibold text-violet-400">
                0{i + 1}
              </span>
              <div className="mt-4 flex size-11 items-center justify-center rounded-xl bg-white/5 text-purple-300">
                <step.icon className="size-5" />
              </div>
              <h3 className="mt-5 font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
