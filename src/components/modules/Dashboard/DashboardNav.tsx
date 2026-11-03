import DashboardNavbarContent from "./DashboardNavbarContent";
import { getDashboardNavData } from "@/services/dashboard/dashboardNavData";

const DashboardNav = async () => {
  const { userInfo, navItems, dashboardHome } = await getDashboardNavData();
  return (
    <DashboardNavbarContent
      userInfo={userInfo}
      navItems={navItems}
      dashboardHome={dashboardHome}
    />
  );
};

export default DashboardNav;
