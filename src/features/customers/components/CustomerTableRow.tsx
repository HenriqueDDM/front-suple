import { memo, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import type { Customer } from "@/types";
import { UserAvatar } from "@/shared/components/UserAvatar";
import { formatCurrency, formatDate } from "@/shared/utils/format";
import { TableCell, TableRow } from "@/shared/ui/table";

interface CustomerTableRowProps {
  customer: Customer;
}

export const CustomerTableRow = memo(function CustomerTableRow({
  customer,
}: CustomerTableRowProps) {
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    navigate({ to: "/customers/$customerId", params: { customerId: customer.id } });
  }, [customer.id, navigate]);

  return (
    <TableRow className="cursor-pointer" onClick={handleClick}>
      <TableCell>
        <div className="flex items-center gap-3">
          <UserAvatar name={customer.name} />
          <span className="font-medium">{customer.name}</span>
        </div>
      </TableCell>
      <TableCell className="text-muted-foreground">{customer.phone}</TableCell>
      <TableCell className="text-muted-foreground">{customer.email}</TableCell>
      <TableCell className="text-muted-foreground">{customer.cpf}</TableCell>
      <TableCell className="text-muted-foreground">{formatDate(customer.lastPurchase)}</TableCell>
      <TableCell className="text-right font-medium">
        {formatCurrency(customer.totalSpent)}
      </TableCell>
    </TableRow>
  );
});
