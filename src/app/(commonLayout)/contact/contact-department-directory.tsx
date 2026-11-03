"use client";

import { Badge } from "@/components/ui/badge";
import {
  contactDepartments,
  type ContactDepartmentId,
} from "./contact-departments";

type ContactDepartmentDirectoryProps = {
  selectedDepartment: ContactDepartmentId;
  onSelectDepartment: (department: ContactDepartmentId) => void;
};

export default function ContactDepartmentDirectory({
  selectedDepartment,
  onSelectDepartment,
}: ContactDepartmentDirectoryProps) {
  return (
    <section aria-labelledby="department-directory" className="space-y-4">
      <h2
        id="department-directory"
        className="text-lg font-bold text-foreground"
      >
        Direct Department Directory
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {contactDepartments.map((department) => {
          const Icon = department.icon;
          const isSelected = selectedDepartment === department.id;

          return (
            <button
              key={department.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelectDepartment(department.id)}
              className={`rounded-2xl border text-left transition-all ${
                isSelected
                  ? "border-primary bg-primary/5 shadow-md ring-1 ring-primary/20"
                  : "border-border/60 bg-card hover:border-primary/40"
              }`}
            >
              <span className="block space-y-2.5 p-4">
                <span className="flex items-center justify-between">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                  </span>
                  {isSelected && (
                    <Badge className="bg-primary px-2 py-0.5 text-[10px] text-primary-foreground">
                      Selected
                    </Badge>
                  )}
                </span>
                <span className="block">
                  <span className="block text-xs font-bold text-foreground">
                    {department.name}
                  </span>
                  <span className="mt-0.5 line-clamp-2 block text-[11px] text-muted-foreground">
                    {department.description}
                  </span>
                </span>
                <span className="block space-y-0.5 border-t border-border/40 pt-1 text-[11px] text-muted-foreground">
                  <span className="block font-medium text-foreground">
                    {department.email}
                  </span>
                  <span className="block">{department.phone}</span>
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
