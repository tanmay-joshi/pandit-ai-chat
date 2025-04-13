import { Message } from "@/types/chat";
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
        "flex gap-3 items-start",
        isAssistant ? "flex-row" : "flex-row-reverse"
      )}
    >
      {isAssistant ? (
        <Avatar
          src={agent?.avatarUrl || ""}
          alt={agent?.name || "AI"}
          fallback={agent?.name?.[0] || "AI"}
        />
      ) : (
        <Avatar
          src=""
          alt="You"
          fallback="U"
        />
      )}

      <div
        className={cn(
          "rounded-lg p-4 max-w-[80%]",
          isAssistant
            ? "bg-secondary text-secondary-foreground"
            : "bg-primary text-primary-foreground"
        )}
      >
        <div className="whitespace-pre-wrap break-words">{displayContent}</div>
        {isStreaming && isLastMessage && (
          <div className="mt-2">
            <Loading size="sm" />
          </div>
        )}
        <div
          className={cn(
            "text-xs mt-2 opacity-70",
            isAssistant
              ? "text-secondary-foreground"
              : "text-primary-foreground"
          )}
        >
          {timestamp}
        </div>
      </div>
    </div>
  );
} 