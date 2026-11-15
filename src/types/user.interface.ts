import { UserRole } from "../lib/auth-utils";
import { IAdmin } from "./admin.interface";
import { IDoctor } from "./doctor.interface";
import { IPatient } from "./patient.interface";

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  needPasswordChange: boolean;
  status: "ACTIVE" | "BLOCKED" | "DELETED";
  isMfaEnabled?: boolean;
  mfaMethod?: string;
  admin?: IAdmin;
  shopStaff?: {
    id: string;
    name: string;
    email: string;
    contactNumber: string;
  };
  patient?: IPatient;
  doctor?: IDoctor;
  createdAt: string;
  updatedAt: string;
}
