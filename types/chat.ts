import { Agent as BaseAgent } from "./agent";

export type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  createdAt: string;
  hasOptions?: boolean;
  suggestedQuestions?: string[];
};

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

export type Chat = {
  id: string;
  title: string;
  messages: Message[];
  agent?: Agent | null;
  kundalis?: Kundali[] | null;
  createdAt: string;
}; 