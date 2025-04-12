import { Button } from "@/components/ui/button";
import { Trash2, Edit2 } from "lucide-react";
import { Kundali } from "../types/kundali";

interface KundaliCardProps {
  kundali: Kundali;
  onEdit?: (kundali: Kundali) => void;
  onDelete?: (id: string) => void;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (kundali: Kundali) => void;
}

export function KundaliCard({
  kundali,
  onEdit,
  onDelete,
  selectable = false,
  selected = false,
  onSelect
}: KundaliCardProps) {
  return (
    <div
      className={`neu-card neu-card-hover group relative ${
        selectable ? 'cursor-pointer' : ''
      } ${selected ? 'ring-2 ring-primary' : ''}`}
      onClick={() => {
        if (selectable && onSelect) {
          onSelect(kundali);
        }
      }}
    >
      {/* Action Buttons */}
      {!selectable && (onEdit || onDelete) && (
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          {onEdit && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(kundali);
              }}
              className="h-8 w-8 neu-icon"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(kundali.id);
              }}
              className="h-8 w-8 neu-icon text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      {/* Content */}
      <div className="space-y-1 mb-4">
        <h3 className="neu-title neu-xl">{kundali.fullName}</h3>
        <p className="neu-text neu-sm">
          Created on {new Date(kundali.createdAt).toLocaleDateString()}
        </p>
      </div>
      <div className="space-y-2">
        <div className="neu-inset flex items-center justify-between">
          <span className="neu-text neu-sm">Birth Date:</span>
          <span className="neu-text neu-sm">{new Date(kundali.dateOfBirth).toLocaleString()}</span>
        </div>
        <div className="neu-inset flex items-center justify-between">
          <span className="neu-text neu-sm">Birth Place:</span>
          <span className="neu-text neu-sm">{kundali.placeOfBirth}</span>
        </div>
      </div>
    </div>
  );
} 