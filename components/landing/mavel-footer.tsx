import Link from "next/link";
import { AtSign, Camera, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

const quickLinks = [
  { href: "/produtos", label: "Produtos" },
  { href: "#personalizados", label: "Personalizados" },
  { href: "#sobre", label: "Sobre" },
  { href: "/carrinho", label: "Carrinho" },
];

const contactInfo = [
  { icon: Mail, label: "contato@mavel3d.com.br" },
  { icon: Phone, label: "(11) 4000-0000" },
  { icon: MapPin, label: "São Paulo, SP — Brasil" },
];

export function MavelFooter() {
  return (
    <footer id="contato" className="scroll-mt-24 border-t border-white/10 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <span className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-purple-500 text-sm font-bold text-white">
                M
              </span>
              <span className="text-lg tracking-tight text-white">MAVEL</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-zinc-400">
              Impressão 3D premium: peças exclusivas, personalizadas e produzidas com precisão
              para quem exige o melhor.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {[Camera, AtSign, MessageCircle].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex size-9 items-center justify-center rounded-full border border-white/10 text-zinc-400 transition-colors hover:border-violet-500/40 hover:text-violet-300"
                  aria-label="Rede social"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white">Links rápidos</h4>
            <ul className="mt-4 flex flex-col gap-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-400 transition-colors hover:text-violet-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white">Contato</h4>
            <ul className="mt-4 flex flex-col gap-3">
              {contactInfo.map((item) => (
                <li key={item.label} className="flex items-center gap-2 text-sm text-zinc-400">
                  <item.icon className="size-4 shrink-0 text-zinc-500" />
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-zinc-500 sm:flex-row">
          <p>© {new Date().getFullYear()} MAVEL. Todos os direitos reservados.</p>
          <p>Impressão 3D premium para quem cria sem limites.</p>
        </div>
      </div>
    </footer>
  );
}
