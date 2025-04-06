"use client";

import { Message } from "../lib/types";
import { Markdown } from "./ui/markdown";
import { cn } from "@/lib/utils";

interface ChatBubbleProps {
  message: Message;
  isStreaming?: boolean;
}

export default function ChatBubble({ message, isStreaming = false }: ChatBubbleProps) {
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
      className={`flex ${isUser ? "justify-end" : "justify-start"} w-full max-w-4xl`}
    >
      <div
        className={`p-3 rounded-lg ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        } max-w-[85%]`}
      >
        <Markdown
          content={message.content}
          isStreaming={isAssistant && isStreaming}
          className={cn(
            isUser ? "text-primary-foreground" : "",
            // Add smaller text size for user messages
            isUser ? "prose-sm" : "",
            // Ensure links are properly colored in user messages
            isUser ? "[&_a]:text-primary-foreground" : "",
            // Ensure code blocks are properly styled in user messages
            isUser ? "[&_pre]:bg-primary-foreground/10 [&_code]:bg-primary-foreground/10" : "",
          )}
        />
      </div>
    </div>
  );
} 