"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, CheckCircle } from "lucide-react";

// Dummy data for agents
const agents = [
  {
    id: "1",
    name: "Pandit Sharma",
    description: "Vedic Astrology, Vastu",
    avatar: "/assets/pandit1.jpg",
    expertise: ["Vedic Astrology", "Vastu Shastra"],
    messageCost: 25,
    expertiseLevel: "EXPERT",
    rating: 4.8,
    totalReviews: 423,
    todayChats: 15,
    kundaliLimit: 3,
  },
  {
    id: "2",
    name: "Acharya Gupta",
    description: "Numerology, Palmistry",
    avatar: "/assets/pandit2.jpg",
    expertise: ["Numerology", "Palmistry"],
    messageCost: 30,
    expertiseLevel: "MASTER",
    rating: 4.9,
    totalReviews: 378,
    todayChats: 12,
    kundaliLimit: 4,
  },
  {
    id: "3",
    name: "Jyotish Mishra",
    description: "Career, Relationships",
    avatar: "/assets/pandit3.jpg",
    expertise: ["Career", "Relationships"],
    messageCost: 20,
    expertiseLevel: "ADVANCED",
    rating: 4.7,
    totalReviews: 256,
    todayChats: 8,
    kundaliLimit: 2,
  },
];

// Dummy data for recent chats
const recentChats = [
  {
    id: "chat1",
    userName: "Rahul",
    question: "Will I get a job promotion this year?",
    panditName: "Pandit Sharma",
    time: "2 hours ago",
    satisfaction: "Very Satisfied",
  },
  {
    id: "chat2",
    userName: "Priya",
    question: "Is this a good time to start a new business?",
    panditName: "Acharya Gupta",
    time: "5 hours ago",
    satisfaction: "Satisfied",
  },
  {
    id: "chat3",
    userName: "Vikram",
    question: "When will I meet my soulmate?",
    panditName: "Jyotish Mishra",
    time: "Yesterday",
    satisfaction: "Very Satisfied",
  },
];

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (!mounted || status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f6fa] to-[#f3f2f7] pb-24">
      <div className="mx-auto w-full max-w-2xl px-2 sm:px-4 pt-6">
        {/* Section: Pandit Agents */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="neu-title text-lg font-serif font-semibold tracking-tight">Our Pandits</h2>
            <button className="text-sm font-primary-medium text-gray-500 hover:text-primary transition-colors">View all</button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
            {agents.map((agent) => (
              <div key={agent.id} className="min-w-[240px] max-w-[80vw] sm:min-w-[220px] h-48">
                <div className="neu-card neu-card-hover flex flex-col items-start h-full">
                  <div className="flex items-center gap-3 mb-2">
                    <img
                      src={agent.avatar}
                      alt={agent.name}
                      className="neu-avatar w-12 h-12 object-cover border border-gray-200"
                    />
                    <div>
                      <div className="neu-title text-base font-semibold leading-tight font-serif">{agent.name}</div>
                      <div className="neu-text text-xs text-gray-500 font-primary-regular">{agent.description}</div>
                    </div>
                  </div>
                  <div className="neu-text text-xs text-gray-400 mb-2 font-primary-regular">{agent.expertise.join(", ")}</div>
                  <Button
                    size="sm"
                    className="mt-auto w-full rounded-full neu-button neu-button-hover"
                    onClick={() => router.push(`/chat/new?agentId=${agent.id}`)}
                  >
                    Start Chat
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Recent Chats */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <h2 className="neu-title text-lg font-serif font-semibold tracking-tight">Recent Chats</h2>
            <button className="text-sm font-primary-medium text-gray-500 hover:text-primary transition-colors">View all</button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
            {recentChats.map((chat) => (
              <div key={chat.id} className="min-w-[240px] max-w-[80vw] sm:min-w-[220px] h-40">
                <div className="neu-card neu-card-hover flex flex-col h-full bg-gradient-to-br from-[#fdf6ed] to-[#f7f6f3]">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="neu-avatar w-8 h-8 bg-gradient-to-br from-purple-400 to-indigo-400 flex items-center justify-center text-white font-bold">
                      {chat.userName[0]}
                    </div>
                    <div className="neu-title font-primary-medium text-sm">{chat.userName}</div>
                    <span className="ml-auto text-xs text-gray-400 font-primary-regular">{chat.time}</span>
                  </div>
                  <div className="neu-text text-sm text-gray-700 mb-2 line-clamp-2 font-primary-regular">{chat.question}</div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 font-primary-regular mt-auto">
                    <MessageSquare className="w-3.5 h-3.5" />
                    {chat.panditName}
                    <span className="ml-auto flex items-center gap-1 text-emerald-600">
                      <CheckCircle className="w-3.5 h-3.5" />
                      {chat.satisfaction}
                    </span>
                  </div>
                </div>
              </div>
            ))}
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
