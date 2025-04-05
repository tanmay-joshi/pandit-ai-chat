"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function ChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [chats, setChats] = useState<any[]>([]);
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

  const createNewChat = async () => {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: "New Chat" }),
      });

      if (!res.ok) throw new Error("Failed to create chat");

      const newChat = await res.json();
      router.push(`/chat/${newChat.id}`);
    } catch (error) {
      console.error("Error creating new chat:", error);
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
        className="mb-6 rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
      >
        Start New Chat
      </button>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {chats.length > 0 ? (
          chats.map((chat) => (
            <Link key={chat.id} href={`/chat/${chat.id}`}>
              <div className="cursor-pointer rounded-lg border border-gray-200 p-4 shadow-sm transition hover:shadow-md">
                <h2 className="mb-2 text-xl font-semibold">{chat.title}</h2>
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
              Start a new conversation to chat with Pandit AI.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 