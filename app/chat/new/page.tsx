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

type Agent = {
  id: string;
  name: string;
  description: string;
  avatar: string | null;
  systemPrompt: string;
  messageCost: number;
  tags?: string | null;
  kundaliLimit: number;
  expertise?: string[];
};

type Kundali = {
  id: string;
  fullName: string;
  dateOfBirth: string;
  placeOfBirth: string;
};

enum SelectionStep {
  SelectAgent = 'agent',
  SelectKundali = 'kundali'
}

export default function NewChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Setup states
  const [agents, setAgents] = useState<Agent[]>([]);
  const [kundalis, setKundalis] = useState<Kundali[]>([]);
  const [step, setStep] = useState<SelectionStep>(SelectionStep.SelectAgent);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [selectedKundaliIds, setSelectedKundaliIds] = useState<string[]>([]);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [showNewKundaliModal, setShowNewKundaliModal] = useState(false);
  const [newKundali, setNewKundali] = useState({
    fullName: "",
    dateOfBirth: "",
    placeOfBirth: ""
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [agentsRes, kundalisRes] = await Promise.all([
          fetch("/api/agents"),
          fetch("/api/kundali")
        ]);

        if (!agentsRes.ok || !kundalisRes.ok) {
          throw new Error("Failed to fetch initial data");
        }

        const [agentsData, kundalisData] = await Promise.all([
          agentsRes.json(),
          kundalisRes.json()
        ]);

        setAgents(agentsData);
        setKundalis(kundalisData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router, status]);

  const handleAgentSelect = (agent: Agent) => {
    setSelectedAgent(agent);
    setStep(SelectionStep.SelectKundali);
  };

  const handleKundaliSelect = (kundaliId: string) => {
    setSelectedKundaliIds(prev => {
      const isSelected = prev.includes(kundaliId);
      if (isSelected) {
        return prev.filter(id => id !== kundaliId);
      }
      if (selectedAgent && prev.length >= selectedAgent.kundaliLimit) {
        return prev;
      }
      return [...prev, kundaliId];
    });
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
    if (!selectedAgent || selectedKundaliIds.length === 0) return;

    try {
      setIsCreatingChat(true);
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: selectedAgent.id,
          kundaliIds: selectedKundaliIds,
        }),
      });

      if (!res.ok) throw new Error("Failed to create chat");

      const newChat = await res.json();
      router.push(`/chat/${newChat.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create chat");
    } finally {
      setIsCreatingChat(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
            Begin Your Spiritual Journey
          </h1>
        </div>

        {step === SelectionStep.SelectAgent && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {agents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  isSelected={selectedAgent?.id === agent.id}
                  onSelect={handleAgentSelect}
                />
              ))}
            </div>
          </div>
        )}

        {step === SelectionStep.SelectKundali && selectedAgent && (
          <div className="space-y-6">
            <button
              onClick={() => setStep(SelectionStep.SelectAgent)}
              className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Pandit Selection
            </button>

            <div className="bg-card rounded-xl p-6 border border-border mb-8">
              <div className="flex items-center gap-4 mb-6">
                {selectedAgent.avatar ? (
                  <Image
                    src={selectedAgent.avatar}
                    alt={selectedAgent.name}
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-15 h-15 rounded-full bg-primary/20 flex items-center justify-center text-xl font-bold text-primary">
                    {selectedAgent.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold">{selectedAgent.name}</h2>
                  <p className="text-muted-foreground">Select up to {selectedAgent.kundaliLimit} kundali(s) for consultation</p>
                </div>
              </div>
            </div>

            {kundalis.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-4">No Kundalis Found</h3>
                <p className="text-muted-foreground mb-6">Create your first kundali to begin the consultation</p>
                <Button onClick={() => setShowNewKundaliModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Kundali
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {kundalis.map((kundali) => (
                  <button
                    key={kundali.id}
                    onClick={() => handleKundaliSelect(kundali.id)}
                    className={`relative p-6 rounded-xl text-left transition-all duration-200 ${
                      selectedKundaliIds.includes(kundali.id)
                        ? "bg-primary/10 border-primary"
                        : "bg-card hover:bg-accent border-border"
                    } border`}
                  >
                    <h3 className="text-lg font-semibold mb-2">{kundali.fullName}</h3>
                    <p className="text-sm text-muted-foreground">Born: {new Date(kundali.dateOfBirth).toLocaleDateString()}</p>
                    <p className="text-sm text-muted-foreground">Place: {kundali.placeOfBirth}</p>
                  </button>
                ))}
                <button
                  onClick={() => setShowNewKundaliModal(true)}
                  className="flex flex-col items-center justify-center p-6 rounded-xl border border-dashed border-border hover:border-primary text-center bg-card hover:bg-accent transition-all duration-200"
                >
                  <Plus className="w-8 h-8 mb-2 text-muted-foreground" />
                  <span className="text-muted-foreground">Add New Kundali</span>
                </button>
              </div>
            )}

            {selectedKundaliIds.length > 0 && (
              <div className="fixed bottom-0 inset-x-0 bg-background/80 backdrop-blur-md border-t border-border p-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {selectedKundaliIds.length} kundali(s) selected
                  </p>
                  <Button onClick={handleCreateChat} disabled={isCreatingChat}>
                    {isCreatingChat ? (
                      <Loading size="sm" className="mr-2" />
                    ) : null}
                    Begin Consultation
                  </Button>
                </div>
              </div>
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
    </div>
  );
} 