import { memo, useCallback, useEffect } from "react";
import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Building2, LayoutDashboard, LogOut, Store } from "lucide-react";
import { useAuth } from "@/shared/contexts/AuthContext";
import { isPlatformAdmin } from "@/types/auth";
import { APP_LOGO_URL, APP_NAME, APP_SHORT_NAME } from "@/shared/constants/brand";
import { env } from "@/config/env";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/ui/button";

const NAV = [
  { to: "/admin", label: "Visão geral", icon: LayoutDashboard, exact: true },
  { to: "/admin/stores", label: "Lojas", icon: Store, exact: false },
] as const;

export const PlatformLayout = memo(function PlatformLayout() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => {
    if (env.useMockApi || isLoading) return;
    if (!isAuthenticated) {
      void navigate({ to: "/login" });
      return;
    }
    if (!isPlatformAdmin(user)) {
      void navigate({ to: "/dashboard" });
    }
  }, [isAuthenticated, isLoading, navigate, user]);

  useEffect(() => {
    document.title = `Admin — ${APP_NAME}`;
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    queryClient.clear();
    void navigate({ to: "/login" });
  }, [logout, navigate, queryClient]);

  if (!env.useMockApi && (isLoading || !isAuthenticated || !isPlatformAdmin(user))) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a1430] text-sm text-white/70">
        Carregando admin...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f6fb] text-[#0a1430]">
      <header className="sticky top-0 z-30 border-b border-[#dfe5f2] bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <img src={APP_LOGO_URL} alt="" className="h-9 w-9 object-contain" />
            <div>
              <p className="text-sm font-semibold tracking-tight">
                {APP_SHORT_NAME} <span className="text-[#1B4DE0]">Admin</span>
              </p>
              <p className="text-xs text-[#5a6478]">Painel da plataforma</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-[#5a6478] sm:inline">{user?.email}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" /> Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[220px_1fr]">
        <aside className="h-fit rounded-2xl border border-[#dfe5f2] bg-white p-3">
          <nav className="space-y-1">
            {NAV.map((item) => {
              const active = item.exact
                ? pathname === item.to
                : pathname === item.to || pathname.startsWith(`${item.to}/`);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-[#1B4DE0] text-white"
                      : "text-[#3b4559] hover:bg-[#eef2fb]",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-4 rounded-xl bg-[#eef2fb] p-3 text-xs text-[#5a6478]">
            <Building2 className="mb-1 h-4 w-4 text-[#1B4DE0]" />
            Controle de lojas, planos e acesso.
          </div>
        </aside>

        <main className="min-w-0 space-y-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
});
