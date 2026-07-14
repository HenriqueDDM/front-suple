import { memo } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Dumbbell, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/shared/constants/navigation";
import { useSettings } from "@/features/settings/hooks/useSettings";

export const Sidebar = memo(function Sidebar({
  mobileOpen,
  onClose,
}: {
  mobileOpen: boolean;
  onClose: () => void;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { storeSettings } = useSettings();

  const brandName = storeSettings?.name?.trim() || "Supl";
  const logoUrl = storeSettings?.logoUrl?.trim() || "";

  const isActive = (url: string, exact?: boolean) =>
    exact ? pathname === url : pathname === url || pathname.startsWith(url + "/");

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-200 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
        aria-label="Menu principal"
      >
        <div className="flex h-16 items-center justify-between gap-2 px-5">
          <Link to="/" className="flex min-w-0 items-center gap-2.5" onClick={onClose}>
            {logoUrl ? (
              <img
                src={logoUrl}
                alt=""
                className="h-9 w-9 shrink-0 rounded-xl object-cover"
              />
            ) : (
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
                <Dumbbell className="h-5 w-5" />
              </div>
            )}
            <span className="truncate text-lg font-semibold tracking-tight text-sidebar-foreground">
              {brandName}
            </span>
          </Link>
          <button
            type="button"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-muted-foreground hover:bg-sidebar-accent lg:hidden"
            onClick={onClose}
            aria-label="Fechar menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.url, item.exact);
            return (
              <Link
                key={item.url}
                to={item.url}
                {...(item.search ? { search: item.search as never } : {})}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <item.icon className="h-[18px] w-[18px] shrink-0" />
                <span className="truncate">{item.title}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-4">
          <div className="rounded-lg bg-sidebar-accent px-3 py-3">
            <p className="text-xs font-medium text-sidebar-accent-foreground">Plano Pro</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Gestão completa da sua loja.</p>
          </div>
        </div>
      </aside>
    </>
  );
});
