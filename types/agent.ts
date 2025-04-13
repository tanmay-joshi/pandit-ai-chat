export interface Agent {
  id: string;
  name: string;
  avatarUrl?: string;
  description: string;
  expertise: string[];
  languages: string[];
  rating: number;
  totalChats: number;
} 