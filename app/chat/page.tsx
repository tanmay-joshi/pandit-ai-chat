"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Plus, MessageSquare, Calendar } from "lucide-react";
import { Chat } from "@/types/chat";

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
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-gray-50">
      {/* Header */}
      <header className="bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Your Consultations</h1>
            <Button onClick={() => router.push("/chat/new")} className="bg-black hover:bg-black/90">
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
            <div className="rounded-lg bg-red-50 p-4 text-red-700">
              {error}
            </div>
          ) : chats.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg bg-white p-8 text-center shadow-sm">
              <div className="mb-4 rounded-full bg-gray-100 p-3">
                <MessageSquare className="h-6 w-6 text-gray-400" />
              </div>
              <h2 className="mb-2 text-xl font-semibold">No consultations yet</h2>
              <p className="mb-4 text-gray-600">
                Start your first consultation with our AI-powered spiritual guides
              </p>
              <Button onClick={() => router.push("/chat/new")} className="bg-black hover:bg-black/90">
                <Plus className="mr-2 h-4 w-4" />
                Start New Consultation
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {chats.map((chat) => (
                <Link
                  key={chat.id}
                  href={`/chat/${chat.id}`}
                  className="block transform rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-900/5 transition hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    {/* Agent Avatar */}
                    {chat.agent && (
                      <div className="flex-shrink-0">
                        {chat.agent.avatar ? (
                          <div className="relative h-12 w-12 overflow-hidden rounded-xl">
                            <Image
                              src={chat.agent.avatar}
                              alt={chat.agent.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                            <span className="text-lg font-semibold text-gray-600">
                              {chat.agent.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Chat Info */}
                    <div className="flex-1 space-y-1">
                      <h3 className="font-medium">{chat.title}</h3>
                      {chat.agent && (
                        <p className="text-sm text-gray-600">
                          with {chat.agent.name}
                        </p>
                      )}
                      {chat.messages && (
                        <p className="text-sm text-gray-500">
                          {chat.messages.length} messages
                        </p>
                      )}
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-1 text-sm text-gray-500">
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