"use client";

import React, {
  createContext,
  useContext,
  useState,
  useSyncExternalStore,
} from "react";

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
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const [userCollapsed, setUserCollapsed] = useState<boolean | null>(null);

  const isCollapsed = mounted
    ? (userCollapsed ??
      (() => {
        try {
          return (
            localStorage.getItem("wellspace_dashboard_sidebar_collapsed") ===
            "true"
          );
        } catch {
          return false;
        }
      })())
    : false;

  const toggleSidebar = () => {
    setUserCollapsed((prev) => {
      const current =
        prev ??
        (() => {
          try {
            return (
              localStorage.getItem("wellspace_dashboard_sidebar_collapsed") ===
              "true"
            );
          } catch {
            return false;
          }
        })();
      const next = !current;
      try {
        localStorage.setItem(
          "wellspace_dashboard_sidebar_collapsed",
          String(next),
        );
      } catch {
        // ignore
      }
      return next;
    });
  };

  const setCollapsed = (collapsed: boolean) => {
    setUserCollapsed(collapsed);
    try {
      localStorage.setItem(
        "wellspace_dashboard_sidebar_collapsed",
        String(collapsed),
      );
    } catch {
      // ignore
    }
  };

  return (
    <DashboardSidebarContext.Provider
      value={{
        isCollapsed,
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
      "useDashboardSidebar must be used within a DashboardSidebarProvider",
    );
  }
  return context;
};
