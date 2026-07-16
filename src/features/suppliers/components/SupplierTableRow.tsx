import { memo, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import type { Supplier } from "@/types";
import { TableRowActions } from "@/shared/components/TableRowActions";
import { TableCell, TableRow } from "@/shared/ui/table";

interface SupplierTableRowProps {
  supplier: Supplier;
  onEdit: (supplier: Supplier) => void;
  onDelete: (id: string) => void;
}

export const SupplierTableRow = memo(function SupplierTableRow({
  supplier,
  onEdit,
  onDelete,
}: SupplierTableRowProps) {
  const navigate = useNavigate();

  const handleEdit = useCallback(() => onEdit(supplier), [onEdit, supplier]);
  const handleDelete = useCallback(() => onDelete(supplier.id), [onDelete, supplier.id]);
  const handleClick = useCallback(() => {
    navigate({ to: "/suppliers/$supplierId", params: { supplierId: supplier.id } });
  }, [navigate, supplier.id]);

  return (
    <TableRow className="cursor-pointer" onClick={handleClick}>
      <TableCell className="font-medium">{supplier.name}</TableCell>
      <TableCell className="text-muted-foreground">{supplier.contactName || "—"}</TableCell>
      <TableCell className="text-muted-foreground">{supplier.phone || "—"}</TableCell>
      <TableCell className="text-muted-foreground">{supplier.email || "—"}</TableCell>
      <TableCell className="text-muted-foreground">{supplier.cnpj || "—"}</TableCell>
      <TableCell>
        <div onClick={(event) => event.stopPropagation()}>
          <TableRowActions onEdit={handleEdit} onDelete={handleDelete} />
        </div>
      </TableCell>
    </TableRow>
  );
});
