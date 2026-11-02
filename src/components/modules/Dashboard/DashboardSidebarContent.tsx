"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getIconComponent } from "@/lib/icon-mapper";
import { cn } from "@/lib/utils";
import { NavSection } from "@/types/dashboard.interface";
import { UserInfo } from "@/types/user.interface";
import {
  PanelLeftClose,
  PanelLeftOpen,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { useDashboardSidebar } from "@/context/DashboardSidebarContext";

interface DashboardSidebarContentProps {
  userInfo: UserInfo;
  navItems: NavSection[];
  dashboardHome: string;
}

const DashboardSidebarContent = ({
  userInfo,
  navItems,
  dashboardHome,
}: DashboardSidebarContentProps) => {
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar } = useDashboardSidebar();

  return (
    <aside
      className={cn(
        "hidden md:flex h-full flex-col border-r border-border/60 bg-sidebar text-sidebar-foreground min-h-0 transition-all duration-300 ease-in-out select-none",
        isCollapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Brand Header */}
      <div
        className={cn(
          "flex h-16 shrink-0 items-center border-b border-border/60 transition-all",
          isCollapsed ? "justify-center px-2" : "justify-between px-5"
        )}
      >
        <BrandLogo
          href={dashboardHome || "/"}
          showText={!isCollapsed}
          textSize="md"
          subtitle="Workspace"
        />

        {!isCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
            title="Fold sidebar"
          >
            <PanelLeftClose className="h-4 w-4" />
            <span className="sr-only">Fold sidebar</span>
          </Button>
        )}
      </div>

      {/* Navigation */}
      <div className={cn("flex-1 min-h-0 overflow-y-auto py-4", isCollapsed ? "px-2" : "px-3")}>
        <nav className={cn("space-y-6", isCollapsed && "space-y-3")}>
          {navItems.map((section, sectionIdx) => (
            <div key={sectionIdx}>
              {section.title && !isCollapsed && (
                <h4 className="mb-2 px-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider truncate">
                  {section.title}
                </h4>
              )}

              {isCollapsed && sectionIdx > 0 && (
                <Separator className="my-2 opacity-50" />
              )}

              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = getIconComponent(item.icon);

                  if (isCollapsed) {
                    return (
                      <Tooltip key={item.href}>
                        <TooltipTrigger asChild>
                          <Link
                            href={item.href}
                            className={cn(
                              "flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 mx-auto relative",
                              isActive
                                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20 font-semibold"
                                : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                            )}
                          >
                            <Icon className="h-4 w-4 shrink-0" />
                            {item.badge && (
                              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground ring-2 ring-sidebar">
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="flex items-center gap-2">
                          <span className="font-medium">{item.title}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                              {item.badge}
                            </Badge>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    );
                  }

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20 font-semibold"
                          : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4 shrink-0",
                          isActive
                            ? "text-primary-foreground"
                            : "text-muted-foreground"
                        )}
                      />
                      <span className="flex-1 truncate">{item.title}</span>
                      {item.badge && (
                        <Badge
                          variant={isActive ? "secondary" : "default"}
                          className={cn(
                            "ml-auto text-xs px-2 py-0.5",
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-primary/10 text-primary"
                          )}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </div>

              {!isCollapsed && sectionIdx < navItems.length - 1 && (
                <Separator className="my-4 opacity-50" />
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom User Area & Quick Fold/Unfold */}
      <div className={cn("shrink-0 border-t border-border/60 transition-all", isCollapsed ? "p-2.5" : "p-4")}>
        {isCollapsed ? (
          <div className="flex flex-col items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary/20 to-cyan-500/20 text-primary flex items-center justify-center font-bold text-sm border border-primary/30 cursor-pointer">
                  {userInfo.name.charAt(0).toUpperCase()}
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="font-semibold">{userInfo.name}</p>
                <p className="text-[10px] text-muted-foreground uppercase">
                  {userInfo.role.toLowerCase()}
                </p>
              </TooltipContent>
            </Tooltip>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
              title="Unfold sidebar"
            >
              <PanelLeftOpen className="h-4 w-4" />
              <span className="sr-only">Unfold sidebar</span>
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-2 rounded-xl bg-accent/40 border border-border/40">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary/20 to-cyan-500/20 text-primary flex items-center justify-center font-bold text-sm border border-primary/30 shrink-0">
              {userInfo.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-foreground truncate">
                {userInfo.name}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <ShieldCheck className="h-3 w-3 text-primary shrink-0" />
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider truncate">
                  {userInfo.role.toLowerCase()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default DashboardSidebarContent;
