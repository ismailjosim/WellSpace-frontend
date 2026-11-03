import DashboardSidebarContent from "./DashboardSidebarContent";
import { getDashboardNavData } from "@/services/dashboard/dashboardNavData";

const DashboardSidebar = async () => {
  const { userInfo, navItems, dashboardHome } = await getDashboardNavData();

  return (
    <DashboardSidebarContent
      userInfo={userInfo}
      navItems={navItems}
      dashboardHome={dashboardHome}
    />
  );
};

export default DashboardSidebar;
