import Link from "next/link";
import Image from "next/image";
import { Calendar } from "lucide-react";
import type { Chat } from "@/types/chat";

interface ChatCardProps {
  chat: Chat;
  href?: string;
}

export function ChatCard({ chat, href }: ChatCardProps) {
  const cardContent = (
    <div className="neu-card neu-card-hover">
      <div className="neu-flex">
        {/* Agent Avatar */}
        {chat.agent && (
          <div className="flex-shrink-0">
            {chat.agent.avatar ? (
              <div className="neu-avatar">
                <Image
                  src={chat.agent.avatar}
                  alt={chat.agent.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="neu-avatar flex items-center justify-center">
                <span className="neu-title neu-xl">
                  {chat.agent.name.charAt(0)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Chat Info */}
        <div className="flex-1 space-y-2">
          <h3 className="neu-title">{chat.title}</h3>
          {chat.agent && (
            <p className="neu-text neu-sm">
              with {chat.agent.name}
            </p>
          )}
          {chat.messages && (
            <div className="neu-inset neu-text neu-sm">
              {chat.messages.length} messages
            </div>
          )}
        </div>

        {/* Date */}
        <div className="neu-inset neu-text neu-sm flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>
            {new Date(chat.messages?.[0]?.createdAt || chat.createdAt || Date.now()).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href}>
        {cardContent}
      </Link>
    );
  }
  return cardContent;
} 