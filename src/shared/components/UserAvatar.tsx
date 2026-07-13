import { memo } from "react";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { cn } from "@/lib/utils";
import { getInitials } from "@/shared/utils/string";

interface UserAvatarProps {
  name: string;
  className?: string;
  fallbackClassName?: string;
}

export const UserAvatar = memo(function UserAvatar({
  name,
  className,
  fallbackClassName,
}: UserAvatarProps) {
  return (
    <Avatar className={cn("h-9 w-9", className)}>
      <AvatarFallback className={cn("bg-accent text-xs text-accent-foreground", fallbackClassName)}>
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
});
