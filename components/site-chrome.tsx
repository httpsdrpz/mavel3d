"use client";

import { usePathname } from "next/navigation";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  // The home page ships its own MAVEL-branded navbar/footer (see app/page.tsx),
  // so it opts out of the shared chrome the rest of the store still uses.
  const isHome = pathname === "/";

  if (isAdmin || isHome) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
    </>
  );
}
