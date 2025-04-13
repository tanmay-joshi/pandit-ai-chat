import { Message, Kundali } from "@/types/chat";
import { Agent } from "@/types/agent";
import { SelectionStep } from "@/types/enums";
import { MessageBubble } from "./MessageBubble";
import { Loading } from "@/components/ui/loading";

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
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => (
        <MessageBubble
          key={message.id}
          message={message}
          agent={agent}
          isLastMessage={index === messages.length - 1}
          isStreaming={isStreaming && index === messages.length - 1}
          streamedContent={isStreaming && index === messages.length - 1 ? streamedContent : undefined}
        />
      ))}
      
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
    </div>
  );
} 