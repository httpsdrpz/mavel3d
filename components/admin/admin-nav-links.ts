import {
  LayoutDashboard,
  Package,
  Tags,
  ClipboardList,
  Users,
  Settings,
  LayoutTemplate,
  Image as ImageIcon,
  MessageSquareQuote,
  UserCog,
  type LucideIcon,
} from "lucide-react";

export interface AdminNavLink {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const ADMIN_NAV_LINKS: AdminNavLink[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/produtos", label: "Produtos", icon: Package },
  { href: "/admin/categorias", label: "Categorias", icon: Tags },
  { href: "/admin/landing", label: "Landing Page", icon: LayoutTemplate },
  { href: "/admin/midia", label: "Biblioteca de Mídia", icon: ImageIcon },
  { href: "/admin/depoimentos", label: "Depoimentos", icon: MessageSquareQuote },
  { href: "/admin/pedidos", label: "Pedidos", icon: ClipboardList },
  { href: "/admin/clientes", label: "Clientes", icon: Users },
  { href: "/admin/usuarios", label: "Usuários", icon: UserCog },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
];

export function isAdminLinkActive(pathname: string | null, href: string) {
  if (!pathname) return false;
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}
