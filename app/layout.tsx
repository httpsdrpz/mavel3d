import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ProductsProvider } from "@/context/products-context";
import { CategoriesProvider } from "@/context/categories-context";
import { SettingsProvider } from "@/context/settings-context";
import { CartProvider } from "@/context/cart-context";
import { SiteChrome } from "@/components/site-chrome";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Marvel — Loja de tecnologia premium",
    template: "%s | Marvel",
  },
  description:
    "Encontre produtos incríveis. Qualidade, tecnologia e experiência premium na Marvel.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <ProductsProvider>
          <CategoriesProvider>
            <SettingsProvider>
              <CartProvider>
                <SiteChrome>{children}</SiteChrome>
                <Toaster />
              </CartProvider>
            </SettingsProvider>
          </CategoriesProvider>
        </ProductsProvider>
      </body>
    </html>
  );
}
