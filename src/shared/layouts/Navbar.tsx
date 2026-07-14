import { memo, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Menu, Moon, Sun, LogOut, Settings } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { GlobalSearch } from "@/shared/components/GlobalSearch";
import { NotificationsMenu } from "@/shared/components/NotificationsMenu";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";
import { useTheme } from "@/shared/contexts/ThemeContext";
import { useAuth } from "@/shared/contexts/AuthContext";
import { useSettings } from "@/features/settings/hooks/useSettings";
import { getInitials } from "@/shared/utils/string";
import { env } from "@/config/env";

const ROLE_LABEL: Record<string, string> = {
  ADMIN: "Administrador",
  MANAGER: "Gerente",
  SELLER: "Vendedor",
};

export const Navbar = memo(function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { storeSettings } = useSettings();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const storeName = storeSettings?.name?.trim() || "Loja";
  const logoUrl = storeSettings?.logoUrl?.trim() || "";
  const storeInitials = getInitials(storeName) || "LJ";
  const userName = user?.name ?? "Usuário";
  const userEmail = user?.email ?? "";

  const goToSettings = useCallback(() => {
    void navigate({ to: "/settings", search: { tab: "store" } as never });
  }, [navigate]);

  const handleLogout = useCallback(() => {
    logout();
    queryClient.clear();
    if (!env.useMockApi) {
      void navigate({ to: "/login" });
    }
  }, [logout, navigate, queryClient]);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md lg:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
        aria-label="Abrir menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <GlobalSearch className="hidden max-w-md flex-1 sm:block" />

      <div className="ml-auto flex items-center gap-1.5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"}
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{theme === "dark" ? "Tema claro" : "Tema escuro"}</TooltipContent>
        </Tooltip>

        <NotificationsMenu />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="ml-1 flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Menu da loja"
            >
              <Avatar className="h-9 w-9 rounded-xl">
                {logoUrl ? (
                  <AvatarImage src={logoUrl} alt={storeName} className="object-cover" />
                ) : null}
                <AvatarFallback className="rounded-xl bg-primary text-sm text-primary-foreground">
                  {storeInitials}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{storeName}</span>
                <span className="text-xs font-normal text-muted-foreground">{userName}</span>
                {userEmail ? (
                  <span className="text-xs font-normal text-muted-foreground">{userEmail}</span>
                ) : null}
                {user?.role ? (
                  <span className="mt-0.5 text-xs font-normal text-muted-foreground">
                    {ROLE_LABEL[user.role] ?? user.role}
                  </span>
                ) : null}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={goToSettings}>
              <Settings className="h-4 w-4" />
              Configurações
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onSelect={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
});
