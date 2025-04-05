"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import AgentSelector from "@/components/AgentSelector";
import Image from "next/image";

type Agent = {
  id: string;
  name: string;
  description: string;
  avatar: string | null;
};

type Chat = {
  id: string;
  title: string;
  updatedAt: string;
  agent: Agent | null;
};

export default function ChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string | undefined>(undefined);

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

  const createNewChat = async () => {
    if (isCreatingChat) {
      // If we're already in creation mode, toggle back
      setIsCreatingChat(false);
      setSelectedAgentId(undefined);
      return;
    }
    
    // Otherwise, show the agent selection UI
    setIsCreatingChat(true);
  };

  const handleAgentSelect = async (agentId: string) => {
    setSelectedAgentId(agentId);
    
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          title: "New Chat", 
          agentId 
        }),
      });

      if (!res.ok) throw new Error("Failed to create chat");

      const newChat = await res.json();
      router.push(`/chat/${newChat.id}`);
    } catch (error) {
      console.error("Error creating new chat:", error);
    } finally {
      setIsCreatingChat(false);
      setSelectedAgentId(undefined);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-8 text-3xl font-bold">Your Conversations</h1>
      
      <button
        onClick={createNewChat}
        className={`mb-6 rounded-md px-4 py-2 text-white transition ${
          isCreatingChat 
            ? "bg-gray-600 hover:bg-gray-700" 
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isCreatingChat ? "Cancel" : "Start New Chat"}
      </button>

      {isCreatingChat && (
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold">Choose an AI to chat with:</h2>
          <AgentSelector onSelect={handleAgentSelect} selectedAgentId={selectedAgentId} />
        </div>
      )}

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
          </div>
        )}
      </div>
    </div>
  );
} 