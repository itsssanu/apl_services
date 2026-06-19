import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";

export default function DashboardLayout({
  sidebarOpen,
  setSidebarOpen,
  workItems
}) {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        <TopNav
          onMenuClick={() => setSidebarOpen(true)}
          notifCount={
            workItems.filter(i => i.status === "Pending").length
          }
        />

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>

      </div>

    </div>
  );
}