"use client";

import { useRef, useState } from "react";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Message } from "../lib/types";
import ChatBubble from "./chatBubble";

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (input.trim() === "") return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response");
      }

      const botMessage = await response.json();
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      // Add an error message to the chat
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "Sorry, there was an error processing your request.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-4 h-[500px] overflow-y-auto flex flex-col gap-4">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-center">
            <p className="text-muted-foreground">
              Ask Pandit AI a question to get started.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <ChatBubble key={message.id} message={message} />
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted p-3 rounded-lg">
              <div className="animate-pulse">Thinking...</div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="flex w-full items-center space-x-2"
        >
          <Textarea
            id="message"
            placeholder="Type your message here..."
            className="min-h-10 flex-1 resize-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                formRef.current?.requestSubmit();
              }
            }}
          />
          <Button type="submit" size="icon" disabled={isLoading}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
} 