import { redirect } from "next/navigation";

import { requireAdminSession } from "@/lib/supabase/admin";
import { AdminSidebarProvider } from "@/components/admin/admin-sidebar-context";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";

// Per-session, cookie-gated area — never prerender/cache it at build time.
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  try {
    await requireAdminSession();
  } catch {
    redirect("/admin/login");
  }

  return (
    <AdminSidebarProvider>
      <div className="flex min-h-screen w-full bg-secondary/40">
        <AdminSidebar />
        <div className="flex flex-1 flex-col">
          <AdminHeader />
          <main className="flex-1 p-4 sm:p-6 lg:p-10">{children}</main>
        </div>
      </div>
    </AdminSidebarProvider>
  );
}
