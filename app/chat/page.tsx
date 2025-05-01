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
import { ChatCard } from "@/components/ui/ChatCard";
import mixpanel from "@/lib/mixpanel";

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

  useEffect(() => {
    mixpanel.track("Page Opened", { page: "Chat List" });
  }, []);

  if (status === "loading" || loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center neu-container">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden neu-container">
      {/* Header */}
      <header className="px-4 py-6">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-between">
            <h1 className="neu-title neu-2xl">Your Consultations</h1>
            <Button 
              onClick={() => {
                mixpanel.track("Button Clicked", { button: "New Consultation" });
                router.push("/chat/new");
              }} 
              className="neu-button neu-button-hover"
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
            <div className="neu-card text-red-700">
              {error}
            </div>
          ) : chats.length === 0 ? (
            <div className="neu-card flex flex-col items-center justify-center text-center">
              <div className="mb-6 neu-icon">
                <MessageSquare className="h-8 w-8 text-[#212121]" />
              </div>
              <h2 className="mb-3 neu-title neu-xl">No consultations yet</h2>
              <p className="mb-6 neu-text">
                Start your first consultation with our AI-powered spiritual guides
              </p>
              <Button 
                onClick={() => router.push("/chat/new")} 
                className="neu-button neu-button-hover"
              >
                <Plus className="mr-2 h-4 w-4" />
                Start New Consultation
              </Button>
            </div>
          ) : (
            <div className="neu-grid">
              {chats.map((chat) => (
                <ChatCard key={chat.id} chat={chat} href={`/chat/${chat.id}`} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 