"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getIconComponent } from "@/lib/icon-mapper";
import { cn } from "@/lib/utils";
import { NavSection } from "@/types/dashboard.interface";
import { UserInfo } from "@/types/user.interface";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Stethoscope, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

  return (
    <div className="hidden md:flex h-full w-64 flex-col border-r border-border/60 bg-sidebar text-sidebar-foreground">
      {/* Brand Header */}
      <div className="flex h-16 items-center border-b border-border/60 px-5">
        <Link href={dashboardHome || "/"} className="flex items-center space-x-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-cyan-500 text-primary-foreground shadow-sm shadow-primary/25 transition-transform group-hover:scale-105">
            <Stethoscope className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
              WellSpace
            </span>
            <span className="text-[10px] font-semibold tracking-wider uppercase text-muted-foreground -mt-1">
              Workspace
            </span>
          </div>
        </Link>
      </div>

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
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20 font-semibold"
                          : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      )}
                    >
                      <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
                      <span className="flex-1 truncate">{item.title}</span>
                      {item.badge && (
                        <Badge
                          variant={isActive ? "secondary" : "default"}
                          className={cn("ml-auto text-xs px-2 py-0.5", isActive ? "bg-white/20 text-white" : "bg-primary/10 text-primary")}
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
      <div className="border-t border-border/60 p-4">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-accent/40 border border-border/40">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary/20 to-cyan-500/20 text-primary flex items-center justify-center font-bold text-sm border border-primary/30">
            {userInfo.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-foreground truncate">{userInfo.name}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <ShieldCheck className="h-3 w-3 text-primary shrink-0" />
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider truncate">
                {userInfo.role.toLowerCase()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebarContent;
