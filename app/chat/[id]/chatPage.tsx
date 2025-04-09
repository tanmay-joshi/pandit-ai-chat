"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

type Message = {
  id: string;
  content: string;
  role: "user" | "assistant"; 
  createdAt: string;
  hasOptions?: boolean;
};

type Agent = {
  id: string;
  name: string;
  description: string;
  avatar: string | null;
  systemPrompt: string;
  messageCost: number;
  tags?: string | null;
};

type Kundali = {
  id: string;
  fullName: string;
  dateOfBirth: string;
  placeOfBirth: string;
};

type Chat = {
  id: string;
  title: string;
  messages: Message[];
  agent?: Agent | null;
  kundali?: Kundali | null;
};

enum SelectionStep {
  Initial = 'initial',
  SelectAgent = 'agent',
  SelectKundali = 'kundali',
  Ready = 'ready',
  Chatting = 'chatting'
}

export default function ChatPageClient({ id }: { id: string }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [chat, setChat] = useState<Chat | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // New chat setup states
  const [agents, setAgents] = useState<Agent[]>([]);
  const [kundalis, setKundalis] = useState<Kundali[]>([]);
  const [step, setStep] = useState<SelectionStep>(SelectionStep.Initial);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [selectedKundaliId, setSelectedKundaliId] = useState<string | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const [isCreatingChat, setIsCreatingChat] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  // Determine if this is a new chat or an existing chat
  const isNewChat = id === "new";

  // Fetch chat data for existing chats or initialize new chat flow
  useEffect(() => {
    if (status === "authenticated") {
      if (isNewChat) {
        initializeNewChat();
      } else if (id) {
        fetchExistingChat();
      }
    }
  }, [status, id, isNewChat]);

  // Initialize new chat selection process
  const initializeNewChat = async () => {
    try {
      setLoading(true);
      
      // Initial welcome message with agent selection prompt
      const initialMessages: Message[] = [
        {
          id: "welcome",
          content: "Welcome to Pandit AI! I'll help you set up your consultation. First, please select a Pandit you'd like to consult with:",
          role: "assistant" as const,
          createdAt: new Date().toISOString(),
          hasOptions: true
        }
      ];
      
      // Create initial chat state
      setChat({
        id: "new",
        title: "New Pandit AI Consultation",
        messages: initialMessages,
      });
      
      // Fetch and display agents
      await fetchAgents();
      setLoading(false);
    } catch (error) {
      console.error("Error initializing new chat:", error);
      setError("Failed to start new consultation. Please try again.");
      setLoading(false);
    }
  };

  // Fetch existing chat data
  const fetchExistingChat = async () => {
    try {
      const response = await fetch(`/api/chat/${id}`);
      if (!response.ok) {
        throw new Error("Chat not found");
      }
      const data = await response.json();
      setChat(data);
      setStep(SelectionStep.Chatting);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch chat:", error);
      setLoading(false);
      router.push("/chat");
    }
  };

  // Fetch agents
  const fetchAgents = async () => {
    try {
      console.log("Fetching agents...");
      const response = await fetch("/api/agents");
      
      console.log("Agents API status:", response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch agents: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Agents API response:", data);
      
      // Ensure data is an array before setting state
      if (Array.isArray(data)) {
        console.log("Setting agents array, length:", data.length);
        setAgents(data);
        setStep(SelectionStep.SelectAgent);
        return data;
      } else if (data.agents && Array.isArray(data.agents)) {
        // Handle case where agents are nested under an 'agents' property
        console.log("Found agents in nested property, length:", data.agents.length);
        setAgents(data.agents);
        setStep(SelectionStep.SelectAgent);
        return data.agents;
      } else {
        console.error("Expected array of agents but received:", data);
        setError("Received invalid data format for agents");
        setAgents([]);
        return [];
      }
    } catch (error) {
      console.error("Error fetching agents:", error);
      setError("Failed to load agents. Please try again.");
      setAgents([]);
      return [];
    }
  };

  // Fetch kundalis after agent selection
  const fetchKundalis = async () => {
    try {
      console.log("Fetching kundalis...");
      const response = await fetch("/api/kundali");
      
      console.log("Kundali API status:", response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch kundalis: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Kundali API response:", data);
      
      // Ensure data is an array before setting state
      let kundalisList: Kundali[] = [];
      
      if (Array.isArray(data)) {
        console.log("Setting kundalis array, length:", data.length);
        kundalisList = data;
        setKundalis(data);
      } else if (data.kundalis && Array.isArray(data.kundalis)) {
        // Handle case where kundalis are nested under a 'kundalis' property
        console.log("Found kundalis in nested property, length:", data.kundalis.length);
        kundalisList = data.kundalis;
        setKundalis(data.kundalis);
      } else {
        console.error("Expected array of kundalis but received:", data);
        setError("Received invalid data format for kundalis");
        setKundalis([]);
        return [];
      }
      
      // Set the step for selection
      setStep(SelectionStep.SelectKundali);
      
      return kundalisList;
    } catch (error) {
      console.error("Error fetching kundalis:", error);
      setError("Failed to load kundalis. Please try again.");
      setKundalis([]);
      return [];
    }
  };

  // Handle agent selection
  const handleAgentSelect = async (agent: Agent) => {
    console.log("Agent selected:", agent.name, agent.id);
    setSelectedAgentId(agent.id);
    
    // Add user selection message
    const userSelectMessage: Message = {
      id: `user-agent-${Date.now()}`,
      content: `I'd like to consult with ${agent.name}`,
      role: "user" as const,
      createdAt: new Date().toISOString(),
    };
    
    // Update chat with user selection
    if (chat) {
      setChat({
        ...chat,
        messages: [...chat.messages, userSelectMessage]
      });
    }
    
    try {
      // Fetch kundalis
      const kundaliData = await fetchKundalis();
      
      if (!kundaliData || kundaliData.length === 0) {
        // If no kundalis, prompt to create one
        if (chat) {
          setChat(prev => {
            if (!prev) return prev;
            return {
              ...prev,
              messages: [
                ...prev.messages,
                {
                  id: "no-kundali",
                  content: "You don't have any Kundalis saved. Please create one to continue.",
                  role: "assistant" as const,
                  createdAt: new Date().toISOString(),
                }
              ]
            };
          });
        }
      } else {
        // Add kundali selection prompt
        if (chat) {
          setChat(prev => {
            if (!prev) return prev;
            return {
              ...prev,
              messages: [
                ...prev.messages,
                {
                  id: "kundali-prompt",
                  content: "Great! Now, please select a Kundali (birth chart) for your consultation:",
                  role: "assistant" as const,
                  createdAt: new Date().toISOString(),
                  hasOptions: true
                }
              ]
            };
          });
        }
      }
    } catch (error) {
      console.error("Error after agent selection:", error);
      if (chat) {
        setChat(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            messages: [
              ...prev.messages,
              {
                id: "error",
                content: "There was an error loading your Kundalis. Please try again.",
                role: "assistant" as const,
                createdAt: new Date().toISOString(),
              }
            ]
          };
        });
      }
    }
  };

  // Handle kundali selection
  const handleKundaliSelect = async (kundali: Kundali) => {
    setSelectedKundaliId(kundali.id);
    
    if (chat) {
      // Add selection message to chat
      setChat({
        ...chat,
        messages: [
          ...chat.messages,
          {
            id: `user-kundali-${Date.now()}`,
            content: `I'll use the birth chart for ${kundali.fullName}`,
            role: "user" as const,
            createdAt: new Date().toISOString(),
          }
        ]
      });
      
      // Show loading message
      setChat({
        ...chat,
        messages: [
          ...chat.messages,
          {
            id: `creating-${Date.now()}`,
            content: "Creating your consultation...",
            role: "assistant" as const,
            createdAt: new Date().toISOString(),
          }
        ]
      });
    }
    
    // Create chat
    try {
      setIsCreatingChat(true);
      
      // Get the selected agent
      const selectedAgent = agents.find(a => a.id === selectedAgentId);
      
      // Create a descriptive title
      const chatTitle = selectedAgent 
        ? `${selectedAgent.name} consultation for ${kundali.fullName}`
        : `Consultation for ${kundali.fullName}`;
      
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          title: chatTitle, 
          agentId: selectedAgentId,
          kundaliId: kundali.id
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create chat");
      }

      const newChat = await res.json();
      setChatId(newChat.id);
      
      // Update with the new chat ID
      if (chat) {
        setChat({
          ...chat,
          id: newChat.id,
          title: chatTitle,
          messages: [
            ...chat.messages,
            {
              id: `ready-${Date.now()}`,
              content: "Your consultation is ready! You can now type your first message to begin the session.",
              role: "assistant" as const,
              createdAt: new Date().toISOString(),
            }
          ],
          agent: agents.find(a => a.id === selectedAgentId) || null,
          kundali: kundali
        });
      }
      
      setStep(SelectionStep.Ready);
      
      // Dispatch custom event for sidebar to refresh chats
      window.dispatchEvent(new CustomEvent('chat-created', { 
        detail: { 
          id: newChat.id,
          title: chatTitle
        }
      }));
      
      // Update the URL without refreshing the page
      if (isNewChat) {
        router.replace(`/chat/${newChat.id}`, { scroll: false });
      }
    } catch (error) {
      console.error("Error creating chat:", error);
      setError(error instanceof Error ? error.message : "Failed to create chat");
      
      // Add error message
      if (chat) {
        setChat({
          ...chat,
          messages: [
            ...chat.messages,
            {
              id: `error-${Date.now()}`,
              content: `Error: ${error instanceof Error ? error.message : "Failed to create chat"}. Please try again.`,
              role: "assistant" as const,
              createdAt: new Date().toISOString(),
            }
          ]
        });
      }
    } finally {
      setIsCreatingChat(false);
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !chat) return;

    let targetId = id;
    if (isNewChat && chatId) {
      targetId = chatId;
    }

    if (!targetId || targetId === "new") {
      setError("Chat setup is not complete. Please select a Pandit and Kundali first.");
      return;
    }

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

    // Check if this is the first user message and update the title if needed
    // Only do this for relatively new chats that still have generic titles
    if (chat && chat.messages.length <= 3 && 
        (chat.title === "New Pandit AI Consultation" || 
         chat.title.startsWith("Consultation for") || 
         chat.title.includes("consultation for"))) {
      // Create a more specific title from the user's first question
      let updatedTitle = userMessage;
      // Trim to reasonable length (50 chars) and add ellipsis if needed
      if (updatedTitle.length > 50) {
        updatedTitle = updatedTitle.substring(0, 47) + "...";
      }
      
      // Update chat title locally
      setChat(prev => prev ? { ...prev, title: updatedTitle } : prev);
      
      // Also update the title in the database
      try {
        await fetch(`/api/chat/${targetId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title: updatedTitle }),
        });

        // Dispatch custom event for sidebar to update chat title
        window.dispatchEvent(new CustomEvent('chat-updated', { 
          detail: { 
            id: targetId,
            title: updatedTitle
          }
        }));
      } catch (error) {
        console.error("Failed to update chat title:", error);
        // Non-critical error, so just log it and continue
      }
    }

    try {
      console.log("Sending message to API...");
      // Send the message to the API with streaming response
      const response = await fetch(`/api/chat/${targetId}/messages`, {
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
      
      // After first message is sent in a new chat, move to chatting state
      if (step === SelectionStep.Ready) {
        setStep(SelectionStep.Chatting);
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

  // Render agent options
  const renderAgentOptions = () => {
    if (step !== SelectionStep.SelectAgent || !agents || agents.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {agents.map((agent) => (
          <Button
            key={agent.id}
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => handleAgentSelect(agent)}
          >
            {agent.avatar ? (
              <div className="relative w-4 h-4 rounded-full overflow-hidden">
                <Image
                  src={agent.avatar}
                  alt={agent.name}
                  width={16}
                  height={16}
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-700 text-[10px] font-bold">{agent.name.charAt(0)}</span>
              </div>
            )}
            {agent.name}
          </Button>
        ))}
      </div>
    );
  };

  // Render kundali options
  const renderKundaliOptions = () => {
    console.log("Rendering kundali options", { 
      step, 
      kundalisLength: kundalis?.length || 0, 
      kundalisData: kundalis 
    });
    
    if (step !== SelectionStep.SelectKundali || !kundalis || kundalis.length === 0) {
      console.log("Not rendering kundali options because conditions not met");
      return null;
    }
    
    return (
      <div className="flex flex-col gap-2 mt-2">
        {kundalis.map((kundali) => (
          <Button
            key={kundali.id}
            variant="outline"
            className="justify-start text-left"
            onClick={() => handleKundaliSelect(kundali)}
          >
            <div>
              <div className="font-medium">{kundali.fullName}</div>
              <div className="text-xs text-gray-500">
                Born: {new Date(kundali.dateOfBirth).toLocaleDateString()} in {kundali.placeOfBirth}
              </div>
            </div>
          </Button>
        ))}
        <Button 
          variant="link" 
          className="self-start mt-1"
          onClick={() => router.push("/kundali")}
        >
          + Add a new Kundali
        </Button>
      </div>
    );
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
            {chat.kundali && (
              <div className="flex items-center ml-3 px-2 py-1 bg-purple-50 rounded-full text-sm">
                <div className="w-5 h-5 mr-1 rounded-full bg-purple-200 flex items-center justify-center">
                  <span className="text-purple-700 text-xs font-bold">K</span>
                </div>
                <span className="text-purple-700">{chat.kundali.fullName}</span>
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
              <p className="mb-3 max-w-md text-center text-gray-600">
                {chat.agent.description}
              </p>
            )}
            {chat.kundali && (
              <div className="mb-6 max-w-md bg-purple-50 p-4 rounded-lg">
                <h3 className="text-center text-purple-700 font-medium mb-2">Kundali Information</h3>
                <p className="text-sm text-center text-gray-700">
                  <span className="font-medium">Name:</span> {chat.kundali.fullName}<br />
                  <span className="font-medium">Born:</span> {new Date(chat.kundali.dateOfBirth).toLocaleString()}<br />
                  <span className="font-medium">Place:</span> {chat.kundali.placeOfBirth}
                </p>
              </div>
            )}
            <p className="text-center text-sm text-gray-500">
              Type your first message below to begin.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {chat.messages.map((message, index) => (
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
                  {message.role === "assistant" && chat.agent && step !== SelectionStep.Initial && (
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
                    
                    {/* Render options buttons for selection steps */}
                    {message.hasOptions && message.id === "welcome" && renderAgentOptions()}
                    {/* Ensure Kundali options are shown for the right message */}
                    {((message.hasOptions && message.id === "kundali-prompt") || 
                      (step === SelectionStep.SelectKundali && message.id === "kundali-prompt")) && renderKundaliOptions()}
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
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={step === SelectionStep.Ready || step === SelectionStep.Chatting 
              ? `Ask ${chat.agent ? chat.agent.name : 'anything'}...` 
              : "Please complete the setup process first..."}
            className="min-h-9 flex-1 resize-none rounded-l-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            disabled={sending || step !== SelectionStep.Ready && step !== SelectionStep.Chatting}
          />
          <Button
            type="submit"
            className="rounded-r-md"
            disabled={sending || !input.trim() || (step !== SelectionStep.Ready && step !== SelectionStep.Chatting)}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
        <div className="mt-2 text-xs text-gray-500">
          {step !== SelectionStep.Ready && step !== SelectionStep.Chatting ? (
            step === SelectionStep.Initial ? "Loading options..." : 
            step === SelectionStep.SelectAgent ? "Please select a Pandit to continue" : 
            "Please select a Kundali to continue"
          ) : (
            chat && chat.agent ? 
            `Each AI response costs ${chat.agent.messageCost} credits. Your messages are free.` :
            "Each AI response costs 10 credits. Your messages are free."
          )}
        </div>
      </div>
    </div>
  );
} 