import Image from "next/image";
import Link from "next/link";
import { Message, Agent, Kundali } from "../../types/chat";

interface ChatMessagesProps {
  messages: Message[];
  agent?: Agent | null;
  kundalis?: Kundali[] | null;
  error?: string | null;
  sending: boolean;
  step: string;
  onScrollBottom: () => void;
}

export function ChatMessages({ 
  messages, 
  agent, 
  kundalis, 
  error, 
  sending, 
  step,
  onScrollBottom 
}: ChatMessagesProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-4xl p-4">
        {/* Error Message */}
        {error && (
          <div className="mb-4 neu-error">
            <p>{error}</p>
            {error.includes("Insufficient credits") && (
              <Link href="/wallet/recharge" className="mt-2 inline-block neu-text text-primary hover:underline">
                Recharge your wallet
              </Link>
            )}
          </div>
        )}

        {/* Empty State */}
        {messages.length === 0 ? (
          <div className="flex h-[calc(100vh-200px)] flex-col items-center justify-center text-center">
            <div className="mb-4 rounded-full neu-inset p-3">
              {agent && agent.avatar ? (
                <div className="relative h-16 w-16 overflow-hidden rounded-full">
                  <Image
                    src={agent.avatar}
                    alt={agent.name}
                    width={64}
                    height={64}
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full neu-inset">
                  <span className="neu-title neu-2xl text-primary">
                    {agent ? agent.name.charAt(0) : "P"}
                  </span>
                </div>
              )}
            </div>
            <h2 className="mb-2 neu-title neu-xl">
              {agent ? `Welcome to your consultation with ${agent.name}` : "Start your conversation"}
            </h2>
            {agent && (
              <p className="mb-3 max-w-md text-center neu-text text-muted-foreground">
                {agent.description}
              </p>
            )}
            <p className="text-center neu-text text-sm text-muted-foreground">
              Type your first message below to begin.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                    message.role === "user"
                      ? "neu-inset-2 text-black"
                      : "neu-card"
                  }`}
                >
                  <div className="whitespace-pre-wrap neu-text">
                    {message.content || (message.role === "assistant" && sending ? (
                      <div className="flex items-center gap-1">
                        <div className="h-2 w-2 animate-pulse rounded-full bg-primary/50"></div>
                        <div className="h-2 w-2 animate-pulse rounded-full bg-primary/50 delay-100"></div>
                        <div className="h-2 w-2 animate-pulse rounded-full bg-primary/50 delay-200"></div>
                      </div>
                    ) : '')}
                  </div>
                  <div className={`mt-1 text-right neu-text text-xs ${
                    message.role === "user" 
                      ? "text-black/50" 
                      : "text-muted-foreground"
                  }`}>
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}
            <div ref={onScrollBottom} />
          </div>
        )}
      </div>
    </div>
  );
} 