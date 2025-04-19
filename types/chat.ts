import { Agent } from "./agent";
import { Message } from "./message";
import { Kundali } from "./kundali";

export interface Chat {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  messages: Message[];
  agentId: string | null;
  agent: Agent | null;
  suggestedQuestions: string[] | null;
  kundalis: Kundali[];
} 