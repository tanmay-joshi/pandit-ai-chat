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
      <div className="flex min-h-screen items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-libre-bold">Manage Kundalis</h1>
          <p className="mt-2 text-muted-foreground font-libre-regular">
            Create and manage your kundali profiles for astrological consultations
          </p>
        </div>
        <Button 
          onClick={() => setShowNewKundaliModal(true)}
          className="font-libre-regular"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Kundali
        </Button>
      </div>

      {kundalis.length === 0 ? (
        <div className="rounded-2xl bg-[#F8F7F4] p-8 text-center border-[0.1rem] border-[#212121] shadow-[0_2px_10px_-3px_rgba(0,0,0,0.1),0_-1px_2px_-2px_rgba(0,0,0,0.1)]">
          <h3 className="text-lg font-libre-bold">No Kundalis Found</h3>
          <p className="mt-2 text-muted-foreground font-libre-regular">
            Create your first kundali to get started with consultations
          </p>
          <Button
            variant="outline"
            className="mt-4 font-libre-regular"
            onClick={() => setShowNewKundaliModal(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New Kundali
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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

      {/* Create/Edit Kundali Modal */}
      <Dialog 
        open={showNewKundaliModal || editingKundali !== null} 
        onOpenChange={() => {
          setShowNewKundaliModal(false);
          setEditingKundali(null);
          setNewKundali({ fullName: "", dateOfBirth: "", placeOfBirth: "" });
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-libre-bold">
              {editingKundali ? "Edit Kundali" : "Create New Kundali"}
            </DialogTitle>
            <DialogDescription className="font-libre-regular">
              {editingKundali 
                ? "Update the details of your kundali chart"
                : "Enter the details to create a new kundali chart"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={editingKundali ? handleUpdateKundali : handleCreateKundali} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="font-libre-regular">Full Name</Label>
              <Input
                id="fullName"
                value={newKundali.fullName}
                onChange={(e) => setNewKundali(prev => ({ ...prev, fullName: e.target.value }))}
                className="font-libre-regular"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth" className="font-libre-regular">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={newKundali.dateOfBirth}
                onChange={(e) => setNewKundali(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                className="font-libre-regular"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="placeOfBirth" className="font-libre-regular">Place of Birth</Label>
              <Input
                id="placeOfBirth"
                value={newKundali.placeOfBirth}
                onChange={(e) => setNewKundali(prev => ({ ...prev, placeOfBirth: e.target.value }))}
                className="font-libre-regular"
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
                className="font-libre-regular"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="font-libre-regular"
              >
                {isSubmitting
                  ? "Saving..."
                  : editingKundali
                  ? "Save Changes"
                  : "Create Kundali"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteConfirm !== null}
        onOpenChange={() => setShowDeleteConfirm(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-libre-bold">Delete Kundali</DialogTitle>
            <DialogDescription className="font-libre-regular">
              Are you sure you want to delete this kundali? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowDeleteConfirm(null)}
              className="font-libre-regular"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isSubmitting}
              onClick={() => showDeleteConfirm && handleDeleteKundali(showDeleteConfirm)}
              className="font-libre-regular"
            >
              {isSubmitting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
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