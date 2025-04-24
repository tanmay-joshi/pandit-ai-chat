import { Message } from "@/types/message";
import { Kundali } from "@/types/kundali";
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
    <div className="mx-auto max-w-4xl px-4 pb-8 pt-4">
      {messages.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center py-24 text-center">
          <div className="mb-6 rounded-full bg-[var(--bg-beige)] p-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8 text-[var(--text-primary)]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
            </svg>
          </div>
          <h3 className="mb-2 font-serif text-xl text-[var(--text-primary)]">Start your conversation</h3>
          <p className="max-w-md text-sm text-[var(--text-secondary)]">
            Ask a question or choose from the suggested prompts below to get personalized guidance.
          </p>
        </div>
      ) : (
        messages.map((message, index) => {
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
        })
      )}
      
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