"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
import SuggestedQuestions from "@/components/SuggestedQuestions";

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

  const handleStream = useCallback(async (response: Response) => {
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    const messageId = response.headers.get('X-Message-Id');

    if (!reader) return;

    try {
      // Store content for the current message
      let currentContent = "";
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        
        // Handle normal streaming content
        currentContent += chunk;
        setStreamedContent(currentContent);
      }
    } catch (error) {
      console.error("Error reading stream:", error);
    } finally {
      console.log("Stream ended, fetching latest message data...");
      
      // Fetch the updated message to get the suggested questions
      if (messageId) {
        try {
          const res = await fetch(`/api/chat/${params.id}/messages/${messageId}`);
          if (res.ok) {
            const data = await res.json();
            const updatedMessage = data.message;
            const chatSuggestedQuestions = data.chatSuggestedQuestions;
            
            // Update the chat with the latest message data
            setChat(prev => {
              if (!prev) return prev;
              
              return {
                ...prev,
                messages: prev.messages.map(msg => 
                  msg.id === messageId ? updatedMessage : msg
                ),
                suggestedQuestions: chatSuggestedQuestions
              };
            });
            
            // Update suggested questions state for the UI
            if (chatSuggestedQuestions) {
              try {
                const parsedQuestions = JSON.parse(chatSuggestedQuestions);
                setSuggestedQuestions(parsedQuestions);
                console.log("Updated suggested questions:", parsedQuestions);
              } catch (e) {
                console.error("Error parsing suggested questions:", e);
                setSuggestedQuestions([]);
              }
            } else {
              setSuggestedQuestions([]);
            }
            
            console.log("Updated message data:", updatedMessage);
          }
        } catch (err) {
          console.error("Error fetching updated message:", err);
        }
      }
      
      // Reset streaming state after a short delay to ensure smooth transition
      setTimeout(() => {
        setIsStreaming(false);
      }, 100);
    }
  }, [params.id]);

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
        createdAt: new Date().toISOString(),
        chatId: params.id,
        userId: session?.user?.id || "",
        cost: 0,
        paid: false
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
        createdAt: new Date().toISOString(),
        chatId: params.id,
        userId: session?.user?.id || "",
        cost: 0,
        paid: false
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
      await handleStream(res);

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

  // Handle clicking on a suggested question
  const handleSuggestedQuestionClick = (question: string) => {
    setInput(question);
    // Auto-submit if desired
    sendMessage({ preventDefault: () => {} } as React.FormEvent);
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
        
        {/* Show suggested questions only when not streaming */}
        {!isStreaming && suggestedQuestions.length > 0 && (
          <div className="mx-auto max-w-4xl mb-4">
            <SuggestedQuestions
              questions={suggestedQuestions}
              onQuestionClick={handleSuggestedQuestionClick}
              isLoading={false}
            />
          </div>
        )}
      </div>
      
      <ChatInput
        input={input}
        setInput={setInput}
        onSubmit={sendMessage}
        sending={sending}
        step={step}
        agent={chat.agent}
        suggestedQuestions={[]} // We're handling suggested questions above now
        onSuggestedQuestionClick={() => {}} // No-op since we handle it above
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