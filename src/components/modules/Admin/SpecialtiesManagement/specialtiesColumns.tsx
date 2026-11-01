import { Column } from "@/components/shared/ManagementTable";
import { ISpecialty } from "@/types/specialties.interface";
import Image from "next/image";

export const specialtiesColumns: Column<ISpecialty>[] = [
  {
    header: "Icon",
    accessor: (specialty) => (
      <Image
        src={specialty.icon}
        alt={specialty.title}
        width={40}
        height={40}
        className="rounded-full object-cover"
      />
    ),
  },
  {
    header: "Title",
    accessor: (specialty) => (
      <span className="font-medium text-foreground">{specialty.title}</span>
    ),
  },
  {
    header: "Created At",
    accessor: (specialty) =>
      specialty.createdAt
        ? new Date(specialty.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "—",
  },
  {
    header: "Updated At",
    accessor: (specialty) =>
      specialty.updatedAt
        ? new Date(specialty.updatedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "—",
  },
];
