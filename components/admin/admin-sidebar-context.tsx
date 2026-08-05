"use client";

import * as React from "react";

interface AdminSidebarContextValue {
  collapsed: boolean;
  toggle: () => void;
}

const AdminSidebarContext = React.createContext<AdminSidebarContextValue | null>(null);
const STORAGE_KEY = "marvel-admin-sidebar-collapsed";

export function AdminSidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(false);

  React.useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from a browser-only store; must run after mount to avoid an SSR mismatch
    if (stored === "true") setCollapsed(true);
  }, []);

  React.useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, String(collapsed));
  }, [collapsed]);

  const toggle = React.useCallback(() => setCollapsed((c) => !c), []);

  return (
    <AdminSidebarContext.Provider value={{ collapsed, toggle }}>
      {children}
    </AdminSidebarContext.Provider>
  );
}

export function useAdminSidebar() {
  const ctx = React.useContext(AdminSidebarContext);
  if (!ctx) throw new Error("useAdminSidebar deve ser usado dentro de AdminSidebarProvider");
  return ctx;
}
