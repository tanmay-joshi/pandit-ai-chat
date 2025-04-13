import { Agent as BaseAgent } from "./agent";

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  createdAt: string;
  chatId: string;
  userId: string;
  cost: number;
  paid: boolean;
}

export interface Agent extends BaseAgent {
  systemPrompt: string;
  messageCost: number;
  tags?: string | null;
  kundaliLimit: number;
}

export type Kundali = {
  id: string;
  fullName: string;
  dateOfBirth: string;
  placeOfBirth: string;
};

export interface Chat {
  id: string;
  title: string;
  createdAt: string;
  userId: string;
  agent?: Agent;
  messages: Message[];
  kundalis?: Kundali[];
  suggestedQuestions?: string;
} 