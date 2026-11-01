"use client";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { NavSection } from "@/types/dashboard.interface";
import { UserInfo } from "@/types/user.interface";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getIconComponent } from "../../../lib/icon-mapper";
import { ShieldCheck } from "lucide-react";
import { BrandLogo } from "@/components/shared/BrandLogo";

interface DashboardMobileSidebarContentProps {
  userInfo: UserInfo | null;
  navItems: NavSection[];
  dashboardHome: string;
}

const DashboardMobileSidebar = ({
  userInfo,
  navItems,
  dashboardHome,
}: DashboardMobileSidebarContentProps) => {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-border/60 px-5">
        <BrandLogo href={dashboardHome || "/"} textSize="md" />
      </div>
      <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-6">
          {navItems.map((section, sectionIdx) => (
            <div key={sectionIdx}>
              {section.title && (
                <h4 className="mb-2 px-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  {section.title}
                </h4>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = getIconComponent(item.icon);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                        isActive
                          ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                          : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="flex-1">{item.title}</span>
                      {item.badge && (
                        <Badge
                          variant={isActive ? "secondary" : "default"}
                          className={cn(
                            "text-xs",
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-primary/10 text-primary",
                          )}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </div>
              {sectionIdx < navItems.length - 1 && (
                <Separator className="my-4 opacity-50" />
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* User Info at Bottom */}
      {userInfo && (
        <div className="border-t border-border/60 p-4">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-accent/40 border border-border/40">
            <div className="h-9 w-9 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
              {userInfo.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-foreground truncate">
                {userInfo.name}
              </p>
              <div className="flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-primary shrink-0" />
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider truncate">
                  {userInfo.role.toLowerCase()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardMobileSidebar;
