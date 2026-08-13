import type { ReactNode } from "react";
import { Card, CardContent } from "@/shared/ui/card";
import { SearchInput } from "@/shared/components/SearchInput";
import { cn } from "@/lib/utils";

interface EntityListCardProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  searchClassName?: string;
  isLoading?: boolean;
  loadingState?: ReactNode;
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
  isLoading = false,
  loadingState,
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
        {isLoading ? (loadingState ?? null) : isEmpty ? emptyState : children}
      </CardContent>
    </Card>
  );
}
