"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { ChatInput } from "@/components/chat/ChatInput";
import { InsufficientCreditsDialog } from "@/components/dialogs/InsufficientCreditsDialog";
import { Loading } from "@/components/ui/loading";
import { Chat, Message } from "@/types/chat";
import { SelectionStep } from "@/types/enums";
import { generateTempMessageId } from "@/lib/utils";

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
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedContent, setStreamedContent] = useState("");
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
    if (!input.trim() || !chat || sending) return;

    setSending(true);
    setError(null);
    setIsStreaming(true);
    setStreamedContent("");
    
    try {
      // Add user message immediately
      const userMessage: Message = {
        id: generateTempMessageId(),
        content: input.trim(),
        role: "user",
        createdAt: new Date().toISOString()
      };

      setChat(prev => prev ? {
        ...prev,
        messages: [...prev.messages, userMessage]
      } : prev);

      // Create placeholder for AI response
      const placeholderAIMessage: Message = {
        id: generateTempMessageId(),
        content: "",
        role: "assistant",
        createdAt: new Date().toISOString()
      };

      setChat(prev => prev ? {
        ...prev,
        messages: [...prev.messages, placeholderAIMessage]
      } : prev);

      const res = await fetch(`/api/chat/${params.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: input.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        if (res.status === 402) {
          setCreditsInfo({
            required: data.required,
            available: data.balance
          });
          setShowCreditsDialog(true);
          return;
        }
        throw new Error(data.error || "Failed to send message");
      }

      // Get the message ID from the response headers
      const messageId = res.headers.get('X-Message-Id');

      // Handle streaming response
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          accumulatedContent += chunk;
          setStreamedContent(accumulatedContent);

          // Update the AI message in chat state
          setChat(prev => {
            if (!prev) return prev;
            const updatedMessages = [...prev.messages];
            const lastMessageIndex = updatedMessages.length - 1;
            if (lastMessageIndex >= 0) {
              updatedMessages[lastMessageIndex] = {
                ...updatedMessages[lastMessageIndex],
                content: accumulatedContent,
                id: messageId || updatedMessages[lastMessageIndex].id
              };
            }
            return { ...prev, messages: updatedMessages };
          });
        }
      }

      setInput("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
      // Remove the temporary AI message on error
      setChat(prev => prev ? {
        ...prev,
        messages: prev.messages.slice(0, -1)
      } : prev);
    } finally {
      setSending(false);
      setIsStreaming(false);
      setStreamedContent("");
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
      
      <div className="flex-1 overflow-y-auto bg-blue">
        <ChatMessages
          messages={chat.messages}
          agent={chat.agent ?? null}
          kundalis={chat.kundalis ?? null}
          error={error}
          sending={sending}
          isStreaming={isStreaming}
          streamedContent={streamedContent}
          step={step}
          onScrollBottom={() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })}
        />
      </div>
      
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
      
      <div ref={messagesEndRef} />
    </div>
  );
}