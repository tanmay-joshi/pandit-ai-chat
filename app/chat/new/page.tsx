"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loading } from "@/components/ui/loading";
import { Plus, ArrowLeft, Star, Clock, Users } from "lucide-react";
import { AgentCard } from "@/components/AgentCard";
import { KundaliCard } from "@/components/KundaliCard";
import type { Kundali } from "@/types/kundali";
import { logger } from "@/lib/logger";

type Agent = {
  id: string;
  name: string;
  description: string;
  avatar: string | null;
  expertise?: string[];
  messageCost: number;
  kundaliLimit: number;
};

enum SelectionStep {
  SelectAgent = "agent",
  SelectKundali = "kundali",
}

export default function NewChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [step, setStep] = useState<SelectionStep>(SelectionStep.SelectAgent);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [kundalis, setKundalis] = useState<Kundali[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [selectedKundali, setSelectedKundali] = useState<Kundali | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [showNewKundaliModal, setShowNewKundaliModal] = useState(false);
  const [newKundali, setNewKundali] = useState({
    fullName: "",
    dateOfBirth: "",
    placeOfBirth: ""
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    Promise.all([fetchAgents(), fetchKundalis()]).then(() => setLoading(false));
  }, [status, router]);

  const fetchAgents = async () => {
    try {
      const res = await fetch("/api/agents");
      if (!res.ok) throw new Error("Failed to fetch agents");
      const data = await res.json();
      setAgents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch agents");
    }
  };

  const fetchKundalis = async () => {
    try {
      const res = await fetch("/api/kundali");
      if (!res.ok) throw new Error("Failed to fetch kundalis");
      const data = await res.json();
      setKundalis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch kundalis");
    }
  };

  const handleAgentSelect = (agent: Agent) => {
    setSelectedAgent(agent);
    setStep(SelectionStep.SelectKundali);
  };

  const handleKundaliSelect = (kundali: Kundali) => {
    setSelectedKundali(kundali);
  };

  const handleCreateKundali = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/kundali", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newKundali),
      });

      if (!res.ok) throw new Error("Failed to create kundali");

      const createdKundali = await res.json();
      setKundalis(prev => [...prev, createdKundali]);
      setShowNewKundaliModal(false);
      setNewKundali({ fullName: "", dateOfBirth: "", placeOfBirth: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create kundali");
    }
  };

  const handleCreateChat = async () => {
    if (!selectedAgent || !selectedKundali) return;

    try {
      setIsCreatingChat(true);
      logger.info("Creating chat with agent & kundali:", {
        agentId: selectedAgent.id,
        kundaliId: selectedKundali.id
      });
      
      const requestBody = {
        agentId: selectedAgent.id,
        kundaliIds: [selectedKundali.id],
      };
      
      logger.debug("Request body:", requestBody);
      
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        const errorData = await res.json();
        logger.error("Chat creation failed:", errorData);
        throw new Error(errorData.error || "Failed to create chat");
      }

      const createdChat = await res.json();
      logger.info("Chat created successfully:", createdChat.id);
      router.push(`/chat/${createdChat.id}`);
    } catch (err) {
      logger.error("Error creating chat:", err);
      setError(err instanceof Error ? err.message : "Failed to create chat");
      setIsCreatingChat(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {step === SelectionStep.SelectAgent ? (
        <>
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-libre-bold">Choose Your Guide</h1>
            <p className="mt-2 text-muted-foreground font-libre-regular">
              Select an astrologer to begin your consultation
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {agents.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                isSelected={selectedAgent?.id === agent.id}
                onSelect={() => handleAgentSelect(agent)}
              />
            ))}
          </div>
        </>
      ) : (
        <div>
          <div className="mb-8">
            <Button
              variant="ghost"
              className="mb-4"
              onClick={() => setStep(SelectionStep.SelectAgent)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Agents
            </Button>
            <div className="flex items-center gap-4">
              <div>
                <h2 className="text-2xl font-libre-bold">{selectedAgent?.name}</h2>
                <p className="text-muted-foreground font-libre-regular">
                  Select a kundali for consultation
                </p>
              </div>
            </div>
          </div>

          {kundalis.length === 0 ? (
            <div className="rounded-2xl bg-[#F8F7F4] p-8 text-center border-[0.1rem] border-[#212121] shadow-[0_2px_10px_-3px_rgba(0,0,0,0.1),0_-1px_2px_-2px_rgba(0,0,0,0.1)]">
              <h3 className="text-lg font-libre-bold">No Kundalis Found</h3>
              <p className="mt-2 text-muted-foreground font-libre-regular">
                Create a kundali in your profile to start a consultation
              </p>
              <Button
                variant="outline"
                className="mt-4 font-libre-regular"
                onClick={() => router.push("/profile/kundali")}
              >
                Create New Kundali
              </Button>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {kundalis.map((kundali) => (
                  <KundaliCard
                    key={kundali.id}
                    kundali={kundali}
                    selectable
                    selected={selectedKundali?.id === kundali.id}
                    onSelect={handleKundaliSelect}
                  />
                ))}
              </div>

              <div className="mt-8 flex justify-center">
                <Button
                  size="lg"
                  disabled={!selectedKundali}
                  onClick={handleCreateChat}
                  className="font-libre-regular"
                >
                  {isCreatingChat ? (
                    <Loading size="sm" className="mr-2" />
                  ) : null}
                  Start Consultation
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      {/* New Kundali Modal */}
      <Dialog open={showNewKundaliModal} onOpenChange={setShowNewKundaliModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Kundali</DialogTitle>
            <DialogDescription>
              Enter the details to create a new kundali chart.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateKundali} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={newKundali.fullName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewKundali(prev => ({ ...prev, fullName: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={newKundali.dateOfBirth}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewKundali(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="placeOfBirth">Place of Birth</Label>
              <Input
                id="placeOfBirth"
                value={newKundali.placeOfBirth}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewKundali(prev => ({ ...prev, placeOfBirth: e.target.value }))}
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowNewKundaliModal(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Kundali</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {error && (
        <div className="fixed bottom-4 right-4 bg-destructive text-destructive-foreground px-4 py-2 rounded-md shadow-lg">
          {error}
        </div>
      )}
    </div>
  );
} 