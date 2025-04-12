export type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  createdAt: string;
  hasOptions?: boolean;
  suggestedQuestions?: string[];
};

export type Agent = {
  id: string;
  name: string;
  description: string;
  avatar: string | null;
  systemPrompt: string;
  messageCost: number;
  tags?: string | null;
  kundaliLimit: number;
  expertise?: string[];
};

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
}; 