import { memo, useCallback, useState } from "react";
import { Outlet } from "@tanstack/react-router";
import { Sidebar } from "@/shared/layouts/Sidebar";
import { Navbar } from "@/shared/layouts/Navbar";

export const AdminLayout = memo(function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleCloseSidebar = useCallback(() => setMobileOpen(false), []);
  const handleOpenSidebar = useCallback(() => setMobileOpen(true), []);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar mobileOpen={mobileOpen} onClose={handleCloseSidebar} />
      <div className="lg:pl-64">
        <Navbar onMenuClick={handleOpenSidebar} />
        <main id="main-content" className="mx-auto w-full max-w-[1400px] space-y-6 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
});
