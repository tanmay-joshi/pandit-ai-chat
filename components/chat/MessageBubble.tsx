import { Message } from "@/types/message";
import { Agent } from "@/types/agent";
import { formatDistanceToNow } from "date-fns";
import { Avatar } from "../ui/avatar";
import { Loading } from "../ui/loading";
import { cn } from "@/lib/utils";
import { useState } from "react";
import translate from "translate";

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
  const [translated, setTranslated] = useState<string | null>(null);
  const [translating, setTranslating] = useState(false);

  const handleTranslate = async () => {
    setTranslating(true);
    setTranslated(null);
    try {
      translate.engine = "google";
      const result = await translate(displayContent || "", { to: "hi" });
      setTranslated(result);
    } catch (err) {
      setTranslated("Translation failed");
    } finally {
      setTranslating(false);
    }
  };

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
        
        {isAssistant && (
          <div className="mt-2 flex gap-2">
            <button
              className="text-xs px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700 font-primary-medium transition"
              onClick={handleTranslate}
              disabled={translating}
            >
              {translating ? "Translating..." : "Translate to Hindi"}
            </button>
          </div>
        )}
        {translated && (
          <div className="mt-2 p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-900 text-sm">
            {translated}
          </div>
        )}
        
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