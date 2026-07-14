import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Boxes,
  BarChart3,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  exact?: boolean;
  search?: Record<string, string>;
}

export const NAV_ITEMS: NavItem[] = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard, exact: true },
  { title: "Produtos", url: "/products", icon: Package },
  { title: "Clientes", url: "/customers", icon: Users },
  { title: "Vendas", url: "/sales", icon: ShoppingCart },
  { title: "Estoque", url: "/stock", icon: Boxes },
  { title: "Relatórios", url: "/reports", icon: BarChart3 },
  {
    title: "Configurações",
    url: "/settings",
    icon: Settings,
    search: { tab: "store" },
  },
];
