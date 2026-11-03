import { Building2, CreditCard, Stethoscope, UserCheck } from "lucide-react";

export const contactDepartments = [
  {
    id: "clinical",
    name: "Patient & Clinical Care",
    icon: Stethoscope,
    email: "clinical@wellspace.health",
    phone: "+880 1700-000001",
    description:
      "Consultation coordination, prescription queries, and patient records.",
  },
  {
    id: "billing",
    name: "Billing & Refund Inquiries",
    icon: CreditCard,
    email: "billing@wellspace.health",
    phone: "+880 1700-000002",
    description: "Payment status, invoice receipts, and 24-hr refund requests.",
  },
  {
    id: "providers",
    name: "Doctor Credentialing",
    icon: UserCheck,
    email: "providers@wellspace.health",
    phone: "+880 1700-000003",
    description:
      "Physician onboarding, BMDC verification, and scheduling portal.",
  },
  {
    id: "corporate",
    name: "Corporate Health & NGOs",
    icon: Building2,
    email: "enterprise@wellspace.health",
    phone: "+880 1700-000004",
    description:
      "Employee health benefits, NGO camps, and diagnostic center tie-ups.",
  },
] as const;

export type ContactDepartmentId = (typeof contactDepartments)[number]["id"];

export const isContactDepartmentId = (
  value: string,
): value is ContactDepartmentId =>
  contactDepartments.some((department) => department.id === value);
