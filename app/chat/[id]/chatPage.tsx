"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  createdAt: string;
};

type Agent = {
  id: string;
  name: string;
  description: string;
  avatar: string | null;
  systemPrompt: string;
};

type Chat = {
  id: string;
  title: string;
  messages: Message[];
  agent?: Agent | null;
};

export default function ChatPageClient({ id }: { id: string }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [chat, setChat] = useState<Chat | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  // Fetch chat data
  useEffect(() => {
    if (status === "authenticated" && id) {
      fetch(`/api/chat/${id}`)
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
  }, [status, id, router]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !chat || !id) return;

    // Clear any previous errors
    setError(null);
    
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
      const response = await fetch(`/api/chat/${id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: userMessage }),
      });

      if (!response.ok) {
        const data = await response.json();
        
        // Special handling for insufficient credits
        if (response.status === 402) {
          setError(`Insufficient credits. You have ${data.balance} credits, but need ${data.required} for this message.`);
        } else {
          setError(data.error || "Failed to send message");
        }
        
        // Remove the optimistic messages
        setChat((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            messages: prev.messages.filter(m => 
              m.id !== optimisticUserMsg.id && m.id !== optimisticAiMsg.id
            )
          };
        });
        
        throw new Error(data.error || `Failed to send message: ${response.status} ${response.statusText}`);
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
      
      // If we haven't already set an error message, set a generic one
      if (!error) {
        setError("Failed to send message. Please try again later.");
      }
      
      // Keep the user message but remove the AI message on error if we haven't already
      if (!error) {
        setChat((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            messages: prev.messages.filter(m => m.id !== optimisticAiMsg.id)
          };
        });
      }
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
          <div className="flex items-center">
            <h1 className="text-xl font-bold">{chat.title}</h1>
            {chat.agent && (
              <div className="flex items-center ml-3 px-2 py-1 bg-blue-50 rounded-full text-sm">
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
                <span className="text-blue-700">{chat.agent.name}</span>
              </div>
            )}
          </div>
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
        {/* Show error message if there is one */}
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4 text-red-700">
            <p>{error}</p>
            {error.includes("Insufficient credits") && (
              <Link href="/wallet/recharge" className="mt-2 inline-block font-medium text-red-700 hover:underline">
                Recharge your wallet
              </Link>
            )}
          </div>
        )}
        
        {chat.messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center">
            <div className="mb-4 rounded-full bg-blue-100 p-3">
              {chat.agent && chat.agent.avatar ? (
                <div className="relative h-16 w-16 overflow-hidden rounded-full">
                  <Image
                    src={chat.agent.avatar}
                    alt={chat.agent.name}
                    width={64}
                    height={64}
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-200">
                  <span className="text-2xl font-bold text-blue-700">
                    {chat.agent ? chat.agent.name.charAt(0) : "P"}
                  </span>
                </div>
              )}
            </div>
            <h2 className="mb-2 text-xl font-medium">
              {chat.agent ? `Welcome to your consultation with ${chat.agent.name}` : "Start your conversation"}
            </h2>
            {chat.agent && (
              <p className="mb-6 max-w-md text-center text-gray-600">
                {chat.agent.description}
              </p>
            )}
            <p className="text-center text-sm text-gray-500">
              Type your first message below to begin.
            </p>
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
                  className={`max-w-3/4 rounded-lg px-4 py-2 ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "border border-gray-200 bg-white"
                  }`}
                >
                  {message.role === "assistant" && chat.agent && (
                    <div className="mb-1 flex items-center">
                      {chat.agent.avatar ? (
                        <div className="relative mr-2 h-5 w-5 overflow-hidden rounded-full">
                          <Image
                            src={chat.agent.avatar}
                            alt={chat.agent.name}
                            width={20}
                            height={20}
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100">
                          <span className="text-xs font-bold text-blue-700">
                            {chat.agent.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <span className="text-xs font-medium text-blue-600">
                        {chat.agent.name}
                      </span>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap">
                    {message.content || (message.role === "assistant" && sending ? (
                      <div className="flex items-center">
                        <div className="mr-2 h-2 w-2 animate-pulse rounded-full bg-gray-300"></div>
                        <div className="mr-2 h-2 w-2 animate-pulse rounded-full bg-gray-300 delay-100"></div>
                        <div className="h-2 w-2 animate-pulse rounded-full bg-gray-300 delay-200"></div>
                      </div>
                    ) : '')}
                  </div>
                  <div className="mt-1 text-right text-xs opacity-50">
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-gray-200 bg-white p-4">
        <form onSubmit={sendMessage} className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask ${chat.agent ? chat.agent.name : 'anything'}...`}
            className="flex-1 rounded-l-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            disabled={sending}
          />
          <button
            type="submit"
            className="rounded-r-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:bg-blue-400"
            disabled={sending || !input.trim()}
          >
            Send
          </button>
        </form>
        <div className="mt-2 text-xs text-gray-500">
          Each AI response costs 10 credits. Your messages are free.
        </div>
      </div>
    </div>
  );
} 