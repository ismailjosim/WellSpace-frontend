import { cache } from "react";
import { getNavItemsByRole } from "@/lib/navitems.config";
import { getDefaultDashboardRoutes } from "@/lib/auth-utils";
import { getMyAppointmentCount } from "@/services/patient/appointment.service";
import { getUserInfo } from "@/services/auth/getUserInfo";
import type { UserInfo } from "@/types/user.interface";

export const getDashboardNavData = cache(async () => {
  const userInfo = (await getUserInfo()) as UserInfo;
  const appointmentCount =
    userInfo.role === "DOCTOR" ? await getMyAppointmentCount() : undefined;

  return {
    userInfo,
    navItems: getNavItemsByRole(userInfo.role, appointmentCount),
    dashboardHome: getDefaultDashboardRoutes(userInfo.role),
  };
});
