import { Button } from "@/components/ui/button";
import { Trash2, Edit2 } from "lucide-react";
import { Kundali } from "@/types/kundali";

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
      className={`group relative rounded-2xl bg-[#F8F7F4] p-6 border-[0.1rem] border-[#212121] shadow-[0_2px_10px_-3px_rgba(0,0,0,0.1),0_-1px_2px_-2px_rgba(0,0,0,0.1)] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:bg-white/20 before:backdrop-blur-[2px] after:absolute after:inset-0 after:-z-20 after:rounded-[inherit] after:bg-gradient-to-b after:from-white/80 after:to-white/20 ${
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
              className="h-8 w-8"
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
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      {/* Content */}
      <div className="space-y-1 mb-4">
        <h3 className="text-xl font-libre-bold">{kundali.fullName}</h3>
        <p className="text-sm text-muted-foreground font-libre-regular">
          Created on {new Date(kundali.createdAt).toLocaleDateString()}
        </p>
      </div>
      <div className="space-y-2 font-libre-regular">
        <p className="flex items-center text-sm">
          <span className="text-muted-foreground">Birth Date:</span>
          <span className="ml-2">{new Date(kundali.dateOfBirth).toLocaleString()}</span>
        </p>
        <p className="flex items-center text-sm">
          <span className="text-muted-foreground">Birth Place:</span>
          <span className="ml-2">{kundali.placeOfBirth}</span>
        </p>
      </div>
    </div>
  );
} 