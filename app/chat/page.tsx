"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type Agent = {
  id: string;
  name: string;
  description: string;
  avatar: string | null;
};

type Kundali = {
  id: string;
  fullName: string;
};

type Chat = {
  id: string;
  title: string;
  updatedAt: string;
  agent: Agent | null;
  kundali: Kundali | null;
};

export default function ChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  // Fetch user's chats
  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/chat")
        .then((res) => res.json())
        .then((data) => {
          setChats(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch chats:", error);
          setLoading(false);
        });
    }
  }, [status]);

  if (status === "loading" || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-4 text-3xl font-bold">Your Conversations</h1>
      
      <div className="flex items-center justify-between mb-6">
        <Link href="/chat/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Start New Chat
          </Button>
        </Link>

        <Link
          href="/kundali"
          className="text-blue-600 hover:underline"
        >
          Manage Kundalis
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {chats.length > 0 ? (
          chats.map((chat) => (
            <Link key={chat.id} href={`/chat/${chat.id}`}>
              <div className="cursor-pointer rounded-lg border border-gray-200 p-4 shadow-sm transition hover:shadow-md">
                <h2 className="mb-2 text-xl font-semibold">{chat.title}</h2>
                {chat.agent && (
                  <div className="flex items-center mb-2">
                    {chat.agent.avatar ? (
                      <div className="relative w-5 h-5 mr-1 rounded-full overflow-hidden">
                        <Image 
                          src={chat.agent.avatar} 
                          alt={chat.agent.name}
                          width={20}
                          height={20}
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-5 h-5 mr-1 rounded-full bg-blue-200 flex items-center justify-center">
                        <span className="text-blue-700 text-xs font-bold">{chat.agent.name.charAt(0)}</span>
                      </div>
                    )}
                    <span className="text-sm text-blue-700">{chat.agent.name}</span>
                  </div>
                )}
                {chat.kundali && (
                  <div className="text-xs text-gray-600 mb-2">
                    Kundali: {chat.kundali.fullName}
                  </div>
                )}
                <p className="text-sm text-gray-500">
                  {new Date(chat.updatedAt).toLocaleString()}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-600">You don't have any chats yet.</p>
            <p className="mt-2 text-gray-500">
              Start a new conversation to chat with an AI assistant.
            </p>
            <div className="mt-4">
              <Link href="/chat/new">
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Start New Chat
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 