export interface Agent {
  id: string;
  name: string;
  description: string;
  avatar: string | null;
  systemPrompt: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  messageCost: number;
  tags: string | null;
  kundaliLimit: number;
  expertiseLevel: string;
  rating: number;
  totalReviews: number;
  todayChats: number;
  expertise: string[];
  languages: string[];
  totalChats: number;
} 