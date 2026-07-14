import { memo, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import type { Product } from "@/types";
import { ProductThumbnailInline } from "@/shared/components/ProductThumbnail";
import { StockBadge } from "@/shared/components/StockBadge";
import { TableRowActions } from "@/shared/components/TableRowActions";
import { formatCurrency } from "@/shared/utils/format";
import { TableCell, TableRow } from "@/shared/ui/table";

interface ProductTableRowProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export const ProductTableRow = memo(function ProductTableRow({
  product,
  onEdit,
  onDelete,
}: ProductTableRowProps) {
  const navigate = useNavigate();
  const handleEdit = useCallback(() => onEdit(product), [onEdit, product]);
  const handleDelete = useCallback(() => onDelete(product.id), [onDelete, product.id]);
  const handleViewProfile = useCallback(() => {
    navigate({ to: "/products/$productId", params: { productId: product.id } });
  }, [navigate, product.id]);

  return (
    <TableRow>
      <TableCell>
        <button
          type="button"
          className="text-left"
          onClick={handleViewProfile}
        >
          <ProductThumbnailInline imageUrl={product.imageUrl} name={product.name} />
        </button>
      </TableCell>
      <TableCell className="text-muted-foreground">{product.brand}</TableCell>
      <TableCell className="text-muted-foreground">{product.category}</TableCell>
      <TableCell className="text-right">{formatCurrency(product.purchasePrice)}</TableCell>
      <TableCell className="text-right font-medium">{formatCurrency(product.salePrice)}</TableCell>
      <TableCell className="text-center">{product.quantity}</TableCell>
      <TableCell>
        <StockBadge quantity={product.quantity} minStock={product.minStock} />
      </TableCell>
      <TableCell>
        <TableRowActions
          onView={handleViewProfile}
          onEdit={handleEdit}
          onDelete={handleDelete}
          viewLabel="Ver ficha"
        />
      </TableCell>
    </TableRow>
  );
});
