"use client";

import Image from "next/image";
import Link from "next/link";
import { AtSign, Camera, MessageCircle } from "lucide-react";

import { useSettings } from "@/context/settings-context";
import { buildSocialLinks } from "@/lib/social-links";

const columns = [
  {
    title: "Loja",
    links: [
      { href: "/produtos", label: "Todos os produtos" },
      { href: "/produtos?categoria=Fones", label: "Fones" },
      { href: "/produtos?categoria=Notebooks", label: "Notebooks" },
      { href: "/produtos?categoria=Smartphones", label: "Smartphones" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { href: "/", label: "Sobre a Marvel" },
      { href: "/", label: "Carreiras" },
      { href: "/", label: "Imprensa" },
    ],
  },
  {
    title: "Suporte",
    links: [
      { href: "/", label: "Central de ajuda" },
      { href: "/carrinho", label: "Meu carrinho" },
      { href: "/", label: "Trocas e devoluções" },
    ],
  },
];

export function Footer() {
  const { settings } = useSettings();
  const { instagramUrl, facebookUrl, whatsappUrl } = buildSocialLinks(settings);
  const socialLinks = [
    { Icon: Camera, href: instagramUrl },
    { Icon: AtSign, href: facebookUrl },
    { Icon: MessageCircle, href: whatsappUrl },
  ];

  return (
    <footer className="border-t border-border bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              {settings.logoUrl ? (
                <span className="relative size-8 shrink-0 overflow-hidden rounded-xl">
                  <Image src={settings.logoUrl} alt={settings.storeName} fill sizes="32px" className="object-cover" unoptimized />
                </span>
              ) : (
                <span className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet-700 text-sm font-bold text-white">
                  {settings.storeName.charAt(0).toUpperCase()}
                </span>
              )}
              <span className="text-lg tracking-tight text-foreground">{settings.storeName}</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Tecnologia e sofisticação em cada detalhe. Uma experiência de compra premium,
              pensada para quem exige o melhor.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {socialLinks.map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href ?? "#"}
                  target={href ? "_blank" : undefined}
                  rel={href ? "noopener noreferrer" : undefined}
                  className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  aria-label="Rede social"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-foreground">{col.title}</h4>
              <ul className="mt-4 flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} {settings.storeName}. {settings.copyrightText}
          </p>
          <div className="flex items-center gap-4">
            <p>Feito com excelência para uma experiência premium.</p>
            <Link href="/admin/login" className="text-muted-foreground/60 transition-colors hover:text-muted-foreground">
              Área Administrativa
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
