"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { use } from "react";

type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  createdAt: string;
};

type Chat = {
  id: string;
  title: string;
  messages: Message[];
};

export default function ChatPage({ params }: { params: { id: Promise<string> | string } }) {
  // Unwrap params.id using React.use() 
  const resolvedId = typeof params.id === 'string' ? params.id : use(params.id);
  
  const { data: session, status } = useSession();
  const router = useRouter();
  const [chat, setChat] = useState<Chat | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  // Fetch chat data
  useEffect(() => {
    if (status === "authenticated" && resolvedId) {
      fetch(`/api/chat/${resolvedId}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Chat not found");
          }
          return res.json();
        })
        .then((data) => {
          setChat(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch chat:", error);
          setLoading(false);
          router.push("/chat");
        });
    }
  }, [status, resolvedId, router]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !chat || !resolvedId) return;

    const userMessage = input.trim();
    setInput("");
    setSending(true);

    // Optimistically update UI with user message
    const optimisticUserMsg = {
      id: Date.now().toString(),
      content: userMessage,
      role: "user" as const,
      createdAt: new Date().toISOString(),
    };

    // Create an optimistic AI message that will be streamed into
    const optimisticAiMsg = {
      id: "ai-" + Date.now().toString(),
      content: "",
      role: "assistant" as const,
      createdAt: new Date().toISOString(),
    };

    // Add both messages to the chat
    setChat((prev) => 
      prev ? { 
        ...prev, 
        messages: [...prev.messages, optimisticUserMsg, optimisticAiMsg] 
      } : prev
    );

    try {
      console.log("Sending message to API...");
      // Send the message to the API with streaming response
      const response = await fetch(`/api/chat/${resolvedId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: userMessage }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error:", errorText);
        throw new Error(`Failed to send message: ${response.status} ${response.statusText}`);
      }
      
      // Get the AI message ID from headers
      const aiMessageId = response.headers.get('X-Message-Id') || optimisticAiMsg.id;
      console.log("Received AI message ID:", aiMessageId);
      
      if (!response.body) {
        throw new Error("No response body received");
      }
      
      // Set up streaming
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let receivedText = "";
      
      // Process the stream chunks
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          console.log("Stream completed");
          break;
        }
        
        // Decode the chunk and update the message content
        const chunk = decoder.decode(value, { stream: true });
        receivedText += chunk;
        
        // Update the chat state with the new content
        setChat((prevChat) => {
          if (!prevChat) return prevChat;
          
          return {
            ...prevChat,
            messages: prevChat.messages.map((msg) => {
              if (msg.id === optimisticAiMsg.id || msg.id === aiMessageId) {
                return {
                  ...msg,
                  id: aiMessageId,
                  content: receivedText
                };
              }
              return msg;
            })
          };
        });
      }
      
      // Final update after streaming is complete
      if (receivedText.length === 0) {
        console.error("Received empty response from AI");
        throw new Error("Received empty response from AI");
      }
      
      console.log("Streaming complete. Final response length:", receivedText.length);
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Keep the user message but remove the AI message on error
      setChat((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          messages: prev.messages.filter(m => m.id !== optimisticAiMsg.id)
        };
      });
    } finally {
      setSending(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <div className="text-xl">Chat not found</div>
        <Link href="/chat" className="mt-4 text-blue-600 hover:underline">
          Back to chats
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">{chat.title}</h1>
          <Link
            href="/chat"
            className="rounded-md bg-gray-100 px-3 py-1 text-sm transition hover:bg-gray-200"
          >
            Back to chats
          </Link>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
        {chat.messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <h2 className="text-xl font-semibold">Start the conversation</h2>
            <p className="mt-2 text-gray-500">Send a message to begin chatting with Pandit AI</p>
          </div>
        ) : (
          <div className="space-y-4">
            {chat.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-800 shadow"
                  }`}
                >
                  <p className="whitespace-pre-wrap">
                    {message.content || (message.role === "assistant" && sending ? (
                      <span className="flex items-center">
                        <span className="h-2 w-2 bg-gray-400 rounded-full animate-pulse mr-1"></span>
                        <span className="h-2 w-2 bg-gray-400 rounded-full animate-pulse mr-1" style={{ animationDelay: "0.2s" }}></span>
                        <span className="h-2 w-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></span>
                      </span>
                    ) : "")}
                  </p>
                  <div
                    className={`mt-1 text-xs ${
                      message.role === "user" ? "text-blue-100" : "text-gray-400"
                    }`}
                  >
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 bg-white p-4">
        <form onSubmit={sendMessage} className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:bg-blue-400"
          >
            {sending ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}