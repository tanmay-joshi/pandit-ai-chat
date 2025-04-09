import { useState, useEffect } from "react";
import Image from "next/image";

type Agent = {
  id: string;
  name: string;
  description: string;
  avatar: string | null;
  systemPrompt: string;
  messageCost: number;
  tags?: string | null;
  kundaliLimit: number;
};

interface AgentSelectorProps {
  onSelect: (agentId: string) => void;
  selectedAgentId?: string;
}

export default function AgentSelector({ onSelect, selectedAgentId }: AgentSelectorProps) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch("/api/agents");
        if (!response.ok) {
          throw new Error("Failed to fetch agents");
        }
        const data = await response.json();
        setAgents(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load agents");
        setLoading(false);
        console.error("Error fetching agents:", err);
      }
    };

    fetchAgents();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Loading agents...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  if (agents.length === 0) {
    return <div className="text-center py-4">No agents available</div>;
  }

  // Helper function to get a color based on tag
  const getTagColor = (tag: string) => {
    switch (tag.toLowerCase().trim()) {
      case 'basic':
        return 'bg-blue-100 text-blue-800';
      case 'experienced':
        return 'bg-purple-100 text-purple-800';
      case 'expert':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {agents.map((agent) => (
        <div
          key={agent.id}
          className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
            selectedAgentId === agent.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
          }`}
          onClick={() => onSelect(agent.id)}
        >
          <div className="flex items-center mb-3">
            {agent.avatar ? (
              <div className="relative w-10 h-10 mr-3 rounded-full overflow-hidden">
                <Image
                  src={agent.avatar}
                  alt={agent.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-10 h-10 mr-3 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 font-bold">{agent.name.charAt(0)}</span>
              </div>
            )}
            <div>
              <h3 className="font-medium">{agent.name}</h3>
              {agent.tags && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${getTagColor(agent.tags)}`}>
                  {agent.tags}
                </span>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-2">{agent.description}</p>
          <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
            <span className="text-sm font-medium text-gray-900">{agent.messageCost} credits per message</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Can analyze up to {agent.kundaliLimit} {agent.kundaliLimit === 1 ? 'kundali' : 'kundalis'}
          </div>
        </div>
      ))}
    </div>
  );
} 