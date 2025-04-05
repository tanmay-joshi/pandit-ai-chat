export interface Message {
  id: string;
  role: "user" | "assistant" | "system" | "data" | "function" | "tool";
  content: string;
} 