import { Message } from "@/types/message";
import { Agent } from "@/types/agent";
import { formatDistanceToNow } from "date-fns";
import { Avatar } from "../ui/avatar";
import { Loading } from "../ui/loading";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: Message;
  agent: Agent | null;
  isLastMessage: boolean;
  isStreaming?: boolean;
  streamedContent?: string;
}

export function MessageBubble({
  message,
  agent,
  isLastMessage,
  isStreaming,
  streamedContent,
}: MessageBubbleProps) {
  const isAssistant = message.role === "assistant";
  const displayContent = isStreaming && isLastMessage ? streamedContent : message.content;
  const timestamp = formatDistanceToNow(new Date(message.createdAt), { addSuffix: true });

  return (
    <div
      className={cn(
        "flex w-full items-start space-x-4 py-4",
        isAssistant ? "justify-start" : "justify-end"
      )}
    >
      {isAssistant && (
        <div className="flex-shrink-0">
          <Avatar
            className="h-10 w-10 rounded-full bg-[#F5F2EE] text-center font-serif"
            src={agent?.avatar || ""}
            alt={agent?.name || "AI"}
            fallback={agent?.name?.[0] || "AI"}
          />
        </div>
      )}

      <div
        className={cn(
          "max-w-[75%] rounded-t-[2rem] p-6 shadow-sm",
          isAssistant
            ? "bg-[var(--bg-beige)] border border-gray-200"
            : "bg-[var(--bg-white)] border border-gray-300 ml-auto mr-4"
        )}
      >
        <div className={cn(
          "whitespace-pre-wrap break-words leading-relaxed",
          "font-primary-regular text-[var(--text-primary)]"
        )}>
          {displayContent}
        </div>
        
        {isStreaming && isLastMessage && (
          <div className="mt-4">
            <Loading size="sm" />
          </div>
        )}
        
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs font-primary-regular text-[var(--text-secondary)]">
            {timestamp}
          </span>
          
          {message.cost > 0 && (
            <span className="text-xs font-primary-medium text-[var(--text-secondary)]">
              {message.cost} credits
            </span>
          )}
        </div>
      </div>
      
      {!isAssistant && (
        <div className="flex-shrink-0">
          <Avatar
            className="h-10 w-10 rounded-full bg-[var(--accent-dark)] text-white text-center font-primary-medium"
            src=""
            alt="You"
            fallback="Y"
          />
        </div>
      )}
    </div>
  );
} 