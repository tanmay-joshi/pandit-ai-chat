import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  // Use a fixed format that will be consistent between server and client
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  chatId: string;
  createdAt: string;
  updatedAt: string;
  cost: number;
  paid: boolean;
}

export interface ChatMetadata {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  agentId: string;
  userId: string;
}

// Function to stream messages from the API
export async function streamChatMessages(
  chatId: string,
  onChunk: (chunk: string) => void,
  message: string
): Promise<void> {
  try {
    const response = await fetch(`/api/chat/${chatId}/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error('Failed to stream messages');
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('Response body is null');

    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      onChunk(chunk);
    }
  } catch (error) {
    console.error('Error streaming messages:', error);
    throw error;
  }
}

// Function to fetch chat history
export async function fetchChatHistory(chatId: string): Promise<Message[]> {
  const response = await fetch(`/api/chat/${chatId}/messages`);
  if (!response.ok) {
    throw new Error('Failed to fetch chat history');
  }
  return response.json();
}

// Function to send a new message
export async function sendMessage(chatId: string, content: string): Promise<Message> {
  const response = await fetch(`/api/chat/${chatId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to send message');
  }
  
  return response.json();
}

// Function to create a new chat
export async function createChat(agentId: string): Promise<ChatMetadata> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ agentId }),
  });

  if (!response.ok) {
    throw new Error('Failed to create chat');
  }

  return response.json();
}

// Function to format message content (e.g., handle markdown, code blocks, etc.)
export function formatMessageContent(content: string): string {
  // TODO: Add markdown parsing and code block formatting
  return content;
}

// Function to generate a temporary message ID for optimistic updates
export function generateTempMessageId(): string {
  return `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
