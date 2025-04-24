import Link from "next/link";
import Image from "next/image";
import { Agent } from "@/types/agent";
import { Kundali } from "@/types/kundali";
import { ChevronLeft } from "lucide-react";

interface ChatHeaderProps {
  title: string;
  agent?: Agent | null;
  kundalis?: Kundali[] | null;
}

export function ChatHeader({ title, agent, kundalis }: ChatHeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-[var(--bg-white)] px-4 py-4 sticky top-0 z-10 shadow-sm">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center gap-4">
          {/* Back Button */}
          <Link
            href="/chat"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--bg-beige)] text-[var(--text-primary)] transition-colors hover:bg-gray-200"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>

          {/* Agent Profile */}
          {agent?.avatar ? (
            <div className="relative h-12 w-12 overflow-hidden rounded-full border border-gray-200">
              <Image
                src={agent.avatar}
                alt={agent.name}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--bg-beige)] border border-gray-200">
              <span className="font-serif text-xl text-[var(--text-primary)]">
                {agent?.name?.charAt(0) || 'P'}
              </span>
            </div>
          )}

          {/* Chat Info */}
          <div className="flex-1 min-w-0">
            <h1 className="font-serif text-lg text-[var(--text-primary)] truncate">
              {agent?.name || 'Pandit AI'}
            </h1>
            <p className="text-sm font-primary-regular text-[var(--text-secondary)] truncate">
              {title}
            </p>
          </div>

          {/* Kundalis */}
          {kundalis && kundalis.length > 0 && (
            <div className="flex items-center gap-2 pl-2">
              <div className="flex items-center -space-x-2">
                {kundalis.slice(0, 3).map((kundali, idx) => (
                  <div
                    key={kundali.id}
                    className="relative h-8 w-8 rounded-full bg-[var(--bg-beige)] border border-white flex items-center justify-center"
                    style={{ zIndex: kundalis.length - idx }}
                  >
                    <span className="text-sm font-primary-medium text-[var(--text-primary)]">
                      {kundali.fullName[0]}
                    </span>
                  </div>
                ))}
                {kundalis.length > 3 && (
                  <div className="relative h-8 w-8 rounded-full bg-[var(--bg-beige)] border border-white flex items-center justify-center">
                    <span className="text-sm font-primary-medium text-[var(--text-primary)]">
                      +{kundalis.length - 3}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 