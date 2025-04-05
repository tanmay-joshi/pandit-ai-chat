"use client";

import { Message } from "../lib/types";

interface ChatBubbleProps {
  message: Message;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  // User and assistant messages should be displayed, others typically aren't
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";
  
  // Skip rendering for non-user/assistant messages 
  // (like system messages which are instructions for the AI)
  if (!isUser && !isAssistant) {
    return null;
  }

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`p-3 rounded-lg ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        }`}
      >
        <p className="text-sm whitespace-pre-wrap break-words">
          {message.content}
        </p>
      </div>
    </div>
  );
} 