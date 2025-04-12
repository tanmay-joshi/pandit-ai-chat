import Image from "next/image";
import { Button } from "@/components/ui/button";

interface AgentCardProps {
  agent: {
    id: string;
    name: string;
    description: string;
    avatar: string | null;
    expertise?: string[];
    messageCost: number
  };
  isSelected?: boolean;
  onSelect?: (agent: any) => void;
  showAddButton?: boolean;
}

export function AgentCard({ agent, isSelected, onSelect, showAddButton = true }: AgentCardProps) {
  return (
    <div 
      className={`relative group overflow-hidden rounded-2xl transition-all duration-300 cursor-pointer
        ${isSelected ? 'ring-2 ring-primary' : 'hover:ring-1 hover:ring-primary/50'}
      `}
      onClick={() => onSelect?.(agent)}
    >
      {/* Background Image */}
      <div className="relative w-full aspect-square">
        {agent.avatar ? (
          <Image
            src={agent.avatar}
            alt={agent.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/50" />
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 p-4 flex flex-col justify-end text-white">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold tracking-tight">
            {agent.name}
          </h3>
          
          {/* Status Indicator */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-sm text-white/90"> ₹{agent.messageCost} /reply </span>
          </div>

          {/* Add Member Button */}
          {showAddButton && (
            <Button 
              className="mt-3 w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/20"
              variant="outline"
              size="sm"
            >
              Start Chat
            </Button>
          )}
        </div>
      </div>
    </div>
  );
} 