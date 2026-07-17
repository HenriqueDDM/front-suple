import { memo, useCallback, useEffect, useState } from "react";
import { Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { Sidebar } from "@/shared/layouts/Sidebar";
import { Navbar } from "@/shared/layouts/Navbar";
import { useAuth } from "@/shared/contexts/AuthContext";
import { useTheme } from "@/shared/contexts/ThemeContext";
import { useSettings } from "@/features/settings/hooks/useSettings";
import { env } from "@/config/env";

export const AdminLayout = memo(function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();
  const { setBranding } = useTheme();
  const { storeSettings } = useSettings();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  const handleCloseSidebar = useCallback(() => setMobileOpen(false), []);
  const handleOpenSidebar = useCallback(() => setMobileOpen(true), []);

  useEffect(() => {
    if (env.useMockApi || isLoading) return;
    if (!isAuthenticated) {
      void navigate({ to: "/login" });
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    if (!storeSettings) return;
    setBranding(storeSettings.primaryColor, storeSettings.interfaceRadius);
    document.title = `${storeSettings.name || "Supl"} — Gestão da loja`;
  }, [setBranding, storeSettings]);

  if (!env.useMockApi && (isLoading || !isAuthenticated)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Carregando...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background">
      <div className="app-atmosphere" aria-hidden="true" />
      <Sidebar mobileOpen={mobileOpen} onClose={handleCloseSidebar} />
      <div className="relative lg:pl-64">
        <Navbar onMenuClick={handleOpenSidebar} />
        <main
          key={pathname}
          id="main-content"
          className="page-enter mx-auto w-full max-w-[1400px] space-y-6 p-4 lg:p-7"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
});
