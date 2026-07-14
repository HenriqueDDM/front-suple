import { memo } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  notificationAccent,
  notificationIcon,
  useStoreNotifications,
} from "@/shared/hooks/useStoreNotifications";

export const NotificationsMenu = memo(function NotificationsMenu() {
  const { notifications, unreadCount, dismissAll, openNotification } = useStoreNotifications();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notificações">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 ? (
            <Badge className="absolute -right-0.5 -top-0.5 h-4 min-w-4 justify-center rounded-full px-1 text-[10px]">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[22rem] p-0">
        <div className="flex items-center justify-between px-3 py-2.5">
          <DropdownMenuLabel className="p-0">Notificações</DropdownMenuLabel>
          {unreadCount > 0 ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 gap-1.5 px-2 text-xs text-muted-foreground"
              onClick={dismissAll}
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Limpar
            </Button>
          ) : null}
        </div>
        <DropdownMenuSeparator className="m-0" />

        {notifications.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            Nenhuma notificação no momento.
          </div>
        ) : (
          <ScrollArea className="h-[22rem]">
            <div className="p-1">
              {notifications.map((item) => {
                const Icon = notificationIcon(item.kind);
                return (
                  <DropdownMenuItem
                    key={item.id}
                    className="cursor-pointer items-start gap-3 rounded-md px-3 py-2.5"
                    onSelect={() => openNotification(item)}
                  >
                    <div
                      className={cn(
                        "mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg",
                        notificationAccent(item.kind),
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <p className="truncate text-sm font-medium leading-snug">{item.title}</p>
                      <p className="line-clamp-2 text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </DropdownMenuItem>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
