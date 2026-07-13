import { Skeleton } from "@/shared/ui/skeleton";
import { Loading } from "@/shared/components/Loading";

export function RouteFallback() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <Loading rows={6} />
    </div>
  );
}
