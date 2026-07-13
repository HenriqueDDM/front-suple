import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/shared/layouts/AdminLayout";

export const Route = createFileRoute("/_app")({
  component: AdminLayout,
});
