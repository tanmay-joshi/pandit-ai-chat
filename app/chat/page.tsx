"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Plus, MessageSquare, Calendar } from "lucide-react";
import { Chat } from "@/types/chat";
import { Loading } from "@/components/ui/loading";

export default function ChatsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
      return;
    }

    async function fetchChats() {
      try {
        const response = await fetch("/api/chat");
        if (!response.ok) {
          throw new Error("Failed to fetch chats");
        }
        const data = await response.json();
        setChats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load chats");
      } finally {
        setLoading(false);
      }
    }

    if (status === "authenticated") {
      fetchChats();
    }
  }, [status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#F0F0F3]">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-[#F0F0F3]">
      {/* Header */}
      <header className="px-4 py-6">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-libre-bold text-[#212121]">Your Consultations</h1>
            <Button 
              onClick={() => router.push("/chat/new")} 
              className="rounded-xl bg-[#F0F0F3] px-6 py-3 font-libre-regular text-[#212121] shadow-[-.125rem_-.125rem_.25rem_rgba(255,255,255,0.8),.125rem_.125rem_.25rem_rgba(174,174,192,0.4)] hover:shadow-[-.0625rem_-.0625rem_.125rem_rgba(255,255,255,0.8),.0625rem_.0625rem_.125rem_rgba(174,174,192,0.3)] transition-shadow duration-300"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Consultation
            </Button>
          </div>
        </div>
      </header>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl p-4">
          {error ? (
            <div className="rounded-2xl bg-[#F0F0F3] p-6 text-red-700 shadow-[-.125rem_-.125rem_.25rem_rgba(255,255,255,0.8),.125rem_.125rem_.25rem_rgba(174,174,192,0.4)]">
              {error}
            </div>
          ) : chats.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl bg-[#F0F0F3] p-12 text-center shadow-[-.125rem_-.125rem_.25rem_rgba(255,255,255,0.8),.125rem_.125rem_.25rem_rgba(174,174,192,0.4)]">
              <div className="mb-6 rounded-full bg-[#F0F0F3] p-4 shadow-[-.0625rem_-.0625rem_.125rem_rgba(255,255,255,0.8),.0625rem_.0625rem_.125rem_rgba(174,174,192,0.4)]">
                <MessageSquare className="h-8 w-8 text-[#212121]" />
              </div>
              <h2 className="mb-3 text-xl font-libre-bold text-[#212121]">No consultations yet</h2>
              <p className="mb-6 text-muted-foreground font-libre-regular">
                Start your first consultation with our AI-powered spiritual guides
              </p>
              <Button 
                onClick={() => router.push("/chat/new")} 
                className="rounded-xl bg-[#F0F0F3] px-6 py-3 font-libre-regular text-[#212121] shadow-[-.125rem_-.125rem_.25rem_rgba(255,255,255,0.8),.125rem_.125rem_.25rem_rgba(174,174,192,0.4)] hover:shadow-[-.0625rem_-.0625rem_.125rem_rgba(255,255,255,0.8),.0625rem_.0625rem_.125rem_rgba(174,174,192,0.3)] transition-shadow duration-300"
              >
                <Plus className="mr-2 h-4 w-4" />
                Start New Consultation
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {chats.map((chat) => (
                <Link
                  key={chat.id}
                  href={`/chat/${chat.id}`}
                  className="group block rounded-2xl bg-[#F0F0F3] p-6 shadow-[-.125rem_-.125rem_.25rem_rgba(255,255,255,0.8),.125rem_.125rem_.25rem_rgba(174,174,192,0.4)] transition-shadow duration-300 hover:shadow-[-.0625rem_-.0625rem_.125rem_rgba(255,255,255,0.8),.0625rem_.0625rem_.125rem_rgba(174,174,192,0.3)]"
                >
                  <div className="flex items-start gap-4">
                    {/* Agent Avatar */}
                    {chat.agent && (
                      <div className="flex-shrink-0">
                        {chat.agent.avatar ? (
                          <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-[#F0F0F3] shadow-[-.0625rem_-.0625rem_.125rem_rgba(255,255,255,0.8),.0625rem_.0625rem_.125rem_rgba(174,174,192,0.4)]">
                            <Image
                              src={chat.agent.avatar}
                              alt={chat.agent.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0F0F3] shadow-[-.0625rem_-.0625rem_.125rem_rgba(255,255,255,0.8),.0625rem_.0625rem_.125rem_rgba(174,174,192,0.4)]">
                            <span className="text-xl font-libre-bold text-[#212121]">
                              {chat.agent.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Chat Info */}
                    <div className="flex-1 space-y-2">
                      <h3 className="font-libre-bold text-[#212121]">{chat.title}</h3>
                      {chat.agent && (
                        <p className="text-sm text-muted-foreground font-libre-regular">
                          with {chat.agent.name}
                        </p>
                      )}
                      {chat.messages && (
                        <div className="inline-flex items-center rounded-xl bg-[#F0F0F3] px-3 py-1 text-sm font-libre-regular text-muted-foreground shadow-[inset_-.03125rem_-.03125rem_.0625rem_rgba(255,255,255,0.8),inset_.03125rem_.03125rem_.0625rem_rgba(174,174,192,0.4)]">
                          {chat.messages.length} messages
                        </div>
                      )}
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-2 rounded-xl bg-[#F0F0F3] px-3 py-1 text-sm font-libre-regular text-muted-foreground shadow-[inset_-.03125rem_-.03125rem_.0625rem_rgba(255,255,255,0.8),inset_.03125rem_.03125rem_.0625rem_rgba(174,174,192,0.4)]">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(chat.messages?.[0]?.createdAt || chat.createdAt || Date.now()).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 