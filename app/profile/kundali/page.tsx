"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loading } from "@/components/ui/loading";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

type Kundali = {
  id: string;
  fullName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  createdAt: string;
  updatedAt: string;
};

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
          <h1 className="text-3xl font-bold">Manage Kundalis</h1>
          <p className="mt-2 text-muted-foreground">
            Create and manage your kundali profiles for astrological consultations
          </p>
        </div>
        <Button onClick={() => setShowNewKundaliModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Kundali
        </Button>
      </div>

      {kundalis.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-8 text-center">
          <h3 className="text-lg font-semibold">No Kundalis Found</h3>
          <p className="mt-2 text-muted-foreground">
            Create your first kundali to get started with consultations
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => setShowNewKundaliModal(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New Kundali
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {kundalis.map((kundali) => (
            <div
              key={kundali.id}
              className="relative rounded-lg border border-border bg-card p-6"
            >
              <div className="mb-4">
                <h3 className="text-xl font-semibold">{kundali.fullName}</h3>
                <p className="text-sm text-muted-foreground">
                  Born: {new Date(kundali.dateOfBirth).toLocaleDateString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  Place: {kundali.placeOfBirth}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startEdit(kundali)}
                >
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(kundali.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
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
            <DialogTitle>
              {editingKundali ? "Edit Kundali" : "Create New Kundali"}
            </DialogTitle>
            <DialogDescription>
              {editingKundali 
                ? "Update the details of your kundali chart"
                : "Enter the details to create a new kundali chart"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={editingKundali ? handleUpdateKundali : handleCreateKundali} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={newKundali.fullName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  setNewKundali(prev => ({ ...prev, fullName: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={newKundali.dateOfBirth}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  setNewKundali(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="placeOfBirth">Place of Birth</Label>
              <Input
                id="placeOfBirth"
                value={newKundali.placeOfBirth}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  setNewKundali(prev => ({ ...prev, placeOfBirth: e.target.value }))}
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
                  setNewKundali({ fullName: "", dateOfBirth: "", placeOfBirth: "" });
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loading size="sm" className="mr-2" />
                ) : null}
                {editingKundali ? "Update" : "Create"}
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
            <DialogTitle>Delete Kundali</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this kundali? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowDeleteConfirm(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isSubmitting}
              onClick={() => showDeleteConfirm && handleDeleteKundali(showDeleteConfirm)}
            >
              {isSubmitting ? (
                <Loading size="sm" className="mr-2" />
              ) : null}
              Delete
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