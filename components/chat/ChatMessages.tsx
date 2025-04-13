import { Message, Kundali } from "@/types/chat";
import { Agent } from "@/types/agent";
import { SelectionStep } from "@/types/enums";
import { MessageBubble } from "./MessageBubble";
import { Loading } from "@/components/ui/loading";
import { useEffect, useRef, useState } from "react";

export interface ChatMessagesProps {
  messages: Message[];
  agent: Agent | null;
  kundalis: Kundali[] | null;
  error: string | null;
  sending: boolean;
  isStreaming: boolean;
  streamedContent: string;
  step: SelectionStep;
  onScrollBottom: () => void;
}

export function ChatMessages({
  messages,
  agent,
  kundalis,
  error,
  sending,
  isStreaming,
  streamedContent,
  step,
  onScrollBottom
}: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [lastStreamContent, setLastStreamContent] = useState("");

  // Store the last streamed content when streaming ends
  useEffect(() => {
    if (isStreaming) {
      setLastStreamContent(streamedContent);
    }
  }, [isStreaming, streamedContent]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, streamedContent]);
  
  return (
    <div className="mx-auto max-w-4xl">
      {messages.map((message, index) => {
        const isLastMessage = index === messages.length - 1;
        
        // Determine content to display
        const displayContent = isLastMessage && isStreaming 
          ? streamedContent 
          : message.content || (isLastMessage ? lastStreamContent : "");
          
        return (
          <div key={message.id} className="mb-6">
            <MessageBubble
              message={{
                ...message,
                content: displayContent // Use our determined content
              }}
              agent={agent}
              isLastMessage={isLastMessage}
              isStreaming={isStreaming && isLastMessage}
              streamedContent={isStreaming && isLastMessage ? streamedContent : undefined}
            />
          </div>
        );
      })}
      
      {sending && !isStreaming && (
        <div className="flex justify-center py-2">
          <Loading size="sm" />
        </div>
      )}

      {error && (
        <div className="neu-error mx-auto max-w-md p-3 text-center">
          {error}
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
} 