"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface DashboardSidebarContextType {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  setCollapsed: (collapsed: boolean) => void;
}

const DashboardSidebarContext = createContext<
  DashboardSidebarContextType | undefined
>(undefined);

export const DashboardSidebarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("wellspace_dashboard_sidebar_collapsed");
      if (saved !== null) {
        setIsCollapsed(saved === "true");
      }
    } catch {
      // ignore local storage restrictions
    }
    setMounted(true);
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(
          "wellspace_dashboard_sidebar_collapsed",
          String(next)
        );
      } catch {
        // ignore
      }
      return next;
    });
  };

  const setCollapsed = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
    try {
      localStorage.setItem(
        "wellspace_dashboard_sidebar_collapsed",
        String(collapsed)
      );
    } catch {
      // ignore
    }
  };

  return (
    <DashboardSidebarContext.Provider
      value={{
        isCollapsed: mounted ? isCollapsed : false,
        toggleSidebar,
        setCollapsed,
      }}
    >
      {children}
    </DashboardSidebarContext.Provider>
  );
};

export const useDashboardSidebar = () => {
  const context = useContext(DashboardSidebarContext);
  if (!context) {
    throw new Error(
      "useDashboardSidebar must be used within a DashboardSidebarProvider"
    );
  }
  return context;
};

