"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChatCard } from "@/components/ui/ChatCard";
import { MessageSquare, CheckCircle } from "lucide-react";
import type { Agent } from "@/types/agent";
import type { Chat } from "@/types/chat";
import { HomeChatInput } from "@/components/HomeChatInput";

// Dummy global chats for the 'Global Chats' tab
const globalChats: Chat[] = [
  {
    id: "dummy1",
    title: "Career guidance for Rahul",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: "user1",
    messages: [{
      id: "m1",
      content: "Will I get a job promotion this year?",
      createdAt: new Date().toISOString(),
      role: "user",
      chatId: "dummy1",
      userId: "user1",
      cost: 0,
      paid: true
    }],
    agentId: "pandit1",
    agent: {
      id: "pandit1",
      name: "Pandit Guru",
      description: "A wise and experienced pandit who provides guidance on various aspects of life.",
      avatar: "/images/pandits/pandit.png",
      systemPrompt: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
      messageCost: 15,
      tags: "experienced",
      kundaliLimit: 2,
      expertiseLevel: "EXPERT",
      rating: 4.8,
      totalReviews: 423,
      todayChats: 15,
      expertise: ["Career", "Vedic Astrology"],
      languages: ["en"],
      totalChats: 1000,
    },
    suggestedQuestions: null,
    kundalis: [],
  },
  {
    id: "dummy2",
    title: "Love advice for Priya",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: "user2",
    messages: [{
      id: "m2",
      content: "Is this a good time to start a new relationship?",
      createdAt: new Date().toISOString(),
      role: "user",
      chatId: "dummy2",
      userId: "user2",
      cost: 0,
      paid: true
    }],
    agentId: "pandit2",
    agent: {
      id: "pandit2",
      name: "Pandit Prem",
      description: "Love and relationship expert with ancient wisdom for modern dating problems.",
      avatar: "/images/pandits/prem.png",
      systemPrompt: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
      messageCost: 15,
      tags: "experienced",
      kundaliLimit: 2,
      expertiseLevel: "EXPERT",
      rating: 4.7,
      totalReviews: 300,
      todayChats: 10,
      expertise: ["Love", "Relationships"],
      languages: ["en"],
      totalChats: 800,
    },
    suggestedQuestions: null,
    kundalis: [],
  },
];

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [loadingAgents, setLoadingAgents] = useState(true);
  const [loadingChats, setLoadingChats] = useState(true);
  const [errorAgents, setErrorAgents] = useState<string | null>(null);
  const [errorChats, setErrorChats] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'user' | 'global'>('global');

  useEffect(() => {
    setMounted(true);
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoadingAgents(true);
        const res = await fetch("/api/agents");
        if (!res.ok) throw new Error("Failed to fetch agents");
        const data = await res.json();
        setAgents(data);
        setLoadingAgents(false);
      } catch (err) {
        setErrorAgents("Failed to load agents");
        setLoadingAgents(false);
      }
    };
    fetchAgents();
  }, []);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoadingChats(true);
        const res = await fetch("/api/chat");
        if (!res.ok) throw new Error("Failed to fetch chats");
        const data = await res.json();
        setChats(data);
        setLoadingChats(false);
      } catch (err) {
        setErrorChats("Failed to load chats");
        setLoadingChats(false);
      }
    };
    fetchChats();
  }, []);

  if (!mounted || status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen neu-container pb-24">
      <div className="mx-auto w-full max-w-2xl px-2 sm:px-4 pt-6">
        {/* Section: Pandit Agents */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="neu-title text-lg font-serif font-semibold tracking-tight">Our Pandits</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
            {loadingAgents ? (
              <div className="py-8 text-center w-full">Loading agents...</div>
            ) : errorAgents ? (
              <div className="py-8 text-center text-red-500 w-full">{errorAgents}</div>
            ) : agents.length === 0 ? (
              <div className="py-8 text-center w-full">No agents available</div>
            ) : (
              agents.map((agent) => (
                <div key={agent.id} className="min-w-[240px] max-w-[80vw] sm:min-w-[220px] h-48">
                  <div className="neu-card neu-card-hover flex flex-col items-start h-full">
                    <div className="grid items-center gap-3 mb-2">
                      {agent.avatar ? (
                        <img
                          src={agent.avatar}
                          alt={agent.name}
                          className="neu-avatar w-12 h-12 object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="neu-avatar w-12 h-12 flex items-center justify-center bg-gray-200">
                          <span className="neu-title neu-xl">{agent.name.charAt(0)}</span>
                        </div>
                      )}
                        <div className="neu-title text-base font-semibold leading-tight font-serif">{agent.name}</div>
                    </div>
                    <div className="neu-text text-xs text-gray-400 mb-2 font-primary-regular">{agent.tags}</div>
                    <Button
                      size="sm"
                      className="mt-auto w-full rounded-full neu-button neu-button-hover"
                      onClick={() => router.push(`/chat/new?agentId=${agent.id}`)}
                    >
                      Start Chat
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
        <HomeChatInput />
        {/* Section: Recent/Global Chats with Tabs */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <h2 className="neu-title text-lg font-serif font-semibold tracking-tight">Chats</h2>
          </div>
          <div className="flex gap-2 mb-4">
            <button
              className={`px-4 py-2 rounded-full font-primary-medium text-sm transition-colors ${selectedTab === 'user' ? 'bg-black text-white shadow' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setSelectedTab('user')}
            >
              Your Recent Chats
            </button>
            <button
              className={`px-4 py-2 rounded-full font-primary-medium text-sm transition-colors ${selectedTab === 'global' ? 'bg-black text-white shadow' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setSelectedTab('global')}
            >
              Global Chats
            </button>
          </div>
          <div className="neu-grid hide-scrollbar">
            {selectedTab === 'user' ? (
              loadingChats ? (
                <div className="py-8 text-center w-full">Loading chats...</div>
              ) : errorChats ? (
                <div className="py-8 text-center text-red-500 w-full">{errorChats}</div>
              ) : chats.length === 0 ? (
                <div className="py-8 text-center w-full">No recent chats</div>
              ) : (
                chats.slice(0, 3).map((chat) => (
                  <ChatCard key={chat.id} chat={chat} href={`/chat/${chat.id}`} />
                ))
              )
            ) : (
              globalChats.map((chat) => (
                <ChatCard key={chat.id} chat={chat} />
              ))
            )}
          </div>
        </section>
      </div>
      {/* Add custom scrollbar hide for mobile */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
