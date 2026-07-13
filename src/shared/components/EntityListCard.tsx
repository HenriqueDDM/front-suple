import type { ReactNode } from "react";
import { Card, CardContent } from "@/shared/ui/card";
import { SearchInput } from "@/shared/components/SearchInput";
import { cn } from "@/lib/utils";

interface EntityListCardProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  searchClassName?: string;
  isEmpty: boolean;
  emptyState: ReactNode;
  children: ReactNode;
  contentClassName?: string;
}

export function EntityListCard({
  searchValue,
  onSearchChange,
  searchPlaceholder,
  searchClassName,
  isEmpty,
  emptyState,
  children,
  contentClassName,
}: EntityListCardProps) {
  return (
    <Card>
      <CardContent className={cn("space-y-4 p-4 sm:p-6", contentClassName)}>
        <SearchInput
          value={searchValue}
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
          className={cn("max-w-sm", searchClassName)}
        />
        {isEmpty ? emptyState : children}
      </CardContent>
    </Card>
  );
}
