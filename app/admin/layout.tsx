import { AdminSidebarProvider } from "@/components/admin/admin-sidebar-context";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
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
