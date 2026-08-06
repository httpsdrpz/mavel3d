import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { hasAnyAdmin } from "@/services/users";
import { SetupForm } from "@/components/admin/setup-form";

export const metadata: Metadata = {
  title: "Criar conta de administrador | MAVEL",
};

// Bootstrap-only route: once an ADMIN exists, this page must not be reachable.
export const dynamic = "force-dynamic";

export default async function AdminSetupPage() {
  if (await hasAnyAdmin()) {
    redirect("/admin/login");
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-zinc-950 p-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.15),transparent_60%)]" />

      <div className="relative flex flex-col items-center gap-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-purple-500 text-sm font-bold text-white shadow-md shadow-violet-600/30">
            M
          </span>
          <span className="text-lg font-semibold tracking-tight text-white">MAVEL</span>
        </Link>

        <SetupForm />
      </div>
    </div>
  );
}
