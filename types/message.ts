export interface Message {
  id: string;
  content: string;
  role: string;
  createdAt: string;
  chatId: string;
  userId: string;
  cost: number;
  paid: boolean;
} 