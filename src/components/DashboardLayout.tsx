import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet } from "react-router-dom";
import AuroraBackground from "@/components/futuristic/AuroraBackground";

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <div dir="rtl" className="relative min-h-screen flex w-full dark">
        <AuroraBackground />
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b border-white/5 px-4 glass">
            <SidebarTrigger className="mr-2" />
          </header>
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
