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
        "flex items-start py-3",
        isAssistant ? "flex-row" : "flex-row-reverse"
      )}
    >
      {/* {isAssistant ? (
        <Avatar
          className="neu-avatar"
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
      )} */}

      <div
        className={cn(
          "rounded-xl p-3 max-w-[80%]",
          isAssistant
            ? "neu-card "
            : "neu-inset-2"
        )}
      >
        <div className={cn(
          "whitespace-pre-wrap break-words",
          isAssistant
            ? "text-neutral-800"
            : "text-neutral-800"
        )}>{displayContent}</div>
        {isStreaming && isLastMessage && (
          <div className="mt-2">
            <Loading size="sm" />
          </div>
        )}
        <div
          className={cn(
            "text-xs mt-2",
            isAssistant
              ? "text-neutral-600"
              : "text-neutral-600"
          )}
        >
          {timestamp}
        </div>
      </div>
    </div>
  );
} 