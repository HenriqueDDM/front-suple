import { lazyRouteComponent } from "@tanstack/react-router";
import { RouteFallback } from "@/shared/components/RouteFallback";

export function lazyPage<T extends Record<string, unknown>>(
  importer: () => Promise<T>,
  exportName: keyof T,
) {
  return {
    component: lazyRouteComponent(importer, exportName),
    pendingComponent: RouteFallback,
  };
}
