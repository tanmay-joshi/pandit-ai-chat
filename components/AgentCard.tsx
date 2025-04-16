import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Star, Clock, Users } from "lucide-react";

interface AgentCardProps {
  agent: {
    id: string;
    name: string;
    description: string;
    avatar: string | null;
    expertise?: string[];
    messageCost: number;
    expertiseLevel: string;
    rating: number;
    totalReviews: number;
    todayChats: number;
    kundaliLimit: number;
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
      <div className="relative w-full aspect-[4/5]">
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
        <div className="space-y-3">
          {/* Name and Level */}
          <div>
            <h3 className="text-xl font-semibold tracking-tight">
              {agent.name}
            </h3>
            <span className="text-sm text-white/80">
              {agent.expertiseLevel.charAt(0) + agent.expertiseLevel.slice(1).toLowerCase()} Level
            </span>
          </div>
          
          {/* Stats Row */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400" />
              <span>{agent.rating.toFixed(1)}</span>
              <span className="text-white/60">({agent.totalReviews})</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{agent.todayChats} today</span>
            </div>
          </div>

          {/* Price and Kundali Limit */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-white/90">₹{agent.messageCost} /reply</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>Up to {agent.kundaliLimit}</span>
            </div>
          </div>

          {/* Add Member Button */}
          {showAddButton && (
            <Button 
              className="mt-2 w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/20"
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