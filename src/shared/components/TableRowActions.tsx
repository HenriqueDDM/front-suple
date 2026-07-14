import { memo } from "react";
import { History, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";

interface TableRowActionsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  viewLabel?: string;
  editLabel?: string;
  deleteLabel?: string;
}

export const TableRowActions = memo(function TableRowActions({
  onView,
  onEdit,
  onDelete,
  viewLabel = "Ver histórico",
  editLabel = "Editar",
  deleteLabel = "Excluir",
}: TableRowActionsProps) {
  return (
    <div className="flex justify-end gap-1">
      {onView ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={onView} aria-label={viewLabel}>
              <History className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{viewLabel}</TooltipContent>
        </Tooltip>
      ) : null}
      {onEdit ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={onEdit} aria-label={editLabel}>
              <Pencil className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{editLabel}</TooltipContent>
        </Tooltip>
      ) : null}
      {onDelete ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive"
              onClick={onDelete}
              aria-label={deleteLabel}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{deleteLabel}</TooltipContent>
        </Tooltip>
      ) : null}
    </div>
  );
});
