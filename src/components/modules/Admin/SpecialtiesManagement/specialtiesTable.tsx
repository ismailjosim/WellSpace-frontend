"use client";
import DeleteConfirmationDialog from "@/components/shared/DeleteConfirmationDialog";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { ISpecialty } from "@/types/specialties.interface";
import { deleteSpecialty } from "@/services/admin/specialtiesManagement";
import ManagementTable from "@/components/shared/ManagementTable";
import { specialtiesColumns } from "./specialtiesColumns";
import SpecialtiesFormDialog from "./SpecialtiesFormDialog";

interface SpecialtyTableProps {
  specialties: ISpecialty[];
}

const SpecialtiesTable = ({ specialties }: SpecialtyTableProps) => {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [editingSpecialty, setEditingSpecialty] = useState<ISpecialty | null>(
    null,
  );
  const [deletingSpecialty, setDeletingSpecialty] = useState<ISpecialty | null>(
    null,
  );
  const [isDeletingDialog, setIsDeletingDialog] = useState(false);

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const handleEdit = (specialty: ISpecialty) => {
    setEditingSpecialty(specialty);
  };

  const handleDelete = (specialty: ISpecialty) => {
    setDeletingSpecialty(specialty);
  };

  const confirmDelete = async () => {
    if (!deletingSpecialty) return;

    setIsDeletingDialog(true);
    const result = await deleteSpecialty(deletingSpecialty.id);
    setIsDeletingDialog(false);
    if (result.success) {
      toast.success(result.message || "Specialty deleted successfully");
      setDeletingSpecialty(null);
      handleRefresh();
    } else {
      toast.error(result.message || "Failed to delete Specialty");
    }
  };

  return (
    <>
      <ManagementTable
        data={specialties}
        columns={specialtiesColumns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        getRowKey={(specialty) => specialty.id}
        emptyMessage="No specialties found"
      />

      {/* Edit Specialty Modal */}
      {editingSpecialty && (
        <SpecialtiesFormDialog
          open={!!editingSpecialty}
          onClose={() => setEditingSpecialty(null)}
          onSuccess={handleRefresh}
          specialty={editingSpecialty}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={!!deletingSpecialty}
        onOpenChange={(open) => !open && setDeletingSpecialty(null)}
        onConfirm={confirmDelete}
        title="Delete Specialty"
        description={`Are you sure you want to delete ${deletingSpecialty?.title}? This action cannot be undone.`}
        isDeleting={isDeletingDialog}
      />
    </>
  );
};

export default SpecialtiesTable;
