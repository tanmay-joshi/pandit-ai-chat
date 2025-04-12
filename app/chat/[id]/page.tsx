"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { ChatInput } from "@/components/chat/ChatInput";
import { InsufficientCreditsDialog } from "@/components/dialogs/InsufficientCreditsDialog";
import { Loading } from "@/components/ui/loading";
import { Chat } from "@/types/chat";

enum SelectionStep {
  Initial = 'initial',
  SelectAgent = 'agent',
  SelectKundali = 'kundali',
  Ready = 'ready',
  Chatting = 'chatting'
}

export default function ChatPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [chat, setChat] = useState<Chat | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<SelectionStep>(SelectionStep.Initial);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [showCreditsDialog, setShowCreditsDialog] = useState(false);
  const [creditsInfo, setCreditsInfo] = useState({ required: 0, available: 0 });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch chat data when component mounts
  useEffect(() => {
    async function fetchChat() {
      if (status === "unauthenticated") {
        router.push("/sign-in");
        return;
      }

      if (status === "authenticated") {
        try {
          const response = await fetch(`/api/chat/${params.id}`);
          if (!response.ok) {
            throw new Error("Failed to fetch chat");
          }
          const data = await response.json();
          setChat(data);
          setStep(SelectionStep.Chatting);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to load chat");
        } finally {
          setLoading(false);
        }
      }
    }

    fetchChat();
  }, [params.id, status, router]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !chat) return;

    setSending(true);
    setError(null);
    
    try {
      const res = await fetch(`/api/chat/${params.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: input.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        if (res.status === 402) { // Payment Required
          setCreditsInfo({
            required: data.required,
            available: data.balance
          });
          setShowCreditsDialog(true);
          return;
        }
        throw new Error(data.error || "Failed to send message");
      }

      const newMessage = await res.json();
      
      setChat(prev => prev ? {
        ...prev,
        messages: [...prev.messages, newMessage]
      } : prev);
      setInput("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center neu-container">
        <Loading size="lg" />
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center neu-container">
        <h1 className="neu-title neu-xl">Chat not found</h1>
        <button 
          onClick={() => router.push("/chat")} 
          className="mt-4 neu-text text-primary hover:underline"
        >
          Back to chats
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden neu-container">
      <ChatHeader 
        title={chat.title}
        agent={chat.agent}
        kundalis={chat.kundalis}
      />
      
      <ChatMessages
        messages={chat.messages}
        agent={chat.agent}
        kundalis={chat.kundalis}
        error={error}
        sending={sending}
        step={step}
        onScrollBottom={() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })}
      />
      
      <ChatInput
        input={input}
        setInput={setInput}
        onSubmit={sendMessage}
        sending={sending}
        step={step}
        agent={chat.agent}
        suggestedQuestions={suggestedQuestions}
        onSuggestedQuestionClick={(question) => {
          setInput(question);
        }}
      />

      <InsufficientCreditsDialog
        isOpen={showCreditsDialog}
        onClose={() => setShowCreditsDialog(false)}
        requiredCredits={creditsInfo.required}
        availableCredits={creditsInfo.available}
      />

      {error && (
        <div className="fixed bottom-4 right-4 neu-error">
          {error}
        </div>
      )}
    </div>
  );
}