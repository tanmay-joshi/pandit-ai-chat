import Link from "next/link";
import Image from "next/image";
import { Agent, Kundali } from "../../types/chat";
import { ChevronLeft } from "lucide-react";

interface ChatHeaderProps {
  title: string;
  agent?: Agent | null;
  kundalis?: Kundali[] | null;
}

export function ChatHeader({ title, agent, kundalis }: ChatHeaderProps) {
  return (
    <header className="px-4 py-3">
      <div className="mx-auto max-w-4xl">
        <div className="bg-black rounded-[24px] text-white shadow-lg">
          <div className="p-4 flex items-center gap-4">
            {/* Back Button */}
            <Link
              href="/chat"
              className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>

            {/* Agent Profile */}
            {agent?.avatar ? (
              <div className="relative h-10 w-10 rounded-xl overflow-hidden">
                <Image
                  src={agent.avatar}
                  alt={agent.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
                <span className="text-lg font-medium">{agent?.name?.charAt(0) || 'P'}</span>
              </div>
            )}

            {/* Chat Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-base font-semibold truncate">
                {agent?.name || 'Pandit AI'}
              </h1>
              <p className="text-sm text-white/70 truncate">{title}</p>
            </div>

            {/* Kundalis */}
            {kundalis && kundalis.length > 0 && (
              <div className="flex items-center gap-2 pl-2">
                <div className="flex items-center -space-x-2">
                  {kundalis.slice(0, 3).map((kundali, idx) => (
                    <div
                      key={kundali.id}
                      className="relative h-8 w-8 rounded-full border-2 border-black bg-white/10 backdrop-blur-sm flex items-center justify-center"
                      style={{ zIndex: kundalis.length - idx }}
                    >
                      <span className="text-sm font-medium">
                        {kundali.fullName[0]}
                      </span>
                    </div>
                  ))}
                  {kundalis.length > 3 && (
                    <div className="relative h-8 w-8 rounded-full border-2 border-black bg-white/10 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-sm font-medium">
                        +{kundalis.length - 3}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 