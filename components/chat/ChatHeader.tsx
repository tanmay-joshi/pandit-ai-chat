import Link from "next/link";
import Image from "next/image";
import { Agent, Kundali } from "../../types/chat";

interface ChatHeaderProps {
  title: string;
  agent?: Agent | null;
  kundalis?: Kundali[] | null;
}

export function ChatHeader({ title, agent, kundalis }: ChatHeaderProps) {
  return (
    <header className="px-4 py-3">
      <div className="mx-auto max-w-4xl">
        <div className="bg-black rounded-[24px] text-white p-4 shadow-lg">
          <div className="flex items-start gap-4">
            {/* Agent Profile */}
            <div className="relative">
              {agent?.avatar ? (
                <div className="relative h-16 w-16 rounded-2xl overflow-hidden">
                  <Image
                    src={agent.avatar}
                    alt={agent.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
                  <span className="text-2xl font-bold">{agent?.name?.charAt(0) || 'P'}</span>
                </div>
              )}
              
              {/* Online Status Indicator */}
              <div className="absolute -right-1 -bottom-1 h-4 w-4 rounded-full border-2 border-black bg-emerald-500" />
            </div>

            {/* Chat Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-lg font-semibold truncate">
                    {agent?.name || 'Pandit AI'}
                  </h1>
                  <p className="text-sm text-white/70 truncate">{title}</p>
                </div>
                <Link
                  href="/chat"
                  className="rounded-full bg-white/10 px-4 py-1 text-sm backdrop-blur-sm transition hover:bg-white/20"
                >
                  Close
                </Link>
              </div>

              {/* Kundalis Pill */}
              {kundalis && kundalis.length > 0 && (
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex items-center">
                    {kundalis.map((kundali, idx) => (
                      <div
                        key={kundali.id}
                        className="relative first:ml-0 -ml-2 h-6 w-6 rounded-full border-2 border-black bg-white/10 backdrop-blur-sm"
                        style={{ zIndex: kundalis.length - idx }}
                      >
                        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-medium">
                          {kundali.fullName[0]}
                        </span>
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-white/70">
                    {kundalis.length} {kundalis.length === 1 ? 'Kundali' : 'Kundalis'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 