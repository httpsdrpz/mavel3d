"use client";

import { motion } from "framer-motion";
import { Factory, ShieldCheck, Target, Wand2 } from "lucide-react";

const DIFFERENTIATORS = [
  {
    icon: Target,
    title: "Precisão Profissional",
    description: "Produção em alta definição para um acabamento impecável.",
  },
  {
    icon: Wand2,
    title: "Personalização Total",
    description: "Transforme sua ideia em uma peça única.",
  },
  {
    icon: ShieldCheck,
    title: "Materiais de Alta Qualidade",
    description: "Resistência, durabilidade e excelente acabamento.",
  },
  {
    icon: Factory,
    title: "Produção Sob Demanda",
    description: "Cada peça é produzida especialmente para você.",
  },
];

export function MavelDifferentiators() {
  return (
    <section className="bg-zinc-950 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Nossos diferenciais
          </h2>
          <p className="mt-3 text-zinc-400">
            Tecnologia e cuidado artesanal em cada peça que produzimos.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {DIFFERENTIATORS.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group rounded-2xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/30 hover:bg-zinc-900"
            >
              <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-purple-500 text-white shadow-md shadow-violet-600/20">
                <item.icon className="size-5" />
              </div>
              <h3 className="mt-5 font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
