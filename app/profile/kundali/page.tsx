"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loading } from "@/components/ui/loading";
import { Plus } from "lucide-react";
import { KundaliCard } from "@/components/KundaliCard";
import type { Kundali } from "@/types/kundali";

export default function KundaliManagementPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [kundalis, setKundalis] = useState<Kundali[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewKundaliModal, setShowNewKundaliModal] = useState(false);
  const [editingKundali, setEditingKundali] = useState<Kundali | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

    fetchKundalis();
  }, [status, router]);

  const fetchKundalis = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/kundali");
      if (!res.ok) throw new Error("Failed to fetch kundalis");
      const data = await res.json();
      setKundalis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch kundalis");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateKundali = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateKundali = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingKundali) return;

    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/kundali/${editingKundali.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newKundali),
      });

      if (!res.ok) throw new Error("Failed to update kundali");

      const updatedKundali = await res.json();
      setKundalis(prev => prev.map(k => k.id === updatedKundali.id ? updatedKundali : k));
      setEditingKundali(null);
      setNewKundali({ fullName: "", dateOfBirth: "", placeOfBirth: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update kundali");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteKundali = async (id: string) => {
    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/kundali/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete kundali");

      setKundalis(prev => prev.filter(k => k.id !== id));
      setShowDeleteConfirm(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete kundali");
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEdit = (kundali: Kundali) => {
    setEditingKundali(kundali);
    setNewKundali({
      fullName: kundali.fullName,
      dateOfBirth: new Date(kundali.dateOfBirth).toISOString().split('T')[0],
      placeOfBirth: kundali.placeOfBirth
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center neu-container">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden neu-container">
      <header className="px-4 py-6">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="neu-title neu-2xl">Manage Kundalis</h1>
              <p className="mt-2 neu-text">
                Create and manage your kundali profiles for astrological consultations
              </p>
            </div>
            <Button 
              onClick={() => setShowNewKundaliModal(true)}
              className="neu-button neu-button-hover"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Kundali
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl p-4">
          {kundalis.length === 0 ? (
            <div className="neu-card text-center">
              <h3 className="neu-title neu-lg">No Kundalis Found</h3>
              <p className="mt-2 neu-text">
                Create your first kundali to get started with consultations
              </p>
              <Button
                variant="outline"
                className="mt-4 neu-button neu-button-hover"
                onClick={() => setShowNewKundaliModal(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create New Kundali
              </Button>
            </div>
          ) : (
            <div className="neu-grid md:grid-cols-2 lg:grid-cols-3">
              {kundalis.map((kundali) => (
                <KundaliCard
                  key={kundali.id}
                  kundali={kundali}
                  onEdit={startEdit}
                  onDelete={(id) => setShowDeleteConfirm(id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Kundali Modal */}
      <Dialog 
        open={showNewKundaliModal || editingKundali !== null} 
        onOpenChange={() => {
          setShowNewKundaliModal(false);
          setEditingKundali(null);
          setNewKundali({ fullName: "", dateOfBirth: "", placeOfBirth: "" });
        }}
      >
        <DialogContent className="neu-container">
          <DialogHeader>
            <DialogTitle className="neu-title neu-xl">
              {editingKundali ? "Edit Kundali" : "Create New Kundali"}
            </DialogTitle>
            <DialogDescription className="neu-text">
              {editingKundali 
                ? "Update the details of your kundali chart"
                : "Enter the details to create a new kundali chart"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={editingKundali ? handleUpdateKundali : handleCreateKundali} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="neu-text">Full Name</Label>
              <Input
                id="fullName"
                value={newKundali.fullName}
                onChange={(e) => setNewKundali(prev => ({ ...prev, fullName: e.target.value }))}
                className="neu-inset w-full"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth" className="neu-text">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={newKundali.dateOfBirth}
                onChange={(e) => setNewKundali(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                className="neu-inset w-full"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="placeOfBirth" className="neu-text">Place of Birth</Label>
              <Input
                id="placeOfBirth"
                value={newKundali.placeOfBirth}
                onChange={(e) => setNewKundali(prev => ({ ...prev, placeOfBirth: e.target.value }))}
                className="neu-inset w-full"
                required
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowNewKundaliModal(false);
                  setEditingKundali(null);
                }}
                className="neu-button"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="neu-button neu-button-hover"
              >
                {isSubmitting ? (
                  <Loading size="sm" />
                ) : editingKundali ? (
                  "Update Kundali"
                ) : (
                  "Create Kundali"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!showDeleteConfirm}
        onOpenChange={() => setShowDeleteConfirm(null)}
      >
        <DialogContent className="neu-container">
          <DialogHeader>
            <DialogTitle className="neu-title neu-xl">Delete Kundali</DialogTitle>
            <DialogDescription className="neu-text">
              Are you sure you want to delete this kundali? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowDeleteConfirm(null)}
              className="neu-button"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={() => showDeleteConfirm && handleDeleteKundali(showDeleteConfirm)}
              className="neu-button neu-button-hover bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSubmitting ? <Loading size="sm" /> : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 