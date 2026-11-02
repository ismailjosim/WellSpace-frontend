import React from "react";
import DashboardSidebar from "@/components/modules/Dashboard/DashboardSidebar";
import DashboardNav from "@/components/modules/Dashboard/DashboardNav";
import { DashboardSidebarProvider } from "@/context/DashboardSidebarContext";
import { TooltipProvider } from "@/components/ui/tooltip";

const CommonDashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <DashboardSidebarProvider>
      <TooltipProvider delayDuration={150}>
        <div className="flex h-screen max-h-screen h-dvh max-h-dvh overflow-hidden">
          <DashboardSidebar />
          <div className="flex flex-1 flex-col overflow-hidden min-w-0">
            <DashboardNav />
            <main className="flex-1 overflow-y-auto bg-accent/25 dark:bg-background/90 p-4 md:p-8">
              <div>{children}</div>
            </main>
          </div>
        </div>
      </TooltipProvider>
    </DashboardSidebarProvider>
  );
};

export default CommonDashboardLayout;
