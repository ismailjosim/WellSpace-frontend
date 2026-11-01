import { NavSection } from "@/types/dashboard.interface";
import { getDefaultDashboardRoutes, UserRole } from "./auth-utils";

export const getCommonNavItems = (role: UserRole): NavSection[] => {
  const defaultDashboard = getDefaultDashboardRoutes(role);

  return [
    {
      items: [
        {
          title: "Dashboard",
          href: defaultDashboard,
          icon: "LayoutDashboard",
          roles: ["PATIENT", "DOCTOR", "ADMIN", "SUPER_ADMIN"],
        },
        {
          title: "My Profile",
          href: `/my-profile`,
          icon: "User",
          roles: ["PATIENT", "DOCTOR", "ADMIN", "SUPER_ADMIN"],
        },
      ],
    },
    {
      title: "Settings",
      items: [
        {
          title: "Change Password",
          href: "/change-password",
          icon: "Settings",
          roles: ["PATIENT"],
        },
      ],
    },
  ];
};

export const doctorNavItems: NavSection[] = [
  {
    title: "Patient Management",
    items: [
      {
        title: "Appointments",
        href: "/doctor/dashboard/appointments",
        icon: "Calendar",
        badge: "3",
        roles: ["DOCTOR"],
      },
      {
        title: "My Schedules",
        href: "/doctor/dashboard/my-schedules",
        icon: "Clock",
        roles: ["DOCTOR"],
      },
      {
        title: "Prescriptions",
        href: "/doctor/dashboard/prescriptions",
        icon: "FileText",
        roles: ["DOCTOR"],
      },
    ],
  },
];

export const patientNavItems: NavSection[] = [
  {
    title: "Appointments",
    items: [
      {
        title: "My Appointments",
        href: "/dashboard/my-appointments",
        icon: "Calendar",
        roles: ["PATIENT"],
      },
      {
        title: "Book Appointment",
        href: "/consultation",
        icon: "ClipboardList",
        roles: ["PATIENT"],
      },
    ],
  },
  {
    title: "Medical Records",
    items: [
      {
        title: "My Prescriptions",
        href: "/dashboard/my-prescriptions",
        icon: "FileText",
        roles: ["PATIENT"],
      },
      {
        title: "Health Records",
        href: "/dashboard/health-records",
        icon: "Activity",
        roles: ["PATIENT"],
      },
    ],
  },
];

export const adminNavItems: NavSection[] = [
  {
    title: "User Management",
    items: [
      {
        title: "Admins",
        href: "/admin/dashboard/admins-management",
        icon: "Shield",
        roles: ["ADMIN", "SUPER_ADMIN"],
      },
      {
        title: "Doctors",
        href: "/admin/dashboard/doctors-management",
        icon: "Stethoscope",
        roles: ["ADMIN", "SUPER_ADMIN"],
      },
      {
        title: "Patients",
        href: "/admin/dashboard/patients-management",
        icon: "Users",
        roles: ["ADMIN", "SUPER_ADMIN"],
      },
    ],
  },
  {
    title: "Hospital Management",
    items: [
      {
        title: "Appointments",
        href: "/admin/dashboard/appointments-management",
        icon: "Calendar",
        roles: ["ADMIN", "SUPER_ADMIN"],
      },
      {
        title: "Schedules",
        href: "/admin/dashboard/schedules-management",
        icon: "Clock",
        roles: ["ADMIN", "SUPER_ADMIN"],
      },
      {
        title: "Specialties",
        href: "/admin/dashboard/specialties-management",
        icon: "Hospital",
        roles: ["ADMIN", "SUPER_ADMIN"],
      },
    ],
  },
  {
    title: "Operations & Governance",
    items: [
      {
        title: "Audit Logs",
        href: "/admin/dashboard/audit-logs",
        icon: "ShieldAlert",
        roles: ["ADMIN", "SUPER_ADMIN"],
      },
      {
        title: "Platform Settings",
        href: "/admin/dashboard/settings",
        icon: "Settings",
        roles: ["ADMIN", "SUPER_ADMIN"],
      },
    ],
  },
];

export const getNavItemsByRole = (role: UserRole): NavSection[] => {
  const commonNavItems = getCommonNavItems(role);

  switch (role) {
    case "SUPER_ADMIN":
    case "ADMIN":
      return [...commonNavItems, ...adminNavItems];
    case "DOCTOR":
      return [...commonNavItems, ...doctorNavItems];
    case "PATIENT":
      return [...commonNavItems, ...patientNavItems];
    default:
      return [];
  }
};
